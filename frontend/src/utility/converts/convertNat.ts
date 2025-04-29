import { Value } from "@declarations/token_canister/token_canister.did"

export function convertNat(value: Value, decimals: number) {
  // @ts-ignore
  const raw = value.Nat.toString().padStart(decimals + 1, '0');
  const whole = raw.slice(0, -decimals);
  const fraction = raw.slice(-decimals).replace(/0+$/, ''); // remove trailing zero
  return fraction ? `${whole}.${fraction}` : whole;
}
