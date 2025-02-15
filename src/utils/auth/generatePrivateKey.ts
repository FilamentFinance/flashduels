import { generatePrivateKey as generateKey } from 'viem/accounts';

export const generatePrivateKey = () => {
  const privateKey = generateKey();

  // Calculate expiry (7 days from now)
  const now = new Date().getTime();
  const expiryDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  const expiry = (now + expiryDuration).toString();

  return { privateKey, expiry };
};
