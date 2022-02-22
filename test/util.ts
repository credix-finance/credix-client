import { Provider } from "@project-serum/anchor";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { makeSaberProvider, newProgram } from "@saberhq/anchor-contrib";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { CredixClient, CredixClientConfig } from "../src";
import { IDL } from "../src/idl/credix";
import { CredixProgram } from "../src/idl/idl.types";

export const testProgramId = new PublicKey("CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX");

const testCredixClientConfig: CredixClientConfig = {
	programId: testProgramId,
	confirmOptions: { commitment: "finalized" },
};
const testWallet = new NodeWallet(Keypair.generate());

export const testConnection = new Connection("http://127.0.0.1:8899");

const testProvider = new Provider(testConnection, testWallet, Provider.defaultOptions());

export const testClient = new CredixClient(testConnection, testWallet, testCredixClientConfig);

export const testProgram = newProgram<CredixProgram>(
	IDL,
	testProgramId,
	makeSaberProvider(testProvider)
);
