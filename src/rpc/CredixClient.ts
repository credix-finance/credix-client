import { findGatewayToken } from "@identity.com/solana-gateway-ts";
import { Provider, Wallet } from "@project-serum/anchor";
import { makeSaberProvider, newProgram } from "@saberhq/anchor-contrib";
import { ConfirmOptions, Connection, PublicKey } from "@solana/web3.js";
import { Market } from "..";
import { IDL } from "../idl/credix";
import { CredixProgram } from "../idl/idl.types";

/** Configuration for a Credix client */
export interface CredixClientConfig {
	/** Program the client will be used for */
	programId: PublicKey;
	/**
	 * Confirm options to be used by the client.
	 */
	confirmOptions?: ConfirmOptions;
}

/**
 * Client for interacting with Credix programs
 */
export class CredixClient {
	private program: CredixProgram;

	/**
	 * @param connection The connection to be used by the client
	 * @param wallet The wallet to be used by the client
	 * @param config Configuration of the client.
	 * If no confirm options are present the client will use the default options from the connection
	 * @constructor
	 */
	constructor(connection: Connection, wallet: typeof Wallet, config: CredixClientConfig) {
		const provider = new Provider(
			connection,
			wallet,
			config.confirmOptions || Provider.defaultOptions()
		);
		const saberProvider = makeSaberProvider(provider);
		this.program = newProgram<CredixProgram>(IDL, config.programId, saberProvider);
	}

	/**
	 * Fetches a market. This market is the main entrypoint for the Credix market program.
	 * @param marketName Name of the market to fetch
	 * @returns
	 */
	async fetchMarket(marketName: string) {
		const [address] = await Market.generatePDA(marketName, this.program.programId);
		const globalMarketState = await this.program.account.globalMarketState.fetchNullable(address);

		if (!globalMarketState) {
			return globalMarketState;
		}

		return new Market(globalMarketState, marketName, this.program, address, this);
	}

	/**
	 * Fetches the cluster time. This time is equal to the time of the latest block with the commitment level of the client.
	 * @param useFallback Use system time as fallback when cluster time cannot be retrieved
	 * @returns
	 */
	// TODO: use this where necessary
	async getClusterTime(useFallback?: boolean) {
		const slot = await this.program.provider.connection.getSlot();
		const clusterTime = await this.program.provider.connection.getBlockTime(slot);

		if (!clusterTime && useFallback) {
			return Date.now() * 1000;
		}

		return clusterTime;
	}

	/**
	 * Fetches a Civic token. See [Civic]{@link https://docs.civic.com/} and [Identity.com]{@link https://www.identity.com/} documentation to learn what a gatekeeper network is.
	 * @param user Public key to fetch the token for
	 * @param gatekeeperNetwork Gatekeeper Network to which the token should belong
	 * @returns
	 */
	getGatewayToken(user: PublicKey, gatekeeperNetwork: PublicKey) {
		return findGatewayToken(this.program.provider.connection, user, gatekeeperNetwork);
	}
}
