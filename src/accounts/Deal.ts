import { BN } from "@project-serum/anchor";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { Big } from "big.js";
import { CredixProgram, Deal as ProgramDeal, RepaymentType } from "../idl/idl.types";
import { Market } from "./Market";
import { Ratio } from "./Ratio";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { CredixPass } from "./CredixPass";
import { CredixClient } from "..";
import { encodeSeedString } from "../utils/pda.utils";
import { SECONDS_IN_DAY, ZERO } from "../utils/math.utils";

export enum DealStatus {
	/**
	 * The deal is repaid
	 */
	CLOSED,
	/**
	 * The deal is active but not yet repaid
	 */
	IN_PROGRESS,
	/**
	 * The deal has not yet activated. I.e. the borrower hasn't received money yet.
	 */
	PENDING,
}

/**
 * Deal in a market
 */
export class Deal {
	address: PublicKey;
	market: Market;
	private programVersion: ProgramDeal;
	private program: CredixProgram;
	private client: CredixClient;

	/**
	 * @ignore
	 */
	constructor(
		deal: ProgramDeal,
		market: Market,
		address: PublicKey,
		program: CredixProgram,
		client: CredixClient
	) {
		this.programVersion = deal;
		this.market = market;
		this.address = address;
		this.program = program;
		this.client = client;
	}

	/**
	 * Generate a deal PDA
	 * @param borrower Borrower of the deal
	 * @param dealNumber Number of the deal
	 * @param market Market to which the deal belongs
	 * @returns
	 */
	static generatePDA(borrower: PublicKey, dealNumber: number, market: Market) {
		const dealSeed = encodeSeedString("deal-info");
		const dealNumberSeed = new BN(dealNumber).toArrayLike(Buffer, "le", 2);

		const seed = [market.address.toBuffer(), borrower.toBuffer(), dealNumberSeed, dealSeed];
		return PublicKey.findProgramAddress(seed, market.programId);
	}

	/**
	 * Name of the deal
	 */
	get name() {
		return this.programVersion.name;
	}

	/**
	 * Timestamp of deal creation
	 */
	get createdAt() {
		return this.programVersion.createdAt;
	}

	get leverageRatio() {
		return this.programVersion.leverageRatio;
	}

	/**
	 * Fee for the underwriters for underwriting the deal
	 */
	get underwriterPerformanceFeePercentage() {
		return new Ratio(
			this.programVersion.underwriterPerformanceFeePercentage.numerator,
			this.programVersion.underwriterPerformanceFeePercentage.denominator
		);
	}

	/**
	 * Number of the deal
	 */
	get number() {
		return this.programVersion.dealNumber;
	}

	/**
	 * Fees accrued by missed payments
	 */
	get lateFees() {
		return this.programVersion.lateFees;
	}

	get lateFeesRepaid() {
		return this.programVersion.lateFeesRepaid;
	}

	get isPrivate() {
		return this.programVersion.private;
	}

	get defaulted() {
		return this.programVersion.defaulted;
	}

	/**
	 * How much was lent
	 */
	get principal() {
		return new Big(this.programVersion.principal.toNumber());
	}

	/**
	 * How much of the principal was repaid
	 */
	get principalAmountRepaid() {
		return new Big(this.programVersion.principalAmountRepaid.toNumber());
	}

	/**
	 * The principal that is yet to be repaid
	 */
	get principalToRepay() {
		return this.principal.minus(this.principalAmountRepaid);
	}

	/**
	 * How much of the interest was repaid
	 */
	get interestRepaid() {
		return new Big(this.programVersion.interestAmountRepaid.toNumber());
	}

	/**
	 * Total interest accrued by the deal
	 */
	get totalInterest() {
		const timeToMaturityRatio = new Ratio(this.timeToMaturity, 360);
		const interest = this.financingFeePercentage.apply(this.principal);
		const totalInterest = timeToMaturityRatio.apply(interest);

		return totalInterest.round(0, Big.roundDown);
	}

	/**
	 * How much interest is yet to be repaid
	 */
	get interestToRepay() {
		return this.totalInterest.minus(this.interestRepaid);
	}

	get financingFeePercentage() {
		return new Ratio(
			this.programVersion.financingFeePercentage.numerator,
			this.programVersion.financingFeePercentage.denominator
		);
	}

	get timeToMaturity() {
		return this.programVersion.timeToMaturityDays;
	}

	/**
	 * When the deal went live. This is the moment where funds are transferred to the borrower
	 */
	get goLiveAt() {
		const goLiveAt = this.programVersion.goLiveAt;
		return goLiveAt.bitLength() > 53 ? null : goLiveAt.toNumber();
	}

