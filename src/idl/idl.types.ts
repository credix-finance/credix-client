import { AnchorTypes } from "@saberhq/anchor-contrib";
import { Credix } from "../idl/credix";

export type CredixTypes = AnchorTypes<
	Credix,
	{
		deal: Deal;
		globalMarketState: GlobalMarketState;
		borrowerInfo: BorrowerInfo;
		credixPass: CredixPass;
	},
	{ DealRepaymentType: RepaymentType; Ratio: Ratio }
>;

export type CredixProgram = CredixTypes["Program"];

export type CredixAccounts = CredixTypes["Accounts"];
export type Deal = CredixAccounts["deal"];
export type CredixPass = CredixAccounts["credixPass"];
export type GlobalMarketState = CredixAccounts["globalMarketState"];
export type BorrowerInfo = CredixAccounts["borrowerInfo"];

export type Ratio = {
	numerator: number;
	denominator: number;
};

export type PrincipalRepaymentType = { principal: Record<string, never> };
export type InterestRepaymentType = { interest: Record<string, never> };

export type RepaymentType = PrincipalRepaymentType | InterestRepaymentType;
