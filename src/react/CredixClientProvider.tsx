import { Wallet } from "@project-serum/anchor";
import { Connection } from "@solana/web3.js";
import * as React from "react";
import { CredixClient, CredixClientConfig } from "..";
import { ClientContext } from "./useCredixClient";

interface Props {
	connection: Connection;
	wallet: typeof Wallet;
	config: CredixClientConfig;
	children: React.ReactNode;
}

export const CredixClientProvider = (props: Props) => {
	const client = React.useMemo(
		() => new CredixClient(props.connection, props.wallet, props.config),
		[props.connection, props.wallet, props.config]
	);

	return <ClientContext.Provider value={client}>{props.children}</ClientContext.Provider>;
};
