import {
  WAIT_TIME as RPC_BATCHING_WAIT_TIME,
  RETRY_DELAY as RPC_RETRY_DELAY,
} from '@/constants/app/clientProvider';
import { ERRORS } from '@/constants/error';
import { STATUS_CODES } from '@/constants/statusCodes';
import { AppError } from '@/utils/error';
import { wagmiChainsById } from '@/wagmi/chains';
import { type PublicClient, createPublicClient, fallback, http } from 'viem';

class ClientProvider {
  private static instance: ClientProvider | null = null;
  private publicClient: PublicClient | null = null;
  private currentChainId: number | null = null;

  private constructor() {
    // private constructor for singleton
  }

  public static getInstance(): ClientProvider {
    if (!ClientProvider.instance) {
      ClientProvider.instance = new ClientProvider();
    }
    return ClientProvider.instance;
  }

  public getPublicClient({
    rpcUrls,
    chainId,
  }: {
    rpcUrls: string[];
    chainId: number;
  }): PublicClient {
    if (!this.publicClient || chainId !== this.currentChainId) {
      try {
        this.currentChainId = chainId;
        this.publicClient = createPublicClient({
          chain: wagmiChainsById[chainId],
          transport: fallback(
            rpcUrls.map((rpc: string) =>
              http(rpc, {
                batch: { wait: RPC_BATCHING_WAIT_TIME },
                retryDelay: RPC_RETRY_DELAY,
              }),
            ),
          ),
        });
      } catch (error) {
        throw new AppError({
          statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
          type: ERRORS.PUBLIC_CLIENT_NOT_CREATED,
          message: `Failed to create public client for chain ${chainId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }
    return this.publicClient as PublicClient;
  }
}

export default ClientProvider;
