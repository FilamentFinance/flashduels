export function calculateFlashDuelsOptionPrice(
    T: number,
    totalYes: number,
    totalNo: number
  ) {
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
  
    // Final price calculations
    const priceYes = firstTerm * secondTermYes;
    const priceNo = firstTerm * secondTermNo;
  
    return { priceYes, priceNo };
  }
  