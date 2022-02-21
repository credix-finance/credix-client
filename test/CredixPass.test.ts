import { Keypair } from "@solana/web3.js";
import { expect } from "chai";
import { CredixPass } from "index";
import Sinon from "sinon";
import { credixPassFixture } from "./fixtures/CredixPass.fixture";

describe("CredixPass", async () => {
	const sandbox = Sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	it("returns the user", () => {
		// Arrange
		const credixPass = new CredixPass(credixPassFixture, Keypair.generate().publicKey);

		// Act
		const user = credixPass.user;

		// Assert
		expect(user.equals(credixPassFixture.user)).to.be.true;
	});

	it("returns the  release timestamp", () => {
		// Arrange
		const credixPass = new CredixPass(credixPassFixture, Keypair.generate().publicKey);

		// Act
		const releaseTimestamp = credixPass.releaseTimestamp;

		// Assert
		expect(releaseTimestamp).to.equal(credixPassFixture.releaseTimestamp.toNumber());
	});
});
