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
            DIAMOND: process.env.NEXT_PUBLIC_SEI_DIAMOND as string,
            FLASH_USDC: process.env.NEXT_PUBLIC_SEI_FLASH_USDC as string,
            CREDIT_CONTRACT: process.env.NEXT_PUBLIC_SEI_FLASH_CREDITS as string,
        },
        rpcUrl: process.env.NEXT_PUBLIC_SEI_RPC_URL as string,
    },
    [seiTestnet.id]: {
        chainId: seiTestnet.id,
        name: 'Sei Testnet',
        contracts: {
            DIAMOND: process.env.NEXT_PUBLIC_SEI_TESTNET_DIAMOND as string,
            FLASH_USDC: process.env.NEXT_PUBLIC_SEI_TESTNET_FLASH_USDC as string,
            CREDIT_CONTRACT: process.env.NEXT_PUBLIC_SEI_TESTNET_FLASH_CREDITS as string,
        },
        rpcUrl: process.env.NEXT_PUBLIC_SEI_TESTNET_RPC_URL as string,
    },
    [base.id]: {
        chainId: base.id,
        name: 'Base Mainnet',
        contracts: {
            DIAMOND: process.env.NEXT_PUBLIC_BASE_DIAMOND as string,
            FLASH_USDC: process.env.NEXT_PUBLIC_BASE_FLASH_USDC as string,
            CREDIT_CONTRACT: process.env.NEXT_PUBLIC_BASE_FLASH_CREDITS as string,
        },
        rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL as string,
    },
    // [baseSepolia.id]: {
    //     chainId: baseSepolia.id,
    //     name: 'Base Sepolia',
    //     contracts: {
    //         DIAMOND: process.env.NEXT_PUBLIC_BASE_SEPOLIA_DIAMOND as string,
    //         FLASH_USDC: process.env.NEXT_PUBLIC_BASE_SEPOLIA_FLASH_USDC as string,
    //         CREDIT_CONTRACT: process.env.NEXT_PUBLIC_BASE_SEPOLIA_FLASH_CREDITS as string,
    //     },
    //     rpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL as string,
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
    return config.contracts;
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