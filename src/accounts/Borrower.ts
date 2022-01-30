import { PublicKey } from "@solana/web3.js";
import { BorrowerInfo as IDLBorrowerInfo, CredixProgram } from "idl/idl.types";
import { Market } from "./Market";
import { encodeSeedString } from "utils/pda.utils";
import { CredixClient } from "index";

export class BorrowerInfo {
	market: Market;
	address: PublicKey;
	borrower: PublicKey;
	private programVersion: IDLBorrowerInfo;
	private client: CredixClient;

	constructor(
		borrowerInfo: IDLBorrowerInfo,
		market: Market,
		address: PublicKey,
		borrower: PublicKey,
		client: CredixClient
	) {
		this.programVersion = borrowerInfo;
		this.market = market;
		this.address = address;
		this.borrower = borrower;
		this.client = client;
	}

	get numberOfDeals() {
		return this.programVersion.numOfDeals;
	}

	fetchDeal(dealNumber: number) {
		return this.market.fetchDeal(this, dealNumber);
	}

	async fetchDeals() {
		const deals = await this.market.fetchDeals();
		return deals.filter((d) => d.borrower.equals(this.borrower));
	}

	fetchCredixPass() {
		return this.market.fetchCredixPass(this.address);
	}

	getGatewayToken() {
		return this.client.getGatewayToken(this.borrower, this.market.gateKeeperNetwork);
	}

	get bump() {
		return this.programVersion.bump;
	}

	static generatePDA(borrower: PublicKey, market: Market) {
		const borrowerSeed = encodeSeedString("borrower-info");
		const seeds = [market.address.toBuffer(), borrower.toBuffer(), borrowerSeed];

		return PublicKey.findProgramAddress(seeds, market.programId);
	}
}
