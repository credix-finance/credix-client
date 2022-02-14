import { TokenAmount } from "@solana/web3.js";

export const tokenAmountFixture = (amount: number, decimals: number): TokenAmount => {
	const uiAmount = amount / Math.pow(10, decimals);
	return {
		amount: amount.toString(),
		decimals: decimals,
		uiAmount: uiAmount,
		uiAmountString: uiAmount.toString(),
	};
};
