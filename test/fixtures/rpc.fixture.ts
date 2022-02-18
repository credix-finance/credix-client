import { RpcResponseAndContext } from "@solana/web3.js";

export const rpcResponseAndContextFixture = <T>(response: T): RpcResponseAndContext<T> => {
	return {
		context: {
			slot: 1,
		},
		value: response,
	};
};
