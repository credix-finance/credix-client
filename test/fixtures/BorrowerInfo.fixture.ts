import { AccountInfo, PublicKey } from "@solana/web3.js";
import { BorrowerInfo } from "../../src/idl/idl.types";
import { testProgram } from "../util";

export const borrowerInfoFixture: BorrowerInfo = {
	numOfDeals: 0,
	bump: 0,
};

export const programBorrowerInfoFixture = async (
	borrowerInfo: BorrowerInfo
): Promise<AccountInfo<Buffer>> => {
	const data = await testProgram.coder.accounts.encode("borrowerInfo", borrowerInfo);

	return {
		data: data,
		executable: false,
		lamports: 3173760,
		owner: new PublicKey("CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX"),
		rentEpoch: 0,
	};
};
