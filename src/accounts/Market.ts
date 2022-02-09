import { CredixProgram, GlobalMarketState } from "idl/idl.types";
import { encodeSeedString } from "utils/pda.utils";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { BorrowerInfo } from "./Borrower";
import { Deal } from "./Deal";
import { asyncFilter } from "utils/async.utils";
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import Big from "big.js";
import { Ratio } from "accounts/Ratio";
import { BN, web3 } from "@project-serum/anchor";
import { CredixPass } from "./CredixPass";
import Fraction from "fraction.js";
import { CredixClient } from "index";
import { ZERO } from "utils/math.utils";

export class Market {
	name: string;
	address: PublicKey;
	private program: CredixProgram;
	private programVersion: GlobalMarketState;
	private client: CredixClient;

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

	async deposit(amount: Big, investor: PublicKey) {
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

	async withdraw(amount: Big, investor: PublicKey) {
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

	get programId() {
		return this.program.programId;
	}

	get baseMintPK() {
		return this.programVersion.liquidityPoolTokenMintAccount;
	}

	get lpMintPK() {
		return this.programVersion.lpTokenMintAccount;
	}

	get treasury() {
		return this.programVersion.treasuryPoolTokenAccount;
	}

	get withdrawFee() {
		return this.programVersion.withdrawalFee;
	}

	get interestFee() {
		return this.programVersion.interestFee;
	}

	getLPSupply() {
		const lpTokenMint = this.lpMintPK;
		return this.program.provider.connection
			.getTokenSupply(lpTokenMint)
			.then((response) => response.value);
	}

	async getLPPrice() {
		const tvl = await this.calculateTVL();
		const lpSupply = await this.getLPSupply();
		const lpSupplyBig = new Big(lpSupply.amount);

		if (lpSupplyBig.eq(ZERO)) {
			return ZERO;
		}

		return tvl.div(lpSupplyBig);
	}

	// TODO: does this belong on Market?
	findBaseTokenAccount(pk: PublicKey, offCurve?: boolean) {
		return Token.getAssociatedTokenAddress(
			ASSOCIATED_TOKEN_PROGRAM_ID,
			TOKEN_PROGRAM_ID,
			this.baseMintPK,
			pk,
			offCurve
		);
	}

	findLPTokenAccount(pk: PublicKey, offCurve?: boolean) {
		return Token.getAssociatedTokenAddress(
			ASSOCIATED_TOKEN_PROGRAM_ID,
			TOKEN_PROGRAM_ID,
			this.lpMintPK,
			pk,
			offCurve
		);
	}

	async userBaseBalance(user: PublicKey) {
		const userBaseTokenAccount = await this.findBaseTokenAccount(user);
		const response = await this.program.provider.connection.getTokenAccountBalance(
			userBaseTokenAccount
		);
		return response.value;
	}

	async userLPBalance(user: PublicKey) {
		const userLPTokenAccount = await this.findLPTokenAccount(user);
		const response = await this.program.provider.connection.getTokenAccountBalance(
			userLPTokenAccount
		);

		return response.value;
	}

	async fetchLiquidityPoolBalance() {
		const liquidityPoolBaseTokenAccountPK = await this.findLiquidityPoolTokenAccount();
		const response = await this.program.provider.connection.getTokenAccountBalance(
			liquidityPoolBaseTokenAccountPK
		);
		return response.value;
	}

	get totalOutstandingCredit() {
		return new Big(this.programVersion.totalOutstandingCredit.toNumber());
	}

	get gateKeeperNetwork() {
		return this.programVersion.gatekeeperNetwork;
	}

	async fetchDeal(borrower: BorrowerInfo, dealNumber: number) {
		const [dealAddress] = await Deal.generatePDA(borrower.address, dealNumber, this);
		const programDeal = await this.program.account.deal.fetchNullable(dealAddress);

		if (!programDeal) {
			return programDeal;
		}

		return new Deal(programDeal, this, dealAddress, this.program, this.client);
	}

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

	async calculateTVL() {
		const liquidityPoolBalance = await this.fetchLiquidityPoolBalance();
		const base_in_liquidity_pool = new Big(liquidityPoolBalance.amount);

		return this.totalOutstandingCredit.add(base_in_liquidity_pool);
	}

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

	async fetchBorrowerInfo(borrower: PublicKey) {
		const [address] = await BorrowerInfo.generatePDA(borrower, this);
		const programBorrower = await this.program.account.borrowerInfo.fetchNullable(address);

		if (!programBorrower) {
			return programBorrower;
		}

		return new BorrowerInfo(programBorrower, this, address, borrower, this.client);
	}

	async fetchBorrowerInfos() {
		throw new Error("not implemented");
	}

	async fetchCredixPass(borrower: PublicKey) {
		const [passAddress] = await CredixPass.generatePDA(borrower, this);
		return this.program.account.credixPass.fetchNullable(passAddress);
	}

	static generatePDA(marketName: string, programId: PublicKey) {
		const seed = encodeSeedString(marketName);
		return PublicKey.findProgramAddress([seed], programId);
	}

	private generateCredixPassPDA(pk: PublicKey) {
		const credixSeed = encodeSeedString("credix-pass");
		const seed = [this.address.toBuffer(), pk.toBuffer(), credixSeed];
		return PublicKey.findProgramAddress(seed, this.programId);
	}

	generateSigningAuthorityPDA() {
		const seed = [this.address.toBuffer()];
		return PublicKey.findProgramAddress(seed, this.programId);
	}

	async findLiquidityPoolTokenAccount() {
		const [signingAuthorityPK] = await this.generateSigningAuthorityPDA();
		return this.findBaseTokenAccount(signingAuthorityPK);
	}

	async getUserStake(user: PublicKey) {
		const lpPrice = await this.getLPPrice();
		const userLpTokenAmount = await this.userLPBalance(user);
		const userLpTokenAmountBig = new Big(userLpTokenAmount.amount);

		return userLpTokenAmountBig.mul(lpPrice);
	}

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

	async getCredixPass(pk: PublicKey) {
		const [credixPassAddress] = await CredixPass.generatePDA(pk, this);
		return this.program.account.credixPass.fetchNullable(credixPassAddress);
	}
}
