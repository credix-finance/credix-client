import { chaiSolana } from "@saberhq/chai-solana";
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair } from "@solana/web3.js";
import Big from "big.js";
import { expect, use } from "chai";
import Sinon from "sinon";
import { BorrowerInfo, CredixPass, Deal, Market } from "../src";
import { borrowerInfoFixture, programBorrowerInfoFixture } from "./fixtures/BorrowerInfo.fixture";
import { credixPassFixture, programCredixPassFixture } from "./fixtures/CredixPass.fixture";
import { dealFixture, programDealFixture } from "./fixtures/Deal.fixture";
import { globalMarketFixture, programMarketFixture } from "./fixtures/Market.fixture";
import { rpcResponseAndContextFixture } from "./fixtures/rpc.fixture";
import { tokenAmountFixture } from "./fixtures/Token.fixture";
import { testClient, testConnection, testProgramId } from "./util";

use(chaiSolana);

describe("Market", async () => {
	const sandbox = Sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	it("should have the correct name", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const stub = sandbox.stub(testConnection, "getAccountInfo");
		stub.returns(Promise.resolve(marketFixture));

		const marketName = "credix-marketplace";

		// Act
		const market = await testClient.fetchMarket(marketName);

		// Assert
		expect(market?.name).to.equal(marketName);
	});

	it("should have the correct address", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const stub = sandbox.stub(testConnection, "getAccountInfo");
		stub.returns(Promise.resolve(marketFixture));

		const marketName = "credix-marketplace";

		// Act
		const market = await testClient.fetchMarket(marketName);

		// Assert
		const [marketAddress] = await Market.generatePDA(marketName, testProgramId);
		expect(market?.address).to.eqAddress(marketAddress);
	});

	it("returns the program id", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const stub = sandbox.stub(testConnection, "getAccountInfo");
		stub.returns(Promise.resolve(marketFixture));

		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		// Act
		const programId = market?.programId;

		// Assert
		expect(programId?.equals(testProgramId)).to.be.true;
	});

	it("returns the base mint public key", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const stub = sandbox.stub(testConnection, "getAccountInfo");
		stub.returns(Promise.resolve(marketFixture));

		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		// Act
		const baseMintPK = market?.baseMintPK;

		// Assert
		expect(baseMintPK?.equals(globalMarketFixture.liquidityPoolTokenMintAccount)).to.be.true;
	});

	it("returns the lp mint public key", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const stub = sandbox.stub(testConnection, "getAccountInfo");
		stub.returns(Promise.resolve(marketFixture));

		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		// Act
		const lpMintPK = market?.lpMintPK;

		// Assert
		expect(lpMintPK?.equals(globalMarketFixture.lpTokenMintAccount)).to.be.true;
	});

	it("returns the treasury public key", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const stub = sandbox.stub(testConnection, "getAccountInfo");
		stub.returns(Promise.resolve(marketFixture));

		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		// Act
		const treasury = market?.treasury;

		// Assert
		expect(treasury?.equals(globalMarketFixture.treasuryPoolTokenAccount)).to.be.true;
	});

	it("returns the withdraw fee", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const stub = sandbox.stub(testConnection, "getAccountInfo");
		stub.returns(Promise.resolve(marketFixture));

		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		// Act
		const withdrawFee = market?.withdrawFee;

		// Assert
		expect(withdrawFee?.numerator).to.equal(globalMarketFixture.withdrawalFee.numerator);
		expect(withdrawFee?.denominator).to.equal(globalMarketFixture.withdrawalFee.denominator);
	});

	it("returns the interest fee", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const stub = sandbox.stub(testConnection, "getAccountInfo");
		stub.returns(Promise.resolve(marketFixture));

		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		// Act
		const interestFee = market?.interestFee;

		// Assert
		expect(interestFee?.numerator).to.equal(globalMarketFixture.interestFee.numerator);
		expect(interestFee?.denominator).to.equal(globalMarketFixture.interestFee.denominator);
	});

	it("returns the lp supply", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		const getTokenSupplyStub = sandbox.stub(testConnection, "getTokenSupply");
		getAccountInfoStub.returns(Promise.resolve(marketFixture));
		getTokenSupplyStub.returns(
			Promise.resolve(rpcResponseAndContextFixture(tokenAmountFixture(100, 6)))
		);

		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		if (!market) {
			throw new Error();
		}

		// Act
		const lpSupply = await market.getLPSupply();

		// Assert'
		expect(Number(lpSupply.amount)).to.equal(100);
	});

	it("calculates the TVL", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);

		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		getAccountInfoStub.returns(Promise.resolve(marketFixture));

		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		if (!market) {
			throw new Error();
		}

		const liquidityPoolBaseTokenAccountPK = await market?.findLiquidityPoolTokenAccount();

		const getTokenAccountBalanceStub = sandbox.stub(testConnection, "getTokenAccountBalance");
		getTokenAccountBalanceStub
			.withArgs(liquidityPoolBaseTokenAccountPK)
			.returns(Promise.resolve(rpcResponseAndContextFixture(tokenAmountFixture(10, 6))));

		// Act
		const tvl = await market.calculateTVL();

		// Assert
		const totalOutstandingCredit = market.totalOutstandingCredit;
		const liquidityPoolBalance = await market.fetchLiquidityPoolBalance();
		const expectedTVL = new Big(liquidityPoolBalance.amount).add(totalOutstandingCredit);

		expect(tvl.toNumber()).to.equal(expectedTVL.toNumber());
	});

	it("fetches the liquidity pool balance", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);

		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		getAccountInfoStub.returns(Promise.resolve(marketFixture));

		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		if (!market) {
			throw new Error();
		}

		const liquidityPoolBaseTokenAccountPK = await market?.findLiquidityPoolTokenAccount();

		const getTokenAccountBalanceStub = sandbox.stub(testConnection, "getTokenAccountBalance");
		getTokenAccountBalanceStub
			.withArgs(liquidityPoolBaseTokenAccountPK)
			.returns(Promise.resolve(rpcResponseAndContextFixture(tokenAmountFixture(10, 6))));

		// Act
		const liquidityPoolBalance = await market.fetchLiquidityPoolBalance();

		// Assert
		expect(Number(liquidityPoolBalance.amount)).to.equal(10);
	});

	it("returns the LP price", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);

		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		getAccountInfoStub.returns(Promise.resolve(marketFixture));

		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		if (!market) {
			throw new Error();
		}

		const liquidityPoolBaseTokenAccountPK = await market?.findLiquidityPoolTokenAccount();

		const getTokenAccountBalanceStub = sandbox.stub(testConnection, "getTokenAccountBalance");
		getTokenAccountBalanceStub
			.withArgs(liquidityPoolBaseTokenAccountPK)
			.returns(Promise.resolve(rpcResponseAndContextFixture(tokenAmountFixture(10, 6))));

		const getTokenSupplyStub = sandbox.stub(testConnection, "getTokenSupply");
		getTokenSupplyStub.returns(
			Promise.resolve(rpcResponseAndContextFixture(tokenAmountFixture(100, 6)))
		);

		// Act
		const lpPrice = await market.getLPPrice();

		// Assert
		const tvl = await market.calculateTVL();
		expect(lpPrice.eq(tvl.div(new Big(100)))).to.be.true;
	});

	it("returns the LP price 0 when no supply yet", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);

		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		getAccountInfoStub.returns(Promise.resolve(marketFixture));

		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		if (!market) {
			throw new Error();
		}

		const liquidityPoolBaseTokenAccountPK = await market?.findLiquidityPoolTokenAccount();

		const getTokenAccountBalanceStub = sandbox.stub(testConnection, "getTokenAccountBalance");
		getTokenAccountBalanceStub
			.withArgs(liquidityPoolBaseTokenAccountPK)
			.returns(Promise.resolve(rpcResponseAndContextFixture(tokenAmountFixture(10, 6))));

		const getTokenSupplyStub = sandbox.stub(testConnection, "getTokenSupply");
		getTokenSupplyStub.returns(
			Promise.resolve(rpcResponseAndContextFixture(tokenAmountFixture(0, 6)))
		);

		// Act
		const lpPrice = await market.getLPPrice();

		// Assert
		expect(lpPrice.eq(0)).to.be.true;
	});

	it("finds a base token account", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		getAccountInfoStub.returns(Promise.resolve(marketFixture));
		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		if (!market) {
			throw new Error();
		}

		const pk = Keypair.generate().publicKey;

		// Act
		const baseTokenAccount = await market.findBaseTokenAccount(pk);

		// Assert
		const expected = await Token.getAssociatedTokenAddress(
			ASSOCIATED_TOKEN_PROGRAM_ID,
			TOKEN_PROGRAM_ID,
			market.baseMintPK,
			pk,
			false
		);

		expect(baseTokenAccount.equals(expected)).to.be.true;
	});

	it("finds an off curve base token account", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		getAccountInfoStub.returns(Promise.resolve(marketFixture));
		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		if (!market) {
			throw new Error();
		}

		// Act
		const baseTokenAccount = await market.findBaseTokenAccount(market.address);

		// Assert
		const expected = await Token.getAssociatedTokenAddress(
			ASSOCIATED_TOKEN_PROGRAM_ID,
			TOKEN_PROGRAM_ID,
			market.baseMintPK,
			market.address,
			true
		);

		expect(baseTokenAccount.equals(expected)).to.be.true;
	});

	it("finds a lp token account", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		getAccountInfoStub.returns(Promise.resolve(marketFixture));
		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		if (!market) {
			throw new Error();
		}

		const pk = Keypair.generate().publicKey;

		// Act
		const baseTokenAccount = await market.findLPTokenAccount(pk);

		// Assert
		const expected = await Token.getAssociatedTokenAddress(
			ASSOCIATED_TOKEN_PROGRAM_ID,
			TOKEN_PROGRAM_ID,
			market.lpMintPK,
			pk,
			false
		);

		expect(baseTokenAccount.equals(expected)).to.be.true;
	});

	it("finds an off curve lp token account", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		getAccountInfoStub.returns(Promise.resolve(marketFixture));
		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		if (!market) {
			throw new Error();
		}

		// Act
		const baseTokenAccount = await market.findLPTokenAccount(market.address);

		// Assert
		const expected = await Token.getAssociatedTokenAddress(
			ASSOCIATED_TOKEN_PROGRAM_ID,
			TOKEN_PROGRAM_ID,
			market.lpMintPK,
			market.address,
			true
		);

		expect(baseTokenAccount.equals(expected)).to.be.true;
	});

	it("returns the user base balance", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		getAccountInfoStub.returns(Promise.resolve(marketFixture));
		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		if (!market) {
			throw new Error();
		}

		const user = Keypair.generate().publicKey;
		const userBaseTokenAccount = await market.findBaseTokenAccount(user);
		const getTokenAccountBalanceStub = sandbox.stub(testConnection, "getTokenAccountBalance");
		getTokenAccountBalanceStub
			.withArgs(userBaseTokenAccount)
			.returns(Promise.resolve(rpcResponseAndContextFixture(tokenAmountFixture(999, 6))));

		// Act
		const amount = await market.userBaseBalance(user);

		// Assert
		expect(amount.amount).to.equal("999");
	});

	it("returns the user lp balance", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		getAccountInfoStub.returns(Promise.resolve(marketFixture));
		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		if (!market) {
			throw new Error();
		}

		const user = Keypair.generate().publicKey;
		const userLPTokenAccount = await market.findLPTokenAccount(user);
		const getTokenAccountBalanceStub = sandbox.stub(testConnection, "getTokenAccountBalance");
		getTokenAccountBalanceStub
			.withArgs(userLPTokenAccount)
			.returns(Promise.resolve(rpcResponseAndContextFixture(tokenAmountFixture(999, 6))));

		// Act
		const amount = await market.userLPBalance(user);

		// Assert
		expect(amount.amount).to.equal("999");
	});

	it("returns the total outstanding credit", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		getAccountInfoStub.returns(Promise.resolve(marketFixture));
		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		if (!market) {
			throw new Error();
		}

		// Act
		const totalOutstandingCredit = market.totalOutstandingCredit;

		// Assert
		expect(
			totalOutstandingCredit.eq(new Big(globalMarketFixture.totalOutstandingCredit.toNumber()))
		).to.be.true;
	});

	it("returns the gatekeeper network", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		getAccountInfoStub.returns(Promise.resolve(marketFixture));
		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		if (!market) {
			throw new Error();
		}

		// Act
		const gatekeeperNetwork = market.gateKeeperNetwork;

		// Assert
		expect(gatekeeperNetwork.equals(globalMarketFixture.gatekeeperNetwork)).to.be.true;
	});

	it("fetches borrower info", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const marketName = "credix-marketplace";
		const marketAddress = await Market.generatePDA(marketName, testProgramId);
		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		getAccountInfoStub.withArgs(marketAddress[0]).returns(Promise.resolve(marketFixture));
		const market = await testClient.fetchMarket(marketName);

		if (!market) {
			throw new Error();
		}

		const borrower = Keypair.generate();
		const borrowerInfoAddress = await BorrowerInfo.generatePDA(borrower.publicKey, market);

		const borrowerFixture = await programBorrowerInfoFixture({
			...borrowerInfoFixture,
			bump: borrowerInfoAddress[1],
		});
		getAccountInfoStub.withArgs(borrowerInfoAddress[0]).returns(Promise.resolve(borrowerFixture));

		// Act
		const borrowerInfo = await market.fetchBorrowerInfo(borrower.publicKey);

		// Assert
		expect(borrowerInfo?.address.equals(borrowerInfoAddress[0])).to.be.true;
		expect(borrowerInfo?.borrower.equals(borrower.publicKey)).to.be.true;
	});

	it("fetches a deal", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const marketName = "credix-marketplace";
		const marketAddress = await Market.generatePDA(marketName, testProgramId);
		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		getAccountInfoStub.withArgs(marketAddress[0]).returns(Promise.resolve(marketFixture));
		const market = await testClient.fetchMarket(marketName);

		if (!market) {
			throw new Error();
		}

		const borrower = Keypair.generate();
		const dealAddress = await Deal.generatePDA(borrower.publicKey, 0, market);
		getAccountInfoStub
			.withArgs(dealAddress[0])
			.returns(
				Promise.resolve(
					programDealFixture({ ...dealFixture, borrower: borrower.publicKey, bump: dealAddress[1] })
				)
			);

		// Act
		const deal = await market.fetchDeal(borrower.publicKey, 0);

		// Assert
		expect(deal?.address.equals(dealAddress[0])).to.be.true;
		expect(deal?.borrower.equals(borrower.publicKey)).to.be.true;
		expect(deal?.number).to.equal(0);
	});

	it("fetches a credix pass", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const marketName = "credix-marketplace";
		const marketAddress = await Market.generatePDA(marketName, testProgramId);
		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		getAccountInfoStub.withArgs(marketAddress[0]).returns(Promise.resolve(marketFixture));
		const market = await testClient.fetchMarket(marketName);

		if (!market) {
			throw new Error();
		}

		const borrower = Keypair.generate();

		const credixPassAddress = await CredixPass.generatePDA(borrower.publicKey, market);
		getAccountInfoStub
			.withArgs(credixPassAddress[0])
			.returns(Promise.resolve(programCredixPassFixture(credixPassFixture)));

		// Act
		const credixPass = await market.fetchCredixPass(borrower.publicKey);

		// Assert
		expect(credixPass?.address.equals(credixPassAddress[0])).to.be.true;
	});

	it("finds the liquidity pool token account", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);
		const marketName = "credix-marketplace";
		const marketAddress = await Market.generatePDA(marketName, testProgramId);
		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		getAccountInfoStub.withArgs(marketAddress[0]).returns(Promise.resolve(marketFixture));
		const market = await testClient.fetchMarket(marketName);

		if (!market) {
			throw new Error();
		}

		// Act
		const liquidityPoolTokenAccount = await market.findLiquidityPoolTokenAccount();

		// Assert
		const signingAuthority = await market.generateSigningAuthorityPDA();
		const expected = await market.findBaseTokenAccount(signingAuthority[0]);
		expect(liquidityPoolTokenAccount.equals(expected)).to.be.true;
	});

	it("calculates the user stake in base", async () => {
		// Arrange
		const marketFixture = await programMarketFixture(globalMarketFixture);

		const getAccountInfoStub = sandbox.stub(testConnection, "getAccountInfo");
		getAccountInfoStub.returns(Promise.resolve(marketFixture));

		const marketName = "credix-marketplace";
		const market = await testClient.fetchMarket(marketName);

		if (!market) {
			throw new Error();
		}

		const liquidityPoolBaseTokenAccountPK = await market?.findLiquidityPoolTokenAccount();

		const getTokenAccountBalanceStub = sandbox.stub(testConnection, "getTokenAccountBalance");
		getTokenAccountBalanceStub
			.withArgs(liquidityPoolBaseTokenAccountPK)
			.returns(Promise.resolve(rpcResponseAndContextFixture(tokenAmountFixture(10, 6))));

		const getTokenSupplyStub = sandbox.stub(testConnection, "getTokenSupply");
		getTokenSupplyStub.returns(
			Promise.resolve(rpcResponseAndContextFixture(tokenAmountFixture(100, 6)))
		);

		const user = Keypair.generate();
		const userLPTokenAccount = await market.findLPTokenAccount(user.publicKey);

		getTokenAccountBalanceStub
			.withArgs(userLPTokenAccount)
			.returns(Promise.resolve(rpcResponseAndContextFixture(tokenAmountFixture(100, 6))));

		// Act
		const stake = await market.getUserStake(user.publicKey);

		// Assert
		const price = await market.getLPPrice();
		const expected = new Big(100).mul(price);
		expect(stake.eq(expected)).to.be.true;
	});
});
