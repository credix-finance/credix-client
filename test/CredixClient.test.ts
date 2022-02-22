import { expect, use } from "chai";
import Sinon from "sinon";
import { globalMarketFixture, programMarketFixture } from "./fixtures/Market.fixture";
import { chaiSolana } from "@saberhq/chai-solana";
import { testClient, testConnection, testProgramId } from "./util";
import { CredixClient, CredixClientConfig } from "../src/rpc/CredixClient";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { Keypair } from "@solana/web3.js";
import { GlobalMarketState } from "../src/idl/idl.types";
import { Market } from "../src";

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

	it("uses default options if not provided", () => {
		// Arrange
		const config: CredixClientConfig = {
			programId: testProgramId,
		};

		expect(config.confirmOptions).to.be.undefined;

		// Act
		const wallet = new NodeWallet(Keypair.generate());
		const client = new CredixClient(testConnection, wallet, config);

		// Assert
		expect(client).to.exist;
	});

	it("fetches a market", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);

		const stub = sandbox.stub(testConnection, "getAccountInfo");
		stub.returns(Promise.resolve(marketFixture));

		// Act
		const market = await client.fetchMarket("credix-marketplace");

		// Assert
		expect(market?.name).to.equal("credix-marketplace");
		expect(market?.programId.equals(testProgramId)).to.be.true;
	});

	it("fetches different markets based on their name", async () => {
		// Arrange
		const marketAName = "market-a";
		const marketBName = "market-b";
		const marketALPTokenMintAccount = Keypair.generate();
		const marketBLPTokenMintAccount = Keypair.generate();
		const marketAData: GlobalMarketState = {
			...globalMarketFixture,
			lpTokenMintAccount: marketALPTokenMintAccount.publicKey,
		};
		const marketBData: GlobalMarketState = {
			...globalMarketFixture,
			lpTokenMintAccount: marketBLPTokenMintAccount.publicKey,
		};
		const marketAAccount = await programMarketFixture(marketAData);
		const marketBAccount = await programMarketFixture(marketBData);

		const marketAAddress = await Market.generatePDA(marketAName, testProgramId);
		const marketBAddress = await Market.generatePDA(marketBName, testProgramId);

		const stub = sandbox.stub(testConnection, "getAccountInfo");
		stub.withArgs(marketAAddress[0]).returns(Promise.resolve(marketAAccount));
		stub.withArgs(marketBAddress[0]).returns(Promise.resolve(marketBAccount));

		// Act
		const marketA = await client.fetchMarket(marketAName);
		const marketB = await client.fetchMarket(marketBName);

		// Assert
		expect(marketA?.address.equals(marketAAddress[0])).to.be.true;
		expect(marketB?.address.equals(marketBAddress[0])).to.be.true;
	});

	it("returns null when market not found", async () => {
		// Arrange
		const stub = sandbox.stub(testConnection, "getAccountInfo");
		stub.returns(Promise.resolve(null));

		// Act
		const market = await client.fetchMarket("credix-marketplace");

		// Assert
		expect(market).to.be.null;
	});

	it("returns the clustertime", async () => {
		// Arrange
		const getSlotStub = sandbox.stub(testConnection, "getSlot");
		getSlotStub.returns(Promise.resolve(1));
		const getBlockTimeStub = sandbox.stub(testConnection, "getBlockTime");
		getBlockTimeStub.returns(Promise.resolve(2));

		// Act
		const clusterTime = await client.getClusterTime();

		// Assert
		expect(clusterTime).to.equal(2);
	});

	it("returns a fallback if no clusterTime", async () => {
		// Arrange
		const getSlotStub = sandbox.stub(testConnection, "getSlot");
		getSlotStub.returns(Promise.resolve(1));
		const getBlockTimeStub = sandbox.stub(testConnection, "getBlockTime");
		getBlockTimeStub.returns(Promise.resolve(null));
		const nowStub = sandbox.stub(Date, "now");
		nowStub.returns(1644812912990000);

		// Act
		const clusterTime = await client.getClusterTime(true);

		// Assert
		expect(clusterTime).to.equal(Date.now() * 1000);
	});

	it("returns null if no clustertime and no fallback", async () => {
		// Arrange
		const getSlotStub = sandbox.stub(testConnection, "getSlot");
		getSlotStub.returns(Promise.resolve(1));
		const getBlockTimeStub = sandbox.stub(testConnection, "getBlockTime");
		getBlockTimeStub.returns(Promise.resolve(null));

		// Act
		const clusterTime = await client.getClusterTime();

		// Assert
		expect(clusterTime).to.be.null;
	});
});
