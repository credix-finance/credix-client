import Big from "big.js";

export class Ratio {
	numerator: Big;
	denominator: Big;

	constructor(numerator: number, denominator: number) {
		this.numerator = new Big(numerator);
		this.denominator = new Big(denominator);
	}

	apply(to: Big) {
		return to.mul(this.numerator).div(this.denominator);
	}
}
