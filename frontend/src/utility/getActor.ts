// helpers/getActor.ts
import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { useAuth } from "./use-auth-client";

export function getActor<T>(
  idlFactory: any,
  canisterId: string,
): T {
  const { identity } = useAuth()

  const agent = new HttpAgent({ identity: identity as Identity });
  if (process.env.DFX_NETWORK === "local") agent.fetchRootKey();
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  }) as unknown as T;
}

