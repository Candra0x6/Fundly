export function convertBigNumber(value: string | number) {
  const number = Number(value);
  if (isNaN(number)) {
    return "0";
  }

  // convert to billion B
  if (number >= 1000000000) {
    return (number / 1000000000) + "B";
  }

  // convert to million M
  if (number >= 1000000) {
    return (number / 1000000) + "M";
  }

  // convert to thousand K
  if (number >= 1000) {
    return (number / 1000) + "K";
  }
  return number
}