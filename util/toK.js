export default function toK(num, fixed = false, decimals = 2) {
  const formatter = (divideBy) =>
    fixed === true
      ? Number(num / divideBy).toFixed(decimals)
      : Number(num / divideBy);

  if (num > 999999999 || num < -9999999) {
    return `${formatter(1000000000)}M`;
  } else if (num > 999999 || num < -999999) {
    return `${formatter(1000000)}M`;
  } else if (num > 999 || num < -999) {
    return `${formatter(1000)}K`;
  } else {
    return formatter(1);
  }
}
