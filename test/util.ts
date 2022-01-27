import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { Connection, PublicKey } from "@solana/web3.js";
import { CredixClient, CredixClientConfig } from "index";

export const testConnection = new Connection("http://127.0.0.1:8899");
export const testCredixClientConfig: CredixClientConfig = {
	programId: new PublicKey("CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX"),
	confirmOptions: { commitment: "finalized" },
};
export const testClient = new CredixClient(
	testConnection,
	NodeWallet.local(),
	testCredixClientConfig
);
