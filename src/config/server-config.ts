import { getContractAddresses, getRpcUrl, getChainName } from './contract-config';
import { base, baseSepolia, sei, seiTestnet } from 'viem/chains';

interface ServerConfig {
  PRODUCTION: boolean;
  WALLET_CONNECT_PROJECT_ID: string;
  DEFAULT_TOKEN_SYMBOL?: string;
  getRpcUrl: (chainId: number) => string;
  getApiUrl: (chainId: number) => string;
  getApiWsUrl: (chainId: number) => string;
  getTimerBotUrl: (chainId: number) => string;
  getInviteOnlyUrl: (chainId: number) => string;
  getBotPrivateKey: (chainId: number) => string;
  getContractAddresses: (chainId: number) => {
    DIAMOND: string;
    FLASH_USDC: string;
    CREDIT_CONTRACT: string;
  };
  getChainName: (chainId: number) => string;
}

const createConfig = (): ServerConfig => {
  const production = process.env.NEXT_PUBLIC_PRODUCTION === 'true';
  // Required in both environments
  const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;
  const defaultTokenSymbol = process.env.NEXT_PUBLIC_DEFAULT_TOKEN_SYMBOL;

  // Validate required environment variables
  const missingVars = [];
  if (!walletConnectProjectId) missingVars.push('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID');
  if (!defaultTokenSymbol) missingVars.push('NEXT_PUBLIC_DEFAULT_TOKEN_SYMBOL');

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Function to get chain-specific API URL
  const getApiUrl = (chainId: number): string => {
    let url = '';
    if (production) {
      // Production environment
      switch (chainId) {
        case sei.id:
          url = process.env["NEXT_PUBLIC_API_SEI"] || '';
          break;
        case seiTestnet.id:
          url = process.env["NEXT_PUBLIC_API_SEI_TESTNET"] || '';
          break;
        case base.id:
          url = process.env["NEXT_PUBLIC_API_BASE"] || '';
          break;
        case baseSepolia.id:
          url = process.env["NEXT_PUBLIC_API_BASE_SEPOLIA"] || '';
          break;
        default:
          url = process.env["NEXT_PUBLIC_API_BASE"] || '';
      }
    } else {
      // Development environment
      url = process.env["NEXT_PUBLIC_API"] || '';
    }
    if (!url) {
      throw new Error(`Missing API URL for chain ${chainId}`);
    }
    return url;
  };

  // Function to get chain-specific WebSocket URL
  const getApiWsUrl = (chainId: number): string => {
    let url = '';
    if (production) {
      // Production environment
      switch (chainId) {
        case sei.id:
          url = process.env["NEXT_PUBLIC_API_WS_SEI"] || '';
          break;
        case seiTestnet.id:
          url = process.env["NEXT_PUBLIC_API_WS_SEI_TESTNET"] || '';
          break;
        case base.id:
          url = process.env["NEXT_PUBLIC_API_WS_BASE"] || '';
          break;
        case baseSepolia.id:
          url = process.env["NEXT_PUBLIC_API_WS_BASE_SEPOLIA"] || '';
          break;
        default:
          url = process.env["NEXT_PUBLIC_API_WS_BASE"] || '';
      }
    } else {
      // Development environment
      url = process.env["NEXT_PUBLIC_API_WS"] || '';
    }
    if (!url) {
      throw new Error(`Missing WebSocket URL for chain ${chainId}`);
    }
    return url;
  };

  // Function to get chain-specific Timer Bot URL
  const getTimerBotUrl = (chainId: number): string => {
    let url = '';
    if (production) {
      // Production environment
      switch (chainId) {
        case sei.id:
          url = process.env["NEXT_PUBLIC_TIMER_BOT_URL_SEI"] || '';
          break;
        case seiTestnet.id:
          url = process.env["NEXT_PUBLIC_TIMER_BOT_URL_SEI_TESTNET"] || '';
          break;
        case base.id:
          url = process.env["NEXT_PUBLIC_TIMER_BOT_URL_BASE"] || '';
          break;
        case baseSepolia.id:
          url = process.env["NEXT_PUBLIC_TIMER_BOT_URL_BASE_SEPOLIA"] || '';
          break;
        default:
          url = process.env["NEXT_PUBLIC_TIMER_BOT_URL_BASE"] || '';
      }
    } else {
      // Development environment
      url = process.env["NEXT_PUBLIC_TIMER_BOT_URL"] || '';
    }
    if (!url) {
      throw new Error(`Missing Timer Bot URL for chain ${chainId}`);
    }
    return url;
  };

  // Function to get chain-specific Invite Only URL
  const getInviteOnlyUrl = (chainId: number): string => {
    let url = '';
    if (production) {
      // Production environment
      switch (chainId) {
        case sei.id:
          url = process.env["NEXT_PUBLIC_INVITE_ONLY_URL_SEI"] || '';
          break;
        case seiTestnet.id:
          url = process.env["NEXT_PUBLIC_INVITE_ONLY_URL_SEI_TESTNET"] || '';
          break;
        case base.id:
          url = process.env["NEXT_PUBLIC_INVITE_ONLY_URL_BASE"] || '';
          break;
        case baseSepolia.id:
          url = process.env["NEXT_PUBLIC_INVITE_ONLY_URL_BASE_SEPOLIA"] || '';
          break;
        default:
          url = process.env["NEXT_PUBLIC_INVITE_ONLY_URL_BASE"] || '';
      }
    } else {
      // Development environment
      url = process.env["NEXT_PUBLIC_INVITE_ONLY_URL"] || '';
    }
    if (!url) {
      throw new Error(`Missing Invite Only URL for chain ${chainId}`);
    }
    return url;
  };

  // Function to get chain-specific Bot Private Key
  const getBotPrivateKey = (chainId: number): string => {
    let key = '';
    if (production) {
      // Production environment
      switch (chainId) {
        case sei.id:
          key = process.env["NEXT_PUBLIC_BOT_PRIVATE_KEY_SEI"] || '';
          break;
        case seiTestnet.id:
          key = process.env["NEXT_PUBLIC_BOT_PRIVATE_KEY_SEI_TESTNET"] || '';
          break;
        case base.id:
          key = process.env["NEXT_PUBLIC_BOT_PRIVATE_KEY_BASE"] || '';
          break;
        case baseSepolia.id:
          key = process.env["NEXT_PUBLIC_BOT_PRIVATE_KEY_BASE_SEPOLIA"] || '';
          break;
        default:
          key = process.env["NEXT_PUBLIC_BOT_PRIVATE_KEY_BASE"] || '';
      }
    } else {
      // Development environment
      switch (chainId) {
        case seiTestnet.id:
          key = process.env["NEXT_PUBLIC_BOT_PRIVATE_KEY_LOCAL_SEI_TESTNET"] || '';
          break;
        case baseSepolia.id:
          key = process.env["NEXT_PUBLIC_BOT_PRIVATE_KEY_LOCAL_BASE_SEPOLIA"] || '';
          break;
        default:
          key = process.env["NEXT_PUBLIC_BOT_PRIVATE_KEY_LOCAL_BASE_SEPOLIA"] || '';
      }
    }
    if (!key) {
      throw new Error(`Missing Bot Private Key for chain ${chainId}`);
    }
    return key;
  };

  // // Function to get environment-specific URL based on chain ID
  // const getEnvUrl = (chainId: number, prodKey: string, devKey: string): string => {
  //   if (production) {
  //     // Production environment
  //     switch (chainId) {
  //       case sei.id:
  //         return process.env[`${prodKey}_SEI`] || process.env[prodKey] || '';
  //       case seiTestnet.id:
  //         return process.env[`${prodKey}_SEI_TESTNET`] || process.env[prodKey] || '';
  //       case base.id:
  //         return process.env[`${prodKey}_BASE`] || process.env[prodKey] || '';
  //       default:
  //         return process.env[prodKey] || '';
  //     }
  //   } else {
  //     // Development environment
  //     switch (chainId) {
  //       case sei.id:
  //         return process.env[`${devKey}_SEI`] || process.env[devKey] || '';
  //       case seiTestnet.id:
  //         return process.env[`${devKey}_SEI_TESTNET`] || process.env[devKey] || '';
  //       case base.id:
  //         return process.env[`${devKey}_BASE`] || process.env[devKey] || '';
  //       default:
  //         return process.env[devKey] || '';
  //     }
  //   }
  // };


  return {
    PRODUCTION: production,
    WALLET_CONNECT_PROJECT_ID: walletConnectProjectId,
    DEFAULT_TOKEN_SYMBOL: defaultTokenSymbol,
    getRpcUrl,
    getApiUrl,
    getApiWsUrl,
    getTimerBotUrl,
    getInviteOnlyUrl,
    getBotPrivateKey,
    getContractAddresses,
    getChainName,
  };
};

export const SERVER_CONFIG = createConfig();
