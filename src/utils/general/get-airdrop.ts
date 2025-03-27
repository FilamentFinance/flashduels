import { baseApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';

export const getAirdrop = async (address: string) => {
  try {
    const response = await baseApiClient.post(
      `${SERVER_CONFIG.API_URL}/user/airdrop`,
      {
        account: address.toLowerCase(),
        address: address.toLowerCase(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching airdrop:', error);
    throw error;
  }
};
