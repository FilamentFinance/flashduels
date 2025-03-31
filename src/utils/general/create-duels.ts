export const mapCategoryToEnumIndex = (category: string): number => {
  switch (category.toLowerCase()) {
    case 'crypto':
      return 1;
    case 'politics':
      return 2;
    case 'sports':
      return 3;
    case 'twitter':
      return 4;
    case 'nfts':
      return 5;
    case 'news':
      return 6;
    default:
      return 0;
  }
};

// export const mapDurationToNumber = (duration: string): number => {
//   switch (duration.toUpperCase()) {
//     case '3H':
//       return 0;
//     case '6H':
//       return 1;
//     case '12H':
//       return 2;
//     default:
//       throw new Error('Invalid duration');
//   }
// };

export const mapDurationToNumber = (duration: string, isDuelType: 'flash' | 'coin' = 'coin'): number => {
  // For Flash Duels, only allow 1H and above
  if (isDuelType === 'flash') {
    switch (duration.toUpperCase()) {
      case '1H':
        return 3;
      case '3H':
        return 4;
      case '6H':
        return 5;
      case '12H':
        return 6;
      default:
        throw new Error('Flash Duels only support durations of 1H and above');
    }
  }

  // For Coin Duels, allow all durations
  switch (duration.toUpperCase()) {
    case '5M':
      return 0;
    case '15M':
      return 1;
    case '30M':
      return 2;
    case '1H':
      return 3;
    case '3H':
      return 4;
    case '6H':
      return 5;
    case '12H':
      return 6;
    default:
      throw new Error('Invalid duration');
  }
};
