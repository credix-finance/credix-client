import { PublicKey } from "@solana/web3.js";
import { CredixClient, Market } from "..";
import { BorrowerInfo as IDLBorrowerInfo } from "../idl/idl.types";
import { encodeSeedString } from "../utils/pda.utils";

/**
 * Information about a borrower
 */
export class BorrowerInfo {
	/**
	 * Market this information is relevant for
	 */
	market: Market;
	/**
	 * Address of the information
	 */
	address: PublicKey;
	/**
	 * Public key of the borrower this is information for
	 */
	borrower: PublicKey;
	private programVersion: IDLBorrowerInfo;
	private client: CredixClient;

	/**
	 * @ignore
	 */
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

	/**
	 * Get number of deals
	 */
	get numberOfDeals() {
		return this.programVersion.numOfDeals;
	}

	/**
	 * Fetch a deal for the borrower
	 * @param dealNumber
	 * @returns
	 */
	fetchDeal(dealNumber: number) {
		return this.market.fetchDeal(this.borrower, dealNumber);
	}

	/**
	 * Fetch all deals for borrower
	 * @returns
	 */
	async fetchDeals() {
		const deals = await this.market.fetchDeals();
		return deals.filter((d) => d.borrower.equals(this.borrower));
	}

	/**
	 * Fetch credix pass for borrower
	 * @returns
	 */
	fetchCredixPass() {
		return this.market.fetchCredixPass(this.address);
	}

	/**
	 * Get the civic token for this borrower
	 * @returns
	 */
	getGatewayToken() {
		return this.client.getGatewayToken(this.borrower, this.market.gateKeeperNetwork);
	}

	/**
	 * Generator borrower info PDA
	 * @param borrower Borrower to generate the PDA for
	 * @param market Market to generate the PDA for
	 * @returns
	 */
	static generatePDA(borrower: PublicKey, market: Market) {
		const borrowerSeed = encodeSeedString("borrower-info");
		const seeds = [market.address.toBuffer(), borrower.toBuffer(), borrowerSeed];

		return PublicKey.findProgramAddress(seeds, market.programId);
	}
}
