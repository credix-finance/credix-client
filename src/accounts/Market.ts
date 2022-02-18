import { BN, web3 } from "@project-serum/anchor";
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import Big from "big.js";
import Fraction from "fraction.js";
import { BorrowerInfo, CredixClient, CredixPass, Deal, Ratio } from "..";
import { CredixProgram, GlobalMarketState } from "../idl/idl.types";
import { encodeSeedString } from "../utils/pda.utils";
import { asyncFilter } from "../utils/async.utils";
import { ZERO } from "../utils/math.utils";

/**
 * Represents a Credix market. Main entrypoint for market interactions
 */
export class Market {
	/**
	 * Name of the market
	 */
	name: string;
	/**
	 * Address of the market
	 */
	address: PublicKey;
	private program: CredixProgram;
	private programVersion: GlobalMarketState;
	private client: CredixClient;

	/**
	 * @ignore
	 */
	// TODO: move towards private constructor with static load function.
	// Right now we don't check whether the market data is from the on-chain data at address
	constructor(
		market: GlobalMarketState,
		name: string,
		program: CredixProgram,
		address: PublicKey,
		client: CredixClient
	) {
		this.programVersion = market;
		this.name = name;
		this.program = program;
		this.address = address;
		this.client = client;
	}

	/**
	 * Deposit into the market's liquidity pool
	 * @param amount Amount to deposit
	 * @returns
	 */
	async deposit(amount: Big) {
		const investor = this.program.provider.wallet.publicKey;
		const gatewayToken = await this.client.getGatewayToken(investor, this.gateKeeperNetwork);

		if (!gatewayToken) {
			throw Error("No valid Civic gateway token found");
		}

		const [signingAuthority] = await this.generateSigningAuthorityPDA();
		const investorTokenAccount = await this.findBaseTokenAccount(investor);
		const liquidityPoolTokenAccount = await this.findLiquidityPoolTokenAccount();
		const investorLPTokenAccount = await this.findLPTokenAccount(investor);
		const [credixPass] = await this.generateCredixPassPDA(investor);

		return this.program.rpc.depositFunds(new BN(amount.toNumber()), {
			accounts: {
				investor,
				gatewayToken: gatewayToken.publicKey,
				globalMarketState: this.address,
				signingAuthority: signingAuthority,
				investorTokenAccount: investorTokenAccount,
				liquidityPoolTokenAccount: liquidityPoolTokenAccount,
				lpTokenMintAccount: this.lpMintPK,
				investorLpTokenAccount: investorLPTokenAccount,
				baseMintAccount: this.baseMintPK,
				tokenProgram: TOKEN_PROGRAM_ID,
				credixPass,
				systemProgram: SystemProgram.programId,
				rent: web3.SYSVAR_RENT_PUBKEY,
				associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			},
		});
	}

	/**
	 * Withdraw from the market's liquidity pool
	 * @param amount Amount to withdraw
	 * @returns
	 */
	async withdraw(amount: Big) {
		const investor = this.program.provider.wallet.publicKey;
		const gatewayToken = await this.client.getGatewayToken(investor, this.gateKeeperNetwork);

		if (!gatewayToken) {
			throw Error("No valid Civic gateway token found");
		}

		const [signingAuthority] = await this.generateSigningAuthorityPDA();
		const investorTokenAccount = await this.findBaseTokenAccount(investor);
		const liquidityPoolTokenAccount = await this.findLiquidityPoolTokenAccount();
		const investorLPTokenAccount = await this.findLPTokenAccount(investor);
		const [credixPass] = await this.generateCredixPassPDA(investor);

		return this.program.rpc.withdrawFunds(new BN(amount.toNumber()), {
			accounts: {
				investor,
				gatewayToken: gatewayToken.publicKey,
				globalMarketState: this.address,
				signingAuthority: signingAuthority,
				investorLpTokenAccount: investorLPTokenAccount,
				investorTokenAccount: investorTokenAccount,
				liquidityPoolTokenAccount: liquidityPoolTokenAccount,
				treasuryPoolTokenAccount: this.treasury,
				lpTokenMintAccount: this.lpMintPK,
				credixPass,
				baseMintAccount: this.baseMintPK,
				tokenProgram: TOKEN_PROGRAM_ID,
				associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			},
		});
	}

