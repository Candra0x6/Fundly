import { Principal } from "@dfinity/principal"

export function truncatePrincipal(principal: Principal): string {
  const principalString = principal.toText()
  return principalString.slice(0, 6) + '...' + principalString.slice(-4)
}
