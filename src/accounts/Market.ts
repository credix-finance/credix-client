import { CredixProgram, GlobalMarketState } from "idl/idl.types";
import { encodeSeedString } from "utils/pda.utils";
import { PublicKey } from "@solana/web3.js";
import { BorrowerInfo } from "./Borrower";
import { Deal } from "./Deal";
import { asyncFilter } from "utils/async.utils";

export class Market {
	name: string;
	address: PublicKey;
	private program: CredixProgram;
	private programVersion: GlobalMarketState;

	constructor(market: GlobalMarketState, name: string, program: CredixProgram, address: PublicKey) {
		this.programVersion = market;
		this.name = name;
		this.program = program;
		this.address = address;
	}

	get programId() {
		return this.program.programId;
	}

	get totalOutstandingCredit() {
		return this.programVersion.totalOutstandingCredit;
	}

	async fetchDeal(borrower: BorrowerInfo, dealNumber: number) {
		const [dealAddress] = await Deal.generatePDA(borrower.address, dealNumber, this);
		const programDeal = await this.program.account.deal.fetchNullable(dealAddress);

		if (!programDeal) {
			return programDeal;
		}

		return new Deal(programDeal, this, dealAddress);
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

		return marketDeals.map((deal) => new Deal(deal.account, this, deal.publicKey));
	}

	async fetchBorrowerInfo(borrower: PublicKey) {
		const [address] = await BorrowerInfo.generatePDA(borrower, this);
		const programBorrower = await this.program.account.borrowerInfo.fetchNullable(address);

		if (!programBorrower) {
			return programBorrower;
		}

		return new BorrowerInfo(programBorrower, this, address, borrower);
	}

	async fetchBorrowerInfos() {
		throw new Error("not implemented");
	}

	static generatePDA(marketName: string, programId: PublicKey) {
		const seed = encodeSeedString(marketName);
		return PublicKey.findProgramAddress([seed], programId);
	}
}
