import { canisterId, createActor } from "@declarations/token_canister";
import { useAuth } from "../use-auth-client";
import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "@declarations/token_canister/token_canister.did";
export function useTokenActor() {
  const { identity } = useAuth();

  const actor = createActor(canisterId, {
    agentOptions: {
      // @ts-ignore
      identity,
    },
  });

  return actor as ActorSubclass<_SERVICE>
}

