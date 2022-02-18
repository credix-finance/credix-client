import { BN } from "@project-serum/anchor";
import { AccountInfo, Keypair, PublicKey } from "@solana/web3.js";
import { Deal } from "../../src/idl/idl.types";
import { testProgram } from "../util";

export const dealFixture: Deal = {
	name: "name",
	borrower: Keypair.generate().publicKey,
	principal: new BN(1_000_000),
	financingFeePercentage: {
		numerator: 5,
		denominator: 100,
	},
	principalAmountRepaid: new BN(0),
	interestAmountRepaid: new BN(0),
	timeToMaturityDays: 60,
	goLiveAt: new BN(Date.now()),
	createdAt: new BN(Date.now() - 60 * 60 * 24),
	leverageRatio: 0,
	underwriterPerformanceFeePercentage: {
		numerator: 5,
		denominator: 100,
	},
	dealNumber: 0,
	bump: 0,
	lateFees: new BN(0),
	lateFeesRepaid: new BN(0),
	private: false,
	defaulted: false,
};

export const programDealFixture = async (deal: Deal): Promise<AccountInfo<Buffer>> => {
	const data = await testProgram.coder.accounts.encode("deal", deal);

	return {
		data: data,
		executable: false,
		lamports: 3173760,
		owner: new PublicKey("CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX"),
		rentEpoch: 0,
	};
};
