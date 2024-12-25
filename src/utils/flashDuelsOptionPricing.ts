export function calculateFlashDuelsOptionPrice(
  T: number,
  totalYes: number,
  totalNo: number
) {
  console.log(T, totalYes, totalNo, "calculatedFlashDuelsOptionPrice");
  const alpha = 0.05;
  const beta = 0.35;
  const x = 0;
  const totalBet = totalYes + totalNo;

  // Calculate the first term: 1 / (1 + e^(-alpha * (T - x)))
  const exponentialTerm = Math.exp(-alpha * (T - x));
  const firstTerm = 1 / (1 + exponentialTerm);

  // Safely calculate the second terms with a fallback if totalBet is zero
  const secondTermYes = 1 + beta * (totalBet > 0 ? totalYes / totalBet : 1);
  const secondTermNo = 1 + beta * (totalBet > 0 ? totalNo / totalBet : 1);

  // Calculate raw prices
  const rawPriceYes = firstTerm * secondTermYes;
  const rawPriceNo = firstTerm * secondTermNo;

  // Normalize prices to ensure their sum is 1
  const totalPrice = rawPriceYes + rawPriceNo;
  const priceYes = rawPriceYes / totalPrice;
  const priceNo = rawPriceNo / totalPrice;

  return { priceYes, priceNo };
}
