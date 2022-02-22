import { Wallet } from "@project-serum/anchor";
import { Connection } from "@solana/web3.js";
import { CredixClient, CredixClientConfig } from "..";
import * as React from "react";
import { ClientContext } from "./useCredixClient";

export interface CredixClientProviderProps {
	connection: Connection;
	wallet: typeof Wallet;
	config: CredixClientConfig;
	children: React.ReactNode;
}

export const CredixClientProvider = (props: CredixClientProviderProps) => {
	const client = React.useMemo(
		() => new CredixClient(props.connection, props.wallet, props.config),
		[props.connection, props.wallet, props.config]
	);

	return <ClientContext.Provider value={client}>{props.children}</ClientContext.Provider>;
};
