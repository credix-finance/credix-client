import { expect, use } from "chai";
import Sinon from "sinon";
import { programMarketFixture } from "./fixtures/Market.fixture";
import { chaiSolana } from "@saberhq/chai-solana";
import { testClient, testConnection, testCredixClientConfig } from "./util";
import { CredixClient, CredixClientConfig } from "../src/rpc/CredixClient";
import { PublicKey } from "@solana/web3.js";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

use(chaiSolana);

describe("Credix Client", () => {
	const sandbox = Sinon.createSandbox();
	const client = testClient;

	afterEach(() => {
		sandbox.restore();
	});

	it("can be instantiated", () => {
		expect(client).to.exist;
	});

	// TODO: this test is probably redundant
	it("uses the program id from the config", async () => {
		const stub = sandbox.stub(testConnection, "getAccountInfo");
		stub.returns(Promise.resolve(programMarketFixture));

		const market = await client.fetchMarket("credix-marketplace");

		expect(testCredixClientConfig.programId.toString()).to.equal(
			"CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX"
		);
		expect(market?.programId).to.eqAddress(testCredixClientConfig.programId);
	});

	it("uses default options if not provided", () => {
		const config: CredixClientConfig = {
			programId: new PublicKey("CRDx2YkdtYtGZXGHZ59wNv1EwKHQndnRc1gT4p8i2vPX"),
		};

		expect(config.confirmOptions).to.be.undefined;

		const client = new CredixClient(testConnection, NodeWallet.local(), config);

		expect(client).to.exist;
	});

	it("fetches a market", async () => {
		const stub = sandbox.stub(testConnection, "getAccountInfo");
		stub.returns(Promise.resolve(programMarketFixture));

		const market = await client.fetchMarket("credix-marketplace");

		expect(market?.name).to.equal("credix-marketplace");
	});

	it("fetches different markets based on their name", () => {
		throw Error("not implemented");
	});

	it("returns null when market not found", async () => {
		const stub = sandbox.stub(testConnection, "getAccountInfo");
		stub.returns(Promise.resolve(null));

		const market = await client.fetchMarket("credix-marketplace");

		expect(market).to.be.null;
	});
});
