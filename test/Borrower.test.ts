import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { Connection } from "@solana/web3.js";
import { CredixClient, CredixClientConfig } from "index";
import { testProgramId } from "./util";

describe("Borrower", () => {
	const connection = new Connection("http://127.0.0.1:8899");
	const credixClientConfig: CredixClientConfig = {
		programId: testProgramId,
		confirmOptions: { commitment: "finalized" },
	};
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const client = new CredixClient(connection, NodeWallet.local(), credixClientConfig);

	it("returns the correct market", () => {
		throw Error("not implemented");
	});

	it("returns the correct address", () => {
		throw Error("not implemented");
	});

	it("returns the correct borrower key", () => {
		throw Error("not implemented");
	});

	it("returns the correct number of deals", () => {
		throw Error("not implemented");
	});

	it("fetches a deal for a borrower", () => {
		throw Error("not implemented");
	});

	it("fetches different deals based on their number", () => {
		throw Error("not implemented");
	});

	it("fetches all deals for a borrower", () => {
		throw Error("not implemented");
	});

	it("generates a PDA", () => {
		throw Error("not implemented");
	});
});
