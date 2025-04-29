import { canisterId } from "@declarations/msme_registration";
import { createActor } from "@declarations/msme_registration";
import { useAuth } from "../use-auth-client";
import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "@declarations/msme_registration/msme_registration.did";

export function useMsmeActor() {
  const { identity } = useAuth()
  const actor = createActor(canisterId, {
    agentOptions: {
      // @ts-ignore
      identity,
    },
  });
  return actor as ActorSubclass<_SERVICE>;
}