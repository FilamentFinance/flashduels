import { base, sei, seiTestnet } from 'viem/chains';

interface ContractAddresses {
    DIAMOND: string;
    FLASH_USDC: string;
    CREDIT_CONTRACT: string;
}

interface ChainConfig {
    chainId: number;
    name: string;
    contracts: ContractAddresses;
    rpcUrl: string;
}

// Contract addresses for each chain
const chainConfigs: Record<number, ChainConfig> = {
    [sei.id]: {
        chainId: sei.id,
        name: 'Sei Mainnet',
        contracts: {
            DIAMOND: process.env.NEXT_PUBLIC_DIAMOND_SEI as string,
            FLASH_USDC: process.env.NEXT_PUBLIC_FLASH_USDC_SEI as string,
            CREDIT_CONTRACT: process.env.NEXT_PUBLIC_FLASH_CREDITS_SEI as string,
        },
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_SEI as string,
    },
    [seiTestnet.id]: {
        chainId: seiTestnet.id,
        name: 'Sei Testnet',
        contracts: {
            DIAMOND: process.env.NEXT_PUBLIC_DIAMOND_SEI_TESTNET as string,
            FLASH_USDC: process.env.NEXT_PUBLIC_FLASH_USDC_SEI_TESTNET as string,
            CREDIT_CONTRACT: process.env.NEXT_PUBLIC_FLASH_CREDITS_SEI_TESTNET as string,
        },
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_SEI_TESTNET as string,
    },
    [base.id]: {
        chainId: base.id,
        name: 'Base Mainnet',
        contracts: {
            DIAMOND: process.env.NEXT_PUBLIC_DIAMOND_BASE as string,
            FLASH_USDC: process.env.NEXT_PUBLIC_FLASH_USDC_BASE as string,
            CREDIT_CONTRACT: process.env.NEXT_PUBLIC_FLASH_CREDITS_BASE as string,
        },
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_BASE as string,
    },
    // [baseSepolia.id]: {
    //     chainId: baseSepolia.id,
    //     name: 'Base Sepolia',
    //     contracts: {
    //         DIAMOND: process.env.NEXT_PUBLIC_DIAMOND_BASE_SEPOLIA as string,
    //         FLASH_USDC: process.env.NEXT_PUBLIC_FLASH_USDC_BASE_SEPOLIA as string,
    //         CREDIT_CONTRACT: process.env.NEXT_PUBLIC_FLASH_CREDITS_BASE_SEPOLIA as string,
    //     },
    //     rpcUrl: process.env.NEXT_PUBLIC_RPC_URL_BASE_SEPOLIA as string,
    // },
};

/**
 * Get contract addresses for a specific chain
 * @param chainId - The chain ID to get contracts for
 * @returns Contract addresses for the specified chain
 */
export const getContractAddresses = (chainId: number): ContractAddresses => {
    const config = chainConfigs[chainId];
    if (!config) {
        throw new Error(`No contract configuration found for chain ID: ${chainId}`);
    }
    const contracts = config.contracts;
    // Validate fallback contracts
    const missingContracts = [];
    if (!contracts.DIAMOND) missingContracts.push('NEXT_PUBLIC_DIAMOND');
    if (!contracts.FLASH_USDC) missingContracts.push('NEXT_PUBLIC_FLASH_USDC');
    if (!contracts.CREDIT_CONTRACT) missingContracts.push('NEXT_PUBLIC_FLASH_CREDITS');

    if (missingContracts.length > 0) {
      throw new Error(`Missing required contract addresses: ${missingContracts.join(', ')}`);
    }
    return contracts;
};

/**
 * Get RPC URL for a specific chain
 * @param chainId - The chain ID to get RPC URL for
 * @returns RPC URL for the specified chain
 */
export const getRpcUrl = (chainId: number): string => {
    const config = chainConfigs[chainId];
    if (!config) {
        throw new Error(`No RPC URL found for chain ID: ${chainId}`);
    }
    return config.rpcUrl;
};

/**
 * Get chain name for a specific chain ID
 * @param chainId - The chain ID to get name for
 * @returns Chain name for the specified chain ID
 */
export const getChainName = (chainId: number): string => {
    console.log('Getting name for chain ID:', chainId);
    const config = chainConfigs[chainId];
    if (!config) {
        return 'Unsupported Network';
    }
    return config.name;
};

/**
 * Get all supported chain IDs
 * @returns Array of supported chain IDs
 */
export const getSupportedChainIds = (): number[] => {
    return Object.keys(chainConfigs).map(Number);
};

/**
 * Check if a chain ID is supported
 * @param chainId - The chain ID to check
 * @returns boolean indicating if the chain is supported
 */
export const isChainSupported = (chainId: number): boolean => {
    return chainId in chainConfigs;
};

export default chainConfigs; 