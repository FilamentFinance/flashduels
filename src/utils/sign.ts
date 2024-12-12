import axios from "axios";
import { ethers } from "ethers";

export const handleOrderSignature = async (
  orderId: string,
  disconnect: () => void,
  address: string,
  setEstablishConnection: (value: boolean) => void
) => {
  const result = await isSigningKeyValid(disconnect, address, setEstablishConnection);
  if (!result.type) {
    return;
  }
  const { signingKey } = await getSigner(address);
  const signer = new ethers.Wallet(signingKey as string);

  const orderSignature = await signer.signMessage(orderId);
   return orderSignature;
};

export const isSigningKeyValid = async (
  disconnect: () => void,
  address: string,
  setEstablishConnection: (value: boolean) => void
) => {
  // console.log(address, "address-sign", localStorage.getItem(`signingKey_${address?.toLowerCase()}`))
  const signingKey = localStorage.getItem(`signingKey_${address?.toLowerCase()}`);
  const expiry = localStorage.getItem(`signingKeyExpiry_${address?.toLowerCase()}`);
  if (!signingKey || !expiry) {
    localStorage.removeItem(`signingKey_${address?.toLowerCase()}`);
    localStorage.removeItem(`signingKeyExpiry_${address?.toLowerCase()}`);
    localStorage.removeItem(`Bearer_${address?.toLowerCase()}`);
    // disconnect();
    setEstablishConnection(true);
    return {statement: false, type: false};
  }

  const now = new Date().getTime();
  const expiryTime = parseInt(expiry);
  if (now >= expiryTime) {
    localStorage.removeItem(`signingKey_${address?.toLowerCase()}`);
    localStorage.removeItem(`signingKeyExpiry_${address?.toLowerCase()}`);
    localStorage.removeItem(`Bearer_${address?.toLowerCase()}`);
    // disconnect();
    setEstablishConnection(true);
    return {statement: true, type: false};
  }

   return {statement: true, type: true};
};

// const checkWhitelistStatus = async (address: string) => {
//   try {
//     const response = await axios.post('/api/whitelistAddress', { address });
//     return response.data.isWhitelisted;
//   } catch (error) {
//     console.error('Error checking whitelist status:', error);
//     return false; 
//   }
// };

export const generateAndStorePrivateKey = async (address: string) => {
  const wallet = ethers.Wallet.createRandom();
  const privateKey = wallet.privateKey;

  // const isWhitelisted = await checkWhitelistStatus(address);

  const now = new Date().getTime();
  const expiryDuration =  7 * 24 * 60 * 60 * 1000;
  const expiry = (now + expiryDuration).toString();

  return { privateKey, expiry };
};

export const getSigner = async (address?: string) => {
  const signingKey = localStorage.getItem(`signingKey_${address?.toLowerCase()}`);
  const signer = new ethers.Wallet(signingKey as string);
  const signerAddress = await signer.getAddress();
  return { signingKey, signerAddress };
};
