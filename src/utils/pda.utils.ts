import { utils } from "@project-serum/anchor";

export const encodeSeedString = (seedString: string) =>
	Buffer.from(utils.bytes.utf8.encode(seedString));
