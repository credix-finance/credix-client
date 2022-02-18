import { AccountInfo, PublicKey } from "@solana/web3.js";
import { CredixPass } from "../../src/idl/idl.types";
import { testProgram } from "../util";

export const credixPassFixture: CredixPass = {
	bump: 0,
	isBorrower: true,
	isUnderwriter: true,
	active: true,
};

export const programCredixPassFixture = async (
	credixPass: CredixPass
): Promise<AccountInfo<Buffer>> => {
	const data = await testProgram.coder.accounts.encode("credixPass", credixPass);
	return {
		data: data,
		executable: false,
		lamports: 3173760,
		owner: new PublicKey("CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX"),
		rentEpoch: 0,
	};
};
