
export function splitIdentity(identity: string) {
  return identity.split("-").slice(0, 2).join("-") + "..."
}