	/**
	 * Create a deal for this market
	 * @param principal Principal of the deal
	 * @param financingFee Financing fee of the deal. This is the annualized interest rate that needs to be repaid on top of the principal
	 * @param timeToMaturity Time until the principal has to be repaid. Should be a multiple of 30.
	 * @param borrower Borrower for which we create the deal.
	 * @param dealName Name of the deal.
	 * @returns
	 */
	async createDeal(
		principal: Big,
		financingFee: number,
		timeToMaturity: number,
		borrower: PublicKey,
		dealName: string
	) {
		// TODO: add validations
		if (timeToMaturity % 30) {
			throw Error("Time to maturity needs to be a multiple of 30");
		}

		const gatewayToken = await this.client.getGatewayToken(borrower, this.gateKeeperNetwork);

		if (!gatewayToken) {
			throw new Error("No valid Civic gateway token found");
		}

		const [borrowerInfoAddress, borrowerInfoBump] = await BorrowerInfo.generatePDA(borrower, this);
		const borrowerInfo = await this.fetchBorrowerInfo(borrower);
		const dealNumber = borrowerInfo ? borrowerInfo.numberOfDeals + 1 : 0;
		const [dealAddress, dealBump] = await Deal.generatePDA(borrower, dealNumber, this);
		const [credixPassAddress] = await CredixPass.generatePDA(borrower, this);

		const principalAmount = new BN(principal.toNumber());
		// TODO: do we need this dependency?
		const financingFreeFraction = new Fraction(financingFee);
		const financingFeeRatio = new Ratio(financingFreeFraction.n, financingFreeFraction.d * 100);

		return this.program.rpc.createDeal(
			dealBump,
			borrowerInfoBump,
			principalAmount,
			financingFeeRatio.toIDLRatio(),
			0,
			0,
			timeToMaturity,
			dealName,
			{
				accounts: {
					owner: this.program.provider.wallet.publicKey,
					gatewayToken: gatewayToken.publicKey,
					borrower: borrower,
					borrowerInfo: borrowerInfoAddress,
					globalMarketState: this.address,
					credixPass: credixPassAddress,
					deal: dealAddress,
					systemProgram: SystemProgram.programId,
				},
			}
		);
	}

	/**
	 * Address of the program to which this market belongs
	 */
	get programId() {
		return this.program.programId;
	}

	/**
	 * Address of the base mint for this market. Base tokens are the currency deals are created for (e.g. USDC)
	 */
	get baseMintPK() {
		return this.programVersion.liquidityPoolTokenMintAccount;
	}

	/**
	 * Address of the mint of LP token.
	 */
	get lpMintPK() {
		return this.programVersion.lpTokenMintAccount;
	}

	/**
	 * Address of the treasury of this market
	 */
	get treasury() {
		return this.programVersion.treasuryPoolTokenAccount;
	}

	/**
	 * Withdrawal fee for this market
	 */
	get withdrawFee() {
		return this.programVersion.withdrawalFee;
	}

	/**
	 * Interest repayment fee for this market. This is taken from the repayments, not added on top.
	 */
	get interestFee() {
		return this.programVersion.interestFee;
	}

	/**
	 * Gets the current supply of LP tokens for the lp mint this market uses
	 * @returns
	 */
	getLPSupply() {
		const lpTokenMint = this.lpMintPK;
		return this.program.provider.connection
			.getTokenSupply(lpTokenMint)
			.then((response) => response.value);
	}

	/**
	 * Gets the current price of LP tokens in base
	 * @returns
	 */
	async getLPPrice() {
		const tvl = await this.calculateTVL();
		const lpSupply = await this.getLPSupply();
		const lpSupplyBig = new Big(lpSupply.amount);

		if (lpSupplyBig.eq(ZERO)) {
			return ZERO;
		}

		return tvl.div(lpSupplyBig);
	}

	/**
	 * Calculates the associated token account for the base mint of this market
	 * @param pk Public key to find the associated token account for
	 * @returns
	 */
	// TODO: move to Mint class when available
	findBaseTokenAccount(pk: PublicKey) {
		return Token.getAssociatedTokenAddress(
			ASSOCIATED_TOKEN_PROGRAM_ID,
			TOKEN_PROGRAM_ID,
			this.baseMintPK,
			pk,
			true
		);
	}

