import { canisterId } from "@declarations/authentication";
import { createActor } from "@declarations/authentication";
import { useAuth } from "../use-auth-client";

export function useAuthenticationActor() {
  const { identity } = useAuth()
  const actor = createActor(canisterId, {
    agentOptions: {
      // @ts-ignore
      identity,
    },
  });

  return actor;
}
