import * as React from "react";
import { CredixClient } from "..";

export const ClientContext = React.createContext<CredixClient | undefined>(undefined);

export const useCredixClient = () => {
	const client = React.useContext(ClientContext);

	if (!client) {
		throw new Error("No CredixClientProvider found");
	}

	return client;
};