	/**
	 * Calculates the associated token account for the lp mint of this market
	 * @param pk Public key to find the associated token account for
	 * @returns
	 */
	// TODO: move to Mint class when available
	findLPTokenAccount(pk: PublicKey) {
		return Token.getAssociatedTokenAddress(
			ASSOCIATED_TOKEN_PROGRAM_ID,
			TOKEN_PROGRAM_ID,
			this.lpMintPK,
			pk,
			true
		);
	}

	/**
	 * Gets the amount of 'base' the user has
	 * @param user Public key for which we find the base balance
	 * @returns
	 */
	async userBaseBalance(user: PublicKey) {
		const userBaseTokenAccount = await this.findBaseTokenAccount(user);
		const response = await this.program.provider.connection.getTokenAccountBalance(
			userBaseTokenAccount
		);
		return response.value;
	}

	/**
	 * Gets the amount of LP the user has
	 * @param user Public key for which we find the LP amount
	 * @returns
	 */
	async userLPBalance(user: PublicKey) {
		const userLPTokenAccount = await this.findLPTokenAccount(user);
		const response = await this.program.provider.connection.getTokenAccountBalance(
			userLPTokenAccount
		);

		return response.value;
	}

	/**
	 * Gets how base is currently in the liquidity pool
	 * @returns
	 */
	async fetchLiquidityPoolBalance() {
		const liquidityPoolBaseTokenAccountPK = await this.findLiquidityPoolTokenAccount();
		const response = await this.program.provider.connection.getTokenAccountBalance(
			liquidityPoolBaseTokenAccountPK
		);
		return response.value;
	}

	/**
	 * Gets how much principal is currently being lend out in deals
	 */
	get totalOutstandingCredit() {
		return new Big(this.programVersion.totalOutstandingCredit.toNumber());
	}

	/**
	 * The gatekeeper network this market uses for identity identification
	 */
	get gateKeeperNetwork() {
		return this.programVersion.gatekeeperNetwork;
	}

	/**
	 * Fetches deal data
	 * @param borrower Borrower to which the deal belongs
	 * @param dealNumber The id of the deal, scoped to the borrower
	 * @returns
	 */
	async fetchDeal(borrower: PublicKey, dealNumber: number) {
		const [dealAddress] = await Deal.generatePDA(borrower, dealNumber, this);
		const programDeal = await this.program.account.deal.fetchNullable(dealAddress);

		if (!programDeal) {
			return programDeal;
		}

		return new Deal(programDeal, this, dealAddress, this.program, this.client);
	}

	/**
	 * Calculates the weighted average financing fee
	 * @returns
	 */
	async calculateWeightedAverageFinancingFee() {
		const deals = await this.fetchDeals();
		let principalSum = new Big(0);

		const runningFinancingFee = deals.reduce((result, deal) => {
			if (deal.isInProgress()) {
				const percentage = deal.financingFeePercentage.apply(deal.principal);
				principalSum = principalSum.add(deal.principal);
				result = result.add(percentage);
			}

			return result;
		}, new Big(0));

		if (principalSum.eq(0)) {
			return new Ratio(0, 1);
		}

		// TODO: what does ff mean?
		const ff = runningFinancingFee.div(principalSum);
		const numerator = ff.mul(100);

		return new Ratio(numerator.toNumber(), 100);
	}

	/**
	 * Calculates the total value locked of the market (liquidity pool balance + total outstanding credit)
	 * @returns
	 */
	async calculateTVL() {
		const liquidityPoolBalance = await this.fetchLiquidityPoolBalance();
		const base_in_liquidity_pool = new Big(liquidityPoolBalance.amount);

		return this.totalOutstandingCredit.add(base_in_liquidity_pool);
	}

	/**
	 * Fetches all the deals that belong to this market
	 * @returns
	 */
	async fetchDeals() {
		const deals = await this.program.account.deal.all();

		const marketDeals = await asyncFilter(deals, async (deal) => {
			const [dealPDA] = await Deal.generatePDA(
				deal.account.borrower,
				deal.account.dealNumber,
				this
			);

			return dealPDA.equals(deal.publicKey);
		});

		return marketDeals.map(
			(deal) => new Deal(deal.account, this, deal.publicKey, this.program, this.client)
		);
	}

