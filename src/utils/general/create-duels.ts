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

export const mapDurationToNumber = (duration: string): number => {
  switch (duration.toUpperCase()) {
    case '3H':
      return 0;
    case '6H':
      return 1;
    case '12H':
      return 2;
    default:
      throw new Error('Invalid duration');
  }
};
