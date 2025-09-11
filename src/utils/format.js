
export default function formatToken(amount, decimals = 18, precision = 4) {
  if (!amount) return "0";

  // Convert to BigInt for safety
  const bigAmount = BigInt(amount.toString());

  const divisor = 10n ** BigInt(decimals);
  const whole = bigAmount / divisor;
  const fraction = bigAmount % divisor;

  // Convert fraction to fixed precision
  const fractionStr = (Number(fraction) / Number(divisor))
    .toFixed(precision)
    .slice(2); // remove "0."

  return `${whole.toString()}.${fractionStr}`;
}
