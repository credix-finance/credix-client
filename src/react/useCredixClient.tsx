import { CredixClient } from "index";
import * as React from "react";

export const ClientContext = React.createContext<CredixClient | undefined>(undefined);

export const useCredixClient = () => {
	const client = React.useContext(ClientContext);

	if (!client) {
		// TODO: better error message;
		throw new Error("No CredixClientProvider found");
	}

	return client;
};
