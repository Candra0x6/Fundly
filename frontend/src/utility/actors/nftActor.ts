import { canisterId } from "@declarations/nft_canister";
import { createActor } from "@declarations/nft_canister";
import { useAuth } from "../use-auth-client";
import { ActorSubclass, Identity } from "@dfinity/agent";
import { _SERVICE as NFTService } from "@declarations/nft_canister/nft_canister.did";
export function useNftActor() {
  const { identity } = useAuth()
  const actor = createActor(canisterId, {
    agentOptions: {
      identity: identity as Identity,
    },
  });
  return actor as ActorSubclass<NFTService>;
}