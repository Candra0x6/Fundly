import { canisterId, createActor } from "@declarations/verification_workflow";
import { useAuth } from "../use-auth-client";
import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "@declarations/verification_workflow/verification_workflow.did";
export function useVerificationWorkflowActor() {
  const { identity } = useAuth()
  const actor = createActor(canisterId, {
    agentOptions: {
      // @ts-ignore
      identity,
    },
  });
  return actor as ActorSubclass<_SERVICE>
}