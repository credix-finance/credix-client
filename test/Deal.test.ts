import { Keypair, PublicKey } from "@solana/web3.js";
import Sinon from "sinon";
import { globalMarketFixture } from "./fixtures/Market.fixture";
import { testClient, testProgram } from "./util";
import { dealFixture } from "./fixtures/Deal.fixture";
import { expect } from "chai";
import { BN } from "@project-serum/anchor";
import Big from "big.js";
import { Deal, DealStatus, Market, Ratio } from "../src";
import { encodeSeedString } from "../src/utils/pda.utils";

describe("Deal", () => {
	const sandbox = Sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	it("returns the address", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const dealAddress = Keypair.generate();
		const deal = new Deal(dealFixture, market, dealAddress.publicKey, testProgram, testClient);

		expect(deal.address.equals(dealAddress.publicKey)).to.be.true;
	});

	it("returns the market", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const dealAddress = Keypair.generate();
		const deal = new Deal(dealFixture, market, dealAddress.publicKey, testProgram, testClient);

		expect(deal.market).to.equal(market);
	});

	it("generates a pda", async () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);

		const borrower = Keypair.generate();
		const pda = await Deal.generatePDA(borrower.publicKey, 0, market);
		const dealNumberSeed = new BN(0).toArrayLike(Buffer, "le", 2);
		const dealSeed = encodeSeedString("deal-info");
		const seed = [
			market.address.toBuffer(),
			borrower.publicKey.toBuffer(),
			dealNumberSeed,
			dealSeed,
		];
		const expected = await PublicKey.findProgramAddress(seed, market.programId);
		expect(pda[0].equals(expected[0])).to.be.true;
	});

	it("returns the name", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const dealAddress = Keypair.generate();
		const deal = new Deal(dealFixture, market, dealAddress.publicKey, testProgram, testClient);

		expect(deal.name).to.equal(dealFixture.name);
	});

	it("returns the creation date timestamp", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const dealAddress = Keypair.generate();
		const deal = new Deal(dealFixture, market, dealAddress.publicKey, testProgram, testClient);

		expect(deal.createdAt).to.equal(dealFixture.createdAt);
	});

	it("returns the leverage ratio", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const dealAddress = Keypair.generate();
		const deal = new Deal(dealFixture, market, dealAddress.publicKey, testProgram, testClient);

		expect(deal.leverageRatio).to.equal(dealFixture.leverageRatio);
	});

	it("returns the underwriter performance ratio", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const dealAddress = Keypair.generate();
		const deal = new Deal(dealFixture, market, dealAddress.publicKey, testProgram, testClient);

		expect(
			deal.underwriterPerformanceFeePercentage.denominator.eq(
				new Big(dealFixture.underwriterPerformanceFeePercentage.denominator)
			)
		).to.be.true;
		expect(
			deal.underwriterPerformanceFeePercentage.numerator.eq(
				new Big(dealFixture.underwriterPerformanceFeePercentage.numerator)
			)
		).to.be.true;
	});

	it("returns the number", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const dealAddress = Keypair.generate();
		const deal = new Deal(dealFixture, market, dealAddress.publicKey, testProgram, testClient);

		expect(deal.number).to.equal(dealFixture.dealNumber);
	});

	it("returns the late fees", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const dealAddress = Keypair.generate();
		const deal = new Deal(dealFixture, market, dealAddress.publicKey, testProgram, testClient);

		expect(deal.lateFees).to.equal(dealFixture.lateFees);
	});

	it("returns the late fees repaid", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const dealAddress = Keypair.generate();
		const deal = new Deal(dealFixture, market, dealAddress.publicKey, testProgram, testClient);

		expect(deal.lateFeesRepaid).to.equal(dealFixture.lateFeesRepaid);
	});

	it("returns if the deal is private", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const dealAddress = Keypair.generate();
		const deal = new Deal(dealFixture, market, dealAddress.publicKey, testProgram, testClient);

		expect(deal.isPrivate).to.equal(dealFixture.private);
	});

	it("returns if the deal is defaulted", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const dealAddress = Keypair.generate();
		const deal = new Deal(dealFixture, market, dealAddress.publicKey, testProgram, testClient);

		expect(deal.defaulted).to.equal(dealFixture.defaulted);
	});

	it("returns the principal", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const dealAddress = Keypair.generate();
		const deal = new Deal(dealFixture, market, dealAddress.publicKey, testProgram, testClient);

		expect(deal.principal.eq(new Big(dealFixture.principal.toNumber()))).to.be.true;
	});

	it("returns principal repaid", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const dealAddress = Keypair.generate();
		const deal = new Deal(dealFixture, market, dealAddress.publicKey, testProgram, testClient);

		expect(deal.principalAmountRepaid.eq(new Big(dealFixture.principalAmountRepaid.toNumber()))).to
			.be.true;
	});

	it("returns principal principal to repay", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const dealAddress = Keypair.generate();
		const deal = new Deal(dealFixture, market, dealAddress.publicKey, testProgram, testClient);

		const principal = new Big(dealFixture.principal.toNumber());
		const principalAmountRepaid = new Big(dealFixture.principalAmountRepaid.toNumber());
		expect(deal.principalToRepay.eq(principal.sub(principalAmountRepaid))).to.be.true;
	});

	it("returns the interest repaid", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const dealAddress = Keypair.generate();
		const deal = new Deal(dealFixture, market, dealAddress.publicKey, testProgram, testClient);

		expect(deal.interestRepaid.eq(new Big(dealFixture.interestAmountRepaid.toNumber()))).to.be.true;
	});

	it("returns the financing fee percentage", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const dealAddress = Keypair.generate();
		const deal = new Deal(dealFixture, market, dealAddress.publicKey, testProgram, testClient);

		expect(
			deal.financingFeePercentage.numerator.eq(
				new Big(dealFixture.financingFeePercentage.numerator)
			)
		).to.be.true;
		expect(
			deal.financingFeePercentage.denominator.eq(
				new Big(dealFixture.financingFeePercentage.denominator)
			)
		).to.be.true;
	});

	it("returns the time to maturity", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const dealAddress = Keypair.generate();
		const deal = new Deal(dealFixture, market, dealAddress.publicKey, testProgram, testClient);

		expect(deal.timeToMaturity).to.equal(dealFixture.timeToMaturityDays);
	});

	it("returns the go live at", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const dealAddress = Keypair.generate();
		const deal = new Deal(dealFixture, market, dealAddress.publicKey, testProgram, testClient);

		expect(deal.goLiveAt).to.equal(dealFixture.goLiveAt.toNumber());
	});

	it("has status closed when repaid", () => {
		const marketAddress = Keypair.generate();
		const market = new Market(
			globalMarketFixture,
			"market",
			testProgram,
			marketAddress.publicKey,
			testClient
		);
		const dealAddress = Keypair.generate();
		const timeToMaturity = new Ratio(dealFixture.timeToMaturityDays, 360);
		const financingFeePercentage = new Ratio(
			dealFixture.financingFeePercentage.numerator,
			dealFixture.financingFeePercentage.denominator
		);
		const interest = financingFeePercentage.apply(new Big(dealFixture.principal.toNumber()));
		const totalInterest = timeToMaturity.apply(interest);
		const deal = new Deal(
			{
				...dealFixture,
				principalAmountRepaid: dealFixture.principal,
				interestAmountRepaid: new BN(totalInterest.toNumber()),
			},
			market,
			dealAddress.publicKey,
			testProgram,
			testClient
		);

		expect(deal.status).to.equal(DealStatus.CLOSED);
	});
});
