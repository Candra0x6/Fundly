import { canisterId } from "@declarations/asset_storage";
import { createActor } from "@declarations/asset_storage";
import { useAuth } from "../use-auth-client";
import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "@declarations/asset_storage/asset_storage.did";
export function useStorageActor() {
  const { identity } = useAuth()
  const actor = createActor(canisterId, {
    agentOptions: {
      // @ts-ignore
      identity,
    },
  });
  return actor as ActorSubclass<_SERVICE>
}