export function formatDate(date: bigint) {
  return new Date(Number(date) / 1000000).toLocaleDateString();
}

