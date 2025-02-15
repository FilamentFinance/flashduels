export const truncateAddress = (address: string, charsToShow: number = 6): string => {
  if (address) {
    return `${address.slice(0, charsToShow)}...${address.slice(address.length - charsToShow)}`;
  }
  return '';
};