	get status() {
		if (!this.goLiveAt) {
			return DealStatus.PENDING;
		}

		if (this.principalToRepay.eq(ZERO) && this.interestToRepay.eq(ZERO)) {
			return DealStatus.CLOSED;
		}

		return DealStatus.IN_PROGRESS;
	}

	isPending() {
		return this.status === DealStatus.PENDING;
	}

	isClosed() {
		return this.status === DealStatus.CLOSED;
	}

	isInProgress() {
		return this.status === DealStatus.IN_PROGRESS;
	}

	/**
	 * Gets the remaining time before this deal goes into late fees
	 */
	get daysRemaining() {
		if (!this.goLiveAt || this.isPending()) {
			return this.timeToMaturity;
		}

		if (this.isClosed()) {
			return 0;
		}

		const daysRemaining =
			(this.goLiveAt + this.timeToMaturity * SECONDS_IN_DAY - Date.now()) / SECONDS_IN_DAY;

		return Math.max(Math.round(daysRemaining * 10) / 10, 0);
	}

	/**
	 * Get address of the borrower. This is not borrower info but the actual recipient of the funds
	 */
	get borrower() {
		return this.programVersion.borrower;
	}

	/**
	 * Activates this deal
	 * @returns
	 */
	async activate() {
		const gatewayToken = await this.client.getGatewayToken(
			this.borrower,
			this.market.gateKeeperNetwork
		);

		if (!gatewayToken) {
			// TODO: centralize these errors
			throw new Error("No valid Civic gateway gateway token found");
		}

		const [signingAuthorityAddress] = await this.market.generateSigningAuthorityPDA();
		const liquidityPoolTokenAccount = await this.market.findLiquidityPoolTokenAccount();
		const borrowerTokenAccount = await this.market.findBaseTokenAccount(this.borrower);
		const [credixPassAddress] = await CredixPass.generatePDA(this.borrower, this.market);

		return this.program.rpc.activateDeal({
			accounts: {
				owner: this.program.provider.wallet.publicKey,
				gatewayToken: gatewayToken.publicKey,
				globalMarketState: this.market.address,
				signingAuthority: signingAuthorityAddress,
				deal: this.address,
				liquidityPoolTokenAccount: liquidityPoolTokenAccount,
				borrower: this.borrower,
				associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
				borrowerTokenAccount: borrowerTokenAccount,
				credixPass: credixPassAddress,
				baseMintAccount: this.market.baseMintPK,
				tokenProgram: TOKEN_PROGRAM_ID,
				systemProgram: SystemProgram.programId,
				rent: SYSVAR_RENT_PUBKEY,
			},
		});
	}

	/**
	 * Repays principal of the deal. This needs to happen after the interest repayments
	 * @param amount
	 * @returns
	 */
	async repayPrincipal(amount: Big) {
		return this.repay(amount, { interest: {} });
	}

	/**
	 * Repays interest of the deal. This needs to happen before principal repayments.
	 * @param amount
	 * @returns
	 */
	async repayInterest(amount: Big) {
		return this.repay(amount, { principal: {} });
	}

	private async repay(amount: Big, repaymentType: RepaymentType) {
		const repayAmount = new BN(amount.toNumber());
		const gatewayToken = await this.client.getGatewayToken(
			this.borrower,
			this.market.gateKeeperNetwork
		);

		if (!gatewayToken) {
			// TODO: centralize these errors
			throw new Error("No valid Civic gateway gateway token found");
		}

		const borrowerTokenAccount = await this.market.findBaseTokenAccount(this.borrower);
		const liquidityPoolTokenAccount = await this.market.findLiquidityPoolTokenAccount();
		const [signingAuthorityAddress] = await this.market.generateSigningAuthorityPDA();
		const [credixPassAddress] = await CredixPass.generatePDA(this.borrower, this.market);

		return this.program.rpc.makeDealRepayment(repayAmount, repaymentType, {
			accounts: {
				borrower: this.borrower,
				gatewayToken: gatewayToken.publicKey,
				globalMarketState: this.market.address,
				borrowerTokenAccount: borrowerTokenAccount,
				deal: this.address,
				liquidityPoolTokenAccount: liquidityPoolTokenAccount,
				treasuryPoolTokenAccount: this.market.treasury,
				signingAuthority: signingAuthorityAddress,
				baseMintAccount: this.market.baseMintPK,
				lpTokenMintAccount: this.market.lpMintPK,
				credixPass: credixPassAddress,
				tokenProgram: TOKEN_PROGRAM_ID,
				associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			},
		});
	}
}
