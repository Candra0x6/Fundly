import { NftTx } from "@declarations/nft_canister/nft_canister.did"
import { DistributionTx } from "@declarations/revenue_reporting/revenue_reporting.did"
import { TokenTx } from "@declarations/token_canister/token_canister.did"

export type AllTransactions = TokenTx | DistributionTx | NftTx
