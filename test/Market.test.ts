import { chaiSolana } from "@saberhq/chai-solana";
import { Market } from "accounts/Market";
import { expect, use } from "chai";
import Sinon from "sinon";
import { programMarketFixture } from "./fixtures/Market.fixture";
import { testClient, testConnection, testCredixClientConfig } from "./util";

use(chaiSolana);

describe("Market", async () => {
	const sandbox = Sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	it("should have the correct name", async () => {
		const stub = sandbox.stub(testConnection, "getAccountInfo");
		stub.returns(Promise.resolve(programMarketFixture));

		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		expect(market?.name).to.equal(marketName);
	});

	it("should have the correct address", async () => {
		const stub = sandbox.stub(testConnection, "getAccountInfo");
		stub.returns(Promise.resolve(programMarketFixture));

		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		const [marketAddress] = await Market.generatePDA(marketName, testCredixClientConfig.programId);
		expect(market?.address).to.eqAddress(marketAddress);
	});

	/* it("should deposit funds", async () => {
		const stub = sandbox.stub(testConnection, "getAccountInfo");
		stub.returns(Promise.resolve(programMarketFixture));

		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		const amount = new Big(1_000_000_000);
		const investor = NodeWallet.local().publicKey;

		if (!market) {
			throw Error("no market");
		}

		const depositSpy = sandbox.spy(market, "deposit");

		await market.deposit(amount, investor);
		console.log("spy", depositSpy, depositSpy.callCount, depositSpy.arguments);
	}); */
});
