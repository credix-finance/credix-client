import { Keypair, PublicKey } from "@solana/web3.js";
import { expect } from "chai";
import Sinon from "sinon";
import { BorrowerInfo, Deal, Market } from "../src";
import { encodeSeedString } from "../src/utils/pda.utils";
import { borrowerInfoFixture } from "./fixtures/BorrowerInfo.fixture";
import { dealFixture, programDealFixture } from "./fixtures/Deal.fixture";
import { globalMarketFixture } from "./fixtures/Market.fixture";
import { testClient, testConnection, testProgram } from "./util";

describe("Borrower", () => {
	const sandbox = Sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	it("returns the correct market", async () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const borrower = Keypair.generate();
		const borrowerInfoAddress = Keypair.generate();
		const borrowerInfo = new BorrowerInfo(
			borrowerInfoFixture,
			market,
			borrowerInfoAddress.publicKey,
			borrower.publicKey,
			testClient
		);

		expect(borrowerInfo.market).to.equal(market);
	});

	it("returns the correct address", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const borrower = Keypair.generate();
		const borrowerInfoAddress = Keypair.generate();
		const borrowerInfo = new BorrowerInfo(
			borrowerInfoFixture,
			market,
			borrowerInfoAddress.publicKey,
			borrower.publicKey,
			testClient
		);

		expect(borrowerInfo.address.equals(borrowerInfoAddress.publicKey)).to.be.true;
	});

	it("returns the correct borrower key", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const borrower = Keypair.generate();
		const borrowerInfoAddress = Keypair.generate();
		const borrowerInfo = new BorrowerInfo(
			borrowerInfoFixture,
			market,
			borrowerInfoAddress.publicKey,
			borrower.publicKey,
			testClient
		);

		expect(borrowerInfo.borrower.equals(borrower.publicKey)).to.be.true;
	});

	it("returns the correct number of deals", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const borrower = Keypair.generate();
		const borrowerInfoAddress = Keypair.generate();
		const borrowerInfo = new BorrowerInfo(
			borrowerInfoFixture,
			market,
			borrowerInfoAddress.publicKey,
			borrower.publicKey,
			testClient
		);

		expect(borrowerInfo.numberOfDeals).to.equal(borrowerInfoFixture.numOfDeals);
	});

	it("fetches a deal for a borrower", async () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const borrower = Keypair.generate();
		const borrowerInfoAddress = Keypair.generate();
		const borrowerInfo = new BorrowerInfo(
			borrowerInfoFixture,
			market,
			borrowerInfoAddress.publicKey,
			borrower.publicKey,
			testClient
		);

		const dealAddress = await Deal.generatePDA(borrower.publicKey, 0, market);
		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		getAccountInfoStub
			.withArgs(dealAddress[0])
			.returns(
				Promise.resolve(
					programDealFixture({ ...dealFixture, borrower: borrower.publicKey, bump: dealAddress[1] })
				)
			);

		const deal = await borrowerInfo.fetchDeal(0);

		expect(deal?.address.equals(dealAddress[0])).to.be.true;
	});

	it("fetches different deals based on their number", async () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const borrower = Keypair.generate();
		const borrowerInfoAddress = Keypair.generate();
		const borrowerInfo = new BorrowerInfo(
			borrowerInfoFixture,
			market,
			borrowerInfoAddress.publicKey,
			borrower.publicKey,
			testClient
		);

		const dealAddressA = await Deal.generatePDA(borrower.publicKey, 0, market);
		const dealAddressB = await Deal.generatePDA(borrower.publicKey, 1, market);
		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		getAccountInfoStub.withArgs(dealAddressA[0]).returns(
			Promise.resolve(
				programDealFixture({
					...dealFixture,
					borrower: borrower.publicKey,
					bump: dealAddressA[1],
					dealNumber: 0,
				})
			)
		);
		getAccountInfoStub.withArgs(dealAddressB[0]).returns(
			Promise.resolve(
				programDealFixture({
					...dealFixture,
					borrower: borrower.publicKey,
					bump: dealAddressB[1],
					dealNumber: 1,
				})
			)
		);

		const dealA = await borrowerInfo.fetchDeal(0);
		const dealB = await borrowerInfo.fetchDeal(1);

		expect(dealA?.address.equals(dealAddressA[0])).to.be.true;
		expect(dealB?.address.equals(dealAddressB[0])).to.be.true;
		expect(dealA?.number).to.equal(0);
		expect(dealB?.number).to.equal(1);
		expect(dealA?.address).to.not.equal(dealB?.address);
	});

	it("generates a PDA", async () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const borrower = Keypair.generate();
		const pda = await BorrowerInfo.generatePDA(borrower.publicKey, market);

		const seeds = [
			marketAddress.publicKey.toBuffer(),
			borrower.publicKey.toBuffer(),
			encodeSeedString("borrower-info"),
		];
		const expected = await PublicKey.findProgramAddress(seeds, market.programId);

		expect(pda[0].equals(expected[0])).to.be.true;
	});
});
