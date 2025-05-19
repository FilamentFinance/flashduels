'use client';

import { useCallback, useEffect, useState } from 'react';
import { useChainId, useAccount } from 'wagmi';
import { base, sei, seiTestnet } from 'viem/chains';
import { getChainName, isChainSupported } from '@/config/contract-config';
import { useToast } from '@/shadcn/components/ui/use-toast';

// declare global {
//     interface Window {
//         ethereum?: {
//             isMetaMask?: boolean;
//             request: (args: { method: string; params?: any[] }) => Promise<any>;
//             on: (event: string, callback: (args: any) => void) => void;
//             removeListener: (event: string, callback: (args: any) => void) => void;
//         };
//     }
// }

export const useNetworkConfig = () => {
    const wagmiChainId = useChainId();
    // const { switchChain } = useSwitchChain();
    const { isConnected } = useAccount();
    const { toast } = useToast();
    const [currentChainId, setCurrentChainId] = useState<number | undefined>(wagmiChainId);

    // Function to handle chain ID changes
    const handleChainIdChange = useCallback((newChainId: string | number) => {
        // console.log('handleChainIdChange called with:', newChainId);
        let chainIdNumber: number;

        if (typeof newChainId === 'string') {
            if (newChainId.startsWith('0x')) {
                chainIdNumber = parseInt(newChainId, 16);
            } else {
                chainIdNumber = parseInt(newChainId);
            }
        } else {
            chainIdNumber = newChainId;
        }

        // console.log('Setting currentChainId to:', chainIdNumber);
        setCurrentChainId(chainIdNumber);
    }, []);

    // Set up MetaMask chain change detection
    useEffect(() => {
        if (typeof window === 'undefined' || !window.ethereum) return;

        // console.log('Setting up MetaMask chain change detection');

        // Function to get current chain ID
        const getCurrentChainId = async () => {
            try {
                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                // console.log('Current chain ID from MetaMask:', chainId);
                handleChainIdChange(chainId);
            } catch (error) {
                console.error('Error getting chain ID:', error);
            }
        };

        // Handle MetaMask chain changes
        const handleChainChanged = (newChainId: string) => {
            // console.log('MetaMask chainChanged event:', newChainId);
            handleChainIdChange(newChainId);
        };

        // Set up event listener
        window.ethereum.on('chainChanged', handleChainChanged);

        // Get initial chain ID
        getCurrentChainId();

        // Set up polling for unsupported networks
        const pollInterval = setInterval(() => {
            if (isConnected) {
                getCurrentChainId();
            }
        }, 1000);

        return () => {
            window.ethereum.removeListener('chainChanged', handleChainChanged);
            clearInterval(pollInterval);
        };
    }, [isConnected, handleChainIdChange]);

    // Only update from wagmi if it's a supported network
    useEffect(() => {
        if (wagmiChainId) {
            // console.log('Wagmi chainId changed:', {
            //     chainId: wagmiChainId,
            //     chainName: getChainName(wagmiChainId),
            //     isSupported: isChainSupported(wagmiChainId)
            // });
            handleChainIdChange(wagmiChainId);
        }
    }, [wagmiChainId, handleChainIdChange]);

    const switchToSupportedNetwork = useCallback(async (targetChainId?: number) => {
        try {
            if (typeof window === 'undefined' || !window.ethereum) {
                throw new Error('MetaMask not found');
            }

            const chainToSwitch = targetChainId || sei.id;
            const chainIdHex = `0x${chainToSwitch.toString(16)}`;

            try {
                // First try to switch to the chain
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: chainIdHex }],
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask
                if (switchError instanceof Error && 'code' in switchError && switchError.code === 4902) {
                    // Get the chain configuration
                    let chainConfig;
                    switch (chainToSwitch) {
                        case base.id:
                            chainConfig = base;
                            break;
                        // case baseSepolia.id:
                        //     chainConfig = baseSepolia;
                            break;
                        case sei.id:
                            chainConfig = sei;
                            break;
                        case seiTestnet.id:
                            chainConfig = seiTestnet;
                            break;
                        default:
                            throw new Error('Unsupported chain');
                    }

                    // Add the chain to MetaMask
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: chainIdHex,
                            chainName: chainConfig.name,
                            nativeCurrency: chainConfig.nativeCurrency,
                            rpcUrls: chainConfig.rpcUrls.default.http,
                            blockExplorerUrls: chainConfig.blockExplorers?.default.url ? [chainConfig.blockExplorers.default.url] : undefined
                        }],
                    });

                    // Try switching again after adding
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: chainIdHex }],
                    });
                } else {
                    throw switchError;
                }
            }
        } catch (error) {
            console.error('Failed to switch network:', error);
            toast({
                title: 'Network Switch Failed',
                description: 'Please try switching networks again.',
                variant: 'destructive',
                duration: 5000,
            });
        }
    }, [toast]);

    const checkChainSupport = useCallback((chainId: number | undefined) => {
        if (!chainId) {
            // console.log('No chain ID provided');
            return false;
        }
        const supported = isChainSupported(chainId);
        // console.log('Chain support check:', {
        //     chainId,
        //     supported,
        //     chainName: getChainName(chainId),
        //     supportedChains: getSupportedChainIds()
        // });
        return supported;
    }, []);

    const getSupportedNetworks = useCallback(() => {
        return [
            { id: sei.id, name: 'Sei Mainnet' },
            { id: seiTestnet.id, name: 'Sei Testnet' },
            { id: base.id, name: 'Base Mainnet' },
            // { id: baseSepolia.id, name: 'Base Sepolia' },
        ];
    }, []);

    const getCurrentNetworkName = useCallback(() => {
        if (!currentChainId) {
            // console.log('No chain ID for network name');
            return 'Not Connected';
        }
        try {
            const name = getChainName(currentChainId);
            // console.log('Getting network name:', name);
            return name;
        } catch (error) {
            console.error('Error getting network name:', error);
            console.log('Error getting network name, using chain ID:', currentChainId);
            return `Chain ID: ${currentChainId}`;
        }
    }, [currentChainId]);

    return {
        chainId: currentChainId,
        isChainSupported: checkChainSupport,
        getSupportedNetworks,
        switchToSupportedNetwork,
        getCurrentNetworkName,
    };
}; 