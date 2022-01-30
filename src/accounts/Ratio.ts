import Big from "big.js";
import { Ratio as IDLRatio } from "idl/idl.types";

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

	toIDLRatio(): IDLRatio {
		return { numerator: this.numerator.toNumber(), denominator: this.denominator.toNumber() };
	}
}
