// src/utils/helper.ts

export const shortenAddress = (address: string) => {
    return address ? `${address.slice(0, 15)}...${address.slice(-4)}` : '';
};

export const copyToClipboard = (address: string) => {
    if (address) {
        return navigator.clipboard.writeText(address)
            .then(() => {
                return true; // Return true on success
            })
            .catch(err => {
                console.error("Failed to copy: ", err);
                return false; // Return false on failure
            });
    }
    return false; // Return false if no address
};
