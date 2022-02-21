import { PublicKey } from "@solana/web3.js";
import { CredixPass as IDLCredixPass } from "idl/idl.types";
import { encodeSeedString } from "utils/pda.utils";
import { Market } from "./Market";

export class CredixPass {
	private programVersion: IDLCredixPass;
	address: PublicKey;

	constructor(credixPass: IDLCredixPass, address: PublicKey) {
		this.programVersion = credixPass;
		this.address = address;
	}

	get isBorrower() {
		return this.programVersion.isBorrower;
	}

	get isUnderwriter() {
		return this.programVersion.isUnderwriter;
	}

	get isActive() {
		return this.programVersion.active;
	}

	get user() {
		return this.programVersion.user;
	}

	get releaseTimestamp() {
		return this.programVersion.releaseTimestamp.toNumber();
	}

	static generatePDA(pk: PublicKey, market: Market) {
		const credixPassSeed = encodeSeedString("credix-pass");
		const seeds = [market.address.toBuffer(), pk.toBuffer(), credixPassSeed];

		return PublicKey.findProgramAddress(seeds, market.programId);
	}
}
