import { useApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
import { useChainId } from 'wagmi';

export const getAirdrop = async (address: string) => {
  const chainId = useChainId();
  const apiClient = useApiClient(chainId);
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
