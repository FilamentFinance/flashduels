import { getContractAddresses, getRpcUrl } from './contract-config';

interface ServerConfig {
  PRODUCTION: boolean;
  getRpcUrl: (chainId: number) => string;
  API_URL: string;
  API_WS_URL: string;
  TIMER_BOT_URL: string;
  INVITE_ONLY_URL: string;
  WALLET_CONNECT_PROJECT_ID: string;
  BOT_PRIVATE_KEY: string;
  DEFAULT_TOKEN_SYMBOL?: string;
  getContractAddresses: (chainId: number) => {
    DIAMOND: string;
    FLASH_USDC: string;
    CREDIT_CONTRACT: string;
  };
}

const createConfig = (): ServerConfig => {
  const production = process.env.NEXT_PUBLIC_PRODUCTION === 'true';

  // API URLs - use local URLs in development
  const apiUrl = production
    ? process.env.NEXT_PUBLIC_API_PRODUCTION as string
    : process.env.NEXT_PUBLIC_API as string;
  const apiWsUrl = production
    ? process.env.NEXT_PUBLIC_API_WS_PRODUCTION as string
    : process.env.NEXT_PUBLIC_API_WS as string;
  const timerBotUrl = production
    ? process.env.NEXT_PUBLIC_TIMER_BOT_URL_PRODUCTION as string
    : process.env.NEXT_PUBLIC_TIMER_BOT_URL as string;
  const inviteOnlyUrl = production
    ? process.env.NEXT_PUBLIC_INVITE_ONLY_PRODUCTION_URL as string
    : process.env.NEXT_PUBLIC_INVITE_ONLY_LOCAL_URL as string;

  // Required in both environments
  const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;
  const botPrivateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY as string;
  const defaultTokenSymbol = process.env.NEXT_PUBLIC_DEFAULT_TOKEN_SYMBOL;

  // Validate required environment variables
  const missingVars = [];
  if (production) {
    if (!process.env.NEXT_PUBLIC_API_PRODUCTION) missingVars.push('NEXT_PUBLIC_API_PRODUCTION');
    if (!process.env.NEXT_PUBLIC_API_WS_PRODUCTION) missingVars.push('NEXT_PUBLIC_API_WS_PRODUCTION');
    if (!process.env.NEXT_PUBLIC_TIMER_BOT_URL_PRODUCTION) missingVars.push('NEXT_PUBLIC_TIMER_BOT_URL_PRODUCTION');
    if (!process.env.NEXT_PUBLIC_INVITE_ONLY_PRODUCTION_URL) missingVars.push('NEXT_PUBLIC_INVITE_ONLY_PRODUCTION_URL');
  } else {
    if (!process.env.NEXT_PUBLIC_API) missingVars.push('NEXT_PUBLIC_API');
    if (!process.env.NEXT_PUBLIC_API_WS) missingVars.push('NEXT_PUBLIC_API_WS');
    if (!process.env.NEXT_PUBLIC_TIMER_BOT_URL) missingVars.push('NEXT_PUBLIC_TIMER_BOT_URL');
    if (!process.env.NEXT_PUBLIC_INVITE_ONLY_LOCAL_URL) missingVars.push('NEXT_PUBLIC_INVITE_ONLY_LOCAL_URL');
  }

  // Validate fallback RPC URL
  if (!process.env.NEXT_PUBLIC_RPC_URL) missingVars.push('NEXT_PUBLIC_RPC_URL');
  if (!walletConnectProjectId) missingVars.push('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID');
  if (!botPrivateKey) missingVars.push('NEXT_PUBLIC_PRIVATE_KEY');
  if (!defaultTokenSymbol) missingVars.push('NEXT_PUBLIC_DEFAULT_TOKEN_SYMBOL');

  // Validate fallback contract addresses
  const fallbackContracts = {
    DIAMOND: process.env.NEXT_PUBLIC_DIAMOND,
    FLASH_USDC: process.env.NEXT_PUBLIC_FLASH_USDC,
    CREDIT_CONTRACT: process.env.NEXT_PUBLIC_FLASH_CREDITS,
  };

  if (!fallbackContracts.DIAMOND) missingVars.push('NEXT_PUBLIC_DIAMOND');
  if (!fallbackContracts.FLASH_USDC) missingVars.push('NEXT_PUBLIC_FLASH_USDC');
  if (!fallbackContracts.CREDIT_CONTRACT) missingVars.push('NEXT_PUBLIC_FLASH_CREDITS');

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }


  // Function to get RPC URL based on chain ID
  const getRpcUrlForChain = (chainId: number) => {
    // First try to get from contract-config
    try {
      return getRpcUrl(chainId);
    } catch (error) {
      console.error('Error getting RPC URL for chain:', error);
      // Fallback to environment variable if chain not found in contract-config
      return process.env.NEXT_PUBLIC_RPC_URL as string;
    }
  };

  // Function to get contract addresses based on chain ID
  const getContractAddressesForChain = (chainId: number) => {
    // First try to get from contract-config
    try {
      return getContractAddresses(chainId);
    } catch (error) {
      // Fallback to environment variables if chain not found in contract-config
      console.error('Error getting contract addresses for chain:', error);
      return {
        DIAMOND: process.env.NEXT_PUBLIC_DIAMOND as string,
        FLASH_USDC: process.env.NEXT_PUBLIC_FLASH_USDC as string,
        CREDIT_CONTRACT: process.env.NEXT_PUBLIC_FLASH_CREDITS as string,
      };
    }
  };

  return {
    PRODUCTION: production,
    getRpcUrl: getRpcUrlForChain,
    API_URL: apiUrl,
    API_WS_URL: apiWsUrl,
    TIMER_BOT_URL: timerBotUrl,
    INVITE_ONLY_URL: inviteOnlyUrl,
    WALLET_CONNECT_PROJECT_ID: walletConnectProjectId,
    BOT_PRIVATE_KEY: botPrivateKey,
    DEFAULT_TOKEN_SYMBOL: defaultTokenSymbol,
    getContractAddresses: getContractAddressesForChain,
  };
};

export const SERVER_CONFIG = createConfig();
