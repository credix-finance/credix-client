import { Provider, Wallet } from "@project-serum/anchor";
import { makeSaberProvider, newProgram } from "@saberhq/anchor-contrib";
import { ConfirmOptions, Connection, PublicKey } from "@solana/web3.js";
import { Market } from "accounts/Market";
import { IDL } from "idl/credix";
import { CredixProgram } from "idl/idl.types";

export interface CredixClientConfig {
	programId: PublicKey;
	confirmOptions?: ConfirmOptions;
}

export class CredixClient {
	private program: CredixProgram;

	constructor(connection: Connection, wallet: typeof Wallet, config: CredixClientConfig) {
		const provider = new Provider(
			connection,
			wallet,
			config.confirmOptions || Provider.defaultOptions()
		);
		const saberProvider = makeSaberProvider(provider);
		this.program = newProgram<CredixProgram>(IDL, config.programId, saberProvider);
	}

	async fetchMarket(marketName: string) {
		const [address] = await Market.generatePDA(marketName, this.program.programId);
		const globalMarketState = await this.program.account.globalMarketState.fetchNullable(address);

		if (!globalMarketState) {
			return globalMarketState;
		}

		return new Market(globalMarketState, marketName, this.program, address);
	}
}