	/**
	 * Fetches the account containing borrower info for this market
	 * @param borrower
	 * @returns
	 */
	async fetchBorrowerInfo(borrower: PublicKey) {
		const [address] = await BorrowerInfo.generatePDA(borrower, this);
		const programBorrower = await this.program.account.borrowerInfo.fetchNullable(address);

		if (!programBorrower) {
			return programBorrower;
		}

		return new BorrowerInfo(programBorrower, this, address, borrower, this.client);
	}

	/**
	 * Fetches a credix pass
	 * @param borrower Public key for which we fetch a credix pass
	 * @returns
	 */
	async fetchCredixPass(borrower: PublicKey) {
		const [passAddress] = await CredixPass.generatePDA(borrower, this);
		const pass = await this.program.account.credixPass.fetchNullable(passAddress);

		if (!pass) {
			return pass;
		}

		return new CredixPass(pass, passAddress);
	}

	/**
	 * Generate a market PDA address
	 * @param marketName
	 * @param programId
	 * @returns
	 */
	static generatePDA(marketName: string, programId: PublicKey) {
		const seed = encodeSeedString(marketName);
		return PublicKey.findProgramAddress([seed], programId);
	}

	// TODO: add pda generation tests with static, know, reference addresses
	private generateCredixPassPDA(pk: PublicKey) {
		const credixSeed = encodeSeedString("credix-pass");
		const seed = [this.address.toBuffer(), pk.toBuffer(), credixSeed];
		return PublicKey.findProgramAddress(seed, this.programId);
	}

	/**
	 * Generate the signing authority PDA address for this market
	 * @returns
	 */
	generateSigningAuthorityPDA() {
		const seed = [this.address.toBuffer()];
		return PublicKey.findProgramAddress(seed, this.programId);
	}

	/**
	 * Calculates the associated token account address for the liquidity pool
	 * @returns
	 */
	async findLiquidityPoolTokenAccount() {
		const [signingAuthorityPK] = await this.generateSigningAuthorityPDA();
		return this.findBaseTokenAccount(signingAuthorityPK);
	}

	/**
	 * Calculates the stake of a user expressed in base
	 * @param user Public key for which we check the stake
	 * @returns
	 */
	async getUserStake(user: PublicKey) {
		const lpPrice = await this.getLPPrice();
		const userLpTokenAmount = await this.userLPBalance(user);
		const userLpTokenAmountBig = new Big(userLpTokenAmount.amount);

		return userLpTokenAmountBig.mul(lpPrice);
	}

	/**
	 * Issue a credix pass. This function requires that the client wallet to belong to a management address
	 * @param pk Public key for which we issue a credix pass
	 * @param underwriter Enable underwriter functionality.
	 * @param borrower Enable borrower functionality (creation of deals)
	 * @returns
	 */
	async issueCredixPass(pk: PublicKey, underwriter: boolean, borrower: boolean) {
		const [credixPassAddress, credixPassBump] = await CredixPass.generatePDA(pk, this);

		return this.program.rpc.createCredixPass(credixPassBump, underwriter, borrower, {
			accounts: {
				owner: this.program.provider.wallet.publicKey,
				passHolder: pk,
				credixPass: credixPassAddress,
				systemProgram: SystemProgram.programId,
				rent: SYSVAR_RENT_PUBKEY,
				globalMarketState: this.address,
			},
		});
	}

	/**
	 * Update a credix pass. This function requires that the client wallet to belong to a management address
	 * @param pk Public key for which we issue a credix pass
	 * @param underwriter Enable underwriter functionality.
	 * @param borrower Enable borrower functionality (creation of deals)
	 * @returns
	 */
	async updateCredixPass(pk: PublicKey, active: boolean, underwriter: boolean, borrower: boolean) {
		const [credixPassAddress] = await CredixPass.generatePDA(pk, this);

		return this.program.rpc.updateCredixPass(active, underwriter, borrower, {
			accounts: {
				owner: this.program.provider.wallet.publicKey,
				passHolder: pk,
				credixPass: credixPassAddress,
				globalMarketState: this.address,
			},
		});
	}
}
