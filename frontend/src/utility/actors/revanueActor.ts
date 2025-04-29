import { canisterId } from "@declarations/revenue_reporting";
import { createActor } from "@declarations/revenue_reporting";
import { useAuth } from "../use-auth-client";
import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "@declarations/revenue_reporting/revenue_reporting.did";

export function useRevenueActor() {
  const { identity } = useAuth()
  const actor = createActor(canisterId, {
    agentOptions: {
      // @ts-ignore
      identity,
    },
  });
  return actor as ActorSubclass<_SERVICE>
}