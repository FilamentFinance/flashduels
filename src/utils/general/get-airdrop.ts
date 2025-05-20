import { SERVER_CONFIG } from '@/config/server-config';
import { AxiosInstance } from 'axios';

export const getAirdrop = async (address: string, chainId: number, apiClient: AxiosInstance) => {
  try {
    const response = await apiClient.post(
      `${SERVER_CONFIG.getApiUrl(chainId)}/user/airdrop`,
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
