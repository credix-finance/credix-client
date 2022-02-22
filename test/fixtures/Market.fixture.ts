import { BN } from "@project-serum/anchor";
import { AccountInfo, Keypair } from "@solana/web3.js";
import { GlobalMarketState } from "../../src/idl/idl.types";
import { testProgram } from "../util";

export const globalMarketFixture: GlobalMarketState = {
	gatekeeperNetwork: Keypair.generate().publicKey,
	liquidityPoolTokenMintAccount: Keypair.generate().publicKey,
	lpTokenMintAccount: Keypair.generate().publicKey,
	treasuryPoolTokenAccount: Keypair.generate().publicKey,
	totalOutstandingCredit: new BN(10),
	signingAuthorityBump: 255,
	bump: 252,
	interestFee: { numerator: 10, denominator: 100 },
	withdrawalFee: { numerator: 5, denominator: 1000 },
	frozen: false,
};

export const programMarketFixture = async (
	market: GlobalMarketState
): Promise<AccountInfo<Buffer>> => {
	const data = await testProgram.coder.accounts.encode("globalMarketState", market);

	return {
		data: data,
		executable: false,
		lamports: 3173760,
		owner: Keypair.generate().publicKey,
		rentEpoch: 0,
	};
};
