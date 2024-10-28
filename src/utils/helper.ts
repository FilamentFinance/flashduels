export const shortenAddress = (address: string) => {
    return address ? `${address.slice(0, 15)}...${address.slice(-4)}` : '';
};

export const copyToClipboard = (address: string) => {
    if (address) {
        return navigator.clipboard.writeText(address)
            .then(() => {
                return true;
            })
            .catch(err => {
                console.error("Failed to copy: ", err);
                return false; 
            });
    }
    return false; 
};

export enum DuelCategory {
    Any,
    // Crypto,
    Politics,
    Sports,
    Twitter,
    NFTs,
    News
  }
  
export const mapCategoryToEnum = (category: string): DuelCategory => {
    switch (category.toLowerCase()) {
      // case "crypto":
      //   return DuelCategory.Crypto;
      case "politics":
        return DuelCategory.Politics;
      case "sports":
        return DuelCategory.Sports;
      case "twitter":
        return DuelCategory.Twitter;
      case "nfts":
        return DuelCategory.NFTs;
      case "news":
        return DuelCategory.News;
      default:
        return DuelCategory.Any;
    }
  };

  export const mapCategoryToEnumIndex = (category: string): number => {
    switch (category.toLowerCase()) {
      case "crypto":
        return 1;
      case "politics":
        return 2;
      case "sports":
        return 3;
      case "twitter":
        return 4;
      case "nfts":
        return 5;
      case "news":
        return 6;
      default:
        return 0;
    }
  };
  
 export const mapDurationToNumber = (duration: string): number => {
    switch (duration.toUpperCase()) {
      case "3H":
        return 0;
      case "6H":
        return 1;
      case "12H":
        return 2;
      default:
        throw new Error("Invalid duration");
    }
  };


  export const priceIds = [
    {"BTC": "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43"},
    {"ETH": "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace"},
  ];