import { sei, seiTestnet } from 'viem/chains';
import { getPublicClient } from '@/utils/client';
import { SERVER_CONFIG } from './server-config';

const SEI_RPC_URLS = ['https://evm-rpc.sei-apis.com/', 'https://sei-rpc.publicnode.com'];

const SEI_TESTNET_RPC_URLS = [
  'https://wispy-thrumming-glade.sei-atlantic.quiknode.pro/deca7db932297f7feebd6fb28da49ff1bc63abc0/',
  'https://sei-testnet-rpc.publicnode.com',
];

export const publicClient = getPublicClient({
  chainId: SERVER_CONFIG.PRODUCTION === 'true' ? sei.id : seiTestnet.id,
  rpcUrls: SERVER_CONFIG.PRODUCTION === 'true' ? SEI_RPC_URLS : SEI_TESTNET_RPC_URLS,
});
