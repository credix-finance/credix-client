import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { Big } from "big.js";
import { Deal as ProgramDeal } from "idl/idl.types";
import { SECONDS_IN_DAY, ZERO } from "utils/math.utils";
import { Market } from "./Market";
import { encodeSeedString } from "utils/pda.utils";
import { Ratio } from "./Ratio";

export enum DealStatus {
	CLOSED,
	IN_PROGRESS,
	PENDING,
}

export class Deal {
	address: PublicKey;
	market: Market;
	private programVersion: ProgramDeal;

	constructor(deal: ProgramDeal, market: Market, address: PublicKey) {
		this.programVersion = deal;
		this.market = market;
		this.address = address;
	}

	static generatePDA(borrower: PublicKey, dealNumber: number, market: Market) {
		const dealSeed = encodeSeedString("deal-info");
		const dealNumberSeed = new BN(dealNumber).toArrayLike(Buffer, "le", 2);

		const seed = [market.address.toBuffer(), borrower.toBuffer(), dealNumberSeed, dealSeed];
		return PublicKey.findProgramAddress(seed, market.programId);
	}

	get name() {
		return this.programVersion.name;
	}

	get createAt() {
		return this.programVersion.createdAt;
	}

	get leverageRatio() {
		return this.programVersion.leverageRatio;
	}

	get underwriterPerformanceFeePercentage() {
		return new Ratio(
			this.programVersion.underwriterPerformanceFeePercentage.numerator,
			this.programVersion.underwriterPerformanceFeePercentage.denominator
		);
	}

	get number() {
		return this.programVersion.dealNumber;
	}

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

	get principal() {
		return new Big(this.programVersion.principal.toNumber());
	}

	get principalAmountRepaid() {
		return new Big(this.programVersion.principalAmountRepaid.toNumber());
	}

	get principalToRepay() {
		return this.principal.minus(this.principalAmountRepaid);
	}

	get interestRepaid() {
		return new Big(this.programVersion.interestAmountRepaid.toNumber());
	}

	get totalInterest() {
		const timeToMaturityRatio = new Ratio(this.timeToMaturity, 360);
		const interest = this.financingFeePercentage.apply(this.principal);
		const totalInterest = timeToMaturityRatio.apply(interest);

		return totalInterest.round(0, Big.roundDown);
	}

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

	get goLiveAt() {
		const goLiveAt = this.programVersion.goLiveAt;

		return goLiveAt.bitLength() > 53 ? null : goLiveAt.toNumber();
	}

	get status() {
		if (!this.goLiveAt) {
			return DealStatus.PENDING;
		}

		if (this.principal.eq(ZERO) && this.interestToRepay.eq(ZERO)) {
			return DealStatus.CLOSED;
		}

		return DealStatus.IN_PROGRESS;
	}

	get daysRemaining() {
		if (!this.goLiveAt || this.status === DealStatus.PENDING) {
			return this.timeToMaturity;
		}

		if (this.status === DealStatus.CLOSED) {
			return 0;
		}

		const daysRemaining =
			(this.goLiveAt + this.timeToMaturity * SECONDS_IN_DAY - Date.now()) / SECONDS_IN_DAY;

		return Math.max(Math.round(daysRemaining * 10) / 10, 0);
	}

	get borrower() {
		return this.programVersion.borrower;
	}
}
