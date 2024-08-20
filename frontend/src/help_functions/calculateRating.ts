export function calculateRating(ratings: number[]) {
  let sum = 0;

  const length = ratings.length;

  if (length === 0) {
    return 0;
  }

  for (let r = 0; r < length; r++) {
    sum = sum + ratings[r];
  }
  let result = sum / length;
  const decimalPlaces = 1;

  return parseFloat(result.toFixed(decimalPlaces));
}
