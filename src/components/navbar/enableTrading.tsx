/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Dialog } from '@/components/ui/custom-modal';
import { NAVBAR } from '@/constants/content/navbar';
import { Button } from '@/shadcn/components/ui/button';
import { Checkbox } from '@/shadcn/components/ui/checkbox';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { cn } from '@/shadcn/lib/utils';
import { generatePrivateKey } from '@/utils/auth/generatePrivateKey';
import { isUserAuthenticated, setupInterceptors } from '@/utils/auth/setupInterceptors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAuthData, clearAuth } from '@/store/slices/authSlice';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { privateKeyToAccount } from 'viem/accounts';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { SERVER_CONFIG } from '@/config/server-config';
import { RootState } from '@/store';
import { shallowEqual } from 'react-redux';
import { getAirdrop } from '@/utils/general/get-airdrop';
import { Sparkle } from 'lucide-react';
import { useNetworkConfig } from '@/hooks/useNetworkConfig';
import { useApiClient } from '@/config/api-client';

interface WalletError extends Error {
  code: number;
  message: string;
}

const EnableTrading: FC = () => {
  const [agreed, setAgreed] = useState(false);
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated,
    shallowEqual,
  );
  const { toast } = useToast();
  const { chainId, isChainSupported, switchToSupportedNetwork } = useNetworkConfig();
  const apiClient = useApiClient(chainId ?? 0); // Default to 0 if chainId is undefined

  // On wallet connect, verify JWT with backend
  useEffect(() => {
    if (address && chainId && isUserAuthenticated(address)) {
      apiClient
        .get(`/user/creator/status`, { params: { address: address.toLowerCase() } })
        .then((res) => {
          // If successful, set Redux auth state from localStorage
          const token = localStorage.getItem(`Bearer_${address.toLowerCase()}`);
          const signingKey = localStorage.getItem(`signingKey_${address.toLowerCase()}`);
          const signingKeyExpiry = localStorage.getItem(
            `signingKeyExpiry_${address.toLowerCase()}`,
          );
          if (token && signingKey && signingKeyExpiry) {
            dispatch(
              setAuthData({
                address: address.toLowerCase(),
                token,
                signingKey,
                signingKeyExpiry,
                isCreator: res.data.isCreator || false,
              }),
            );
            setupInterceptors(address, disconnect, () => dispatch(clearAuth()), chainId);
          }
        })
        .catch((err) => {
          // If 401/403, interceptor will clear auth and disconnect wallet
          console.log('Error enabling trading:', err);
        });
    }
  }, [address, chainId, apiClient, dispatch, disconnect]);

  const handleEnableTrading = async () => {
    if (!address) {
      toast({
        title: 'No wallet connected',
        description: 'Please connect a wallet to enable trading.',
        variant: 'destructive',
      });
      return;
    }

    if (!chainId) {
      toast({
        title: 'Network Error',
        description: 'Please connect to a supported network.',
        variant: 'destructive',
      });
      return;
    }

    if (!isChainSupported(chainId)) {
      await switchToSupportedNetwork();
      return;
    }

    // if (!agreed) {
    //   toast({
    //     title: 'Agreement Required',
    //     description: 'Please agree to the terms and conditions to continue.',
    //     variant: 'destructive',
    //   });
    //   return;
    // }

    setIsLoading(true);
    try {
      // Generate a new private key and expiry
      const { privateKey, expiry } = generatePrivateKey();

      // Create account from private key
      const account = privateKeyToAccount(privateKey);
      const publicKey = account.address.toLowerCase();

      // Get signature from user
      let signature;
      try {
        signature = await signMessageAsync({
          message: publicKey,
        });
      } catch (error: unknown) {
        // Type guard to check if error is WalletError
        const isWalletError = (err: unknown): err is WalletError => {
          return typeof (err as WalletError)?.code === 'number';
        };

        if (isWalletError(error) && error.code === 4001) {
          toast({
            title: 'Signature Required',
            description: 'Please sign the message to enable trading',
            variant: 'destructive',
          });
          return;
        }
        throw error;
      }

      if (signature) {
        // Store in localStorage
        localStorage.setItem(`signingKey_${address.toLowerCase()}`, privateKey);
        localStorage.setItem(`signingKeyExpiry_${address.toLowerCase()}`, expiry);

        // Make API call to backend
        const response = await fetch(`${SERVER_CONFIG.getApiUrl(chainId)}/user/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            account: address.toLowerCase(),
            signature,
            publicKey,
            expiry,
          }),
        });

        const { result } = await response.json();
        localStorage.setItem(`Bearer_${address.toLowerCase()}`, result);

        // Update Redux store
        dispatch(
          setAuthData({
            address: address.toLowerCase(),
            token: result,
            signingKey: privateKey,
            signingKeyExpiry: expiry,
          }),
        );

        // Setup interceptors
        await setupInterceptors(
          address.toLowerCase(),
          disconnect,
          () => dispatch(clearAuth()),
          chainId,
        );

        // Call getAirdrop function
        if (chainId) {
          try {
            console.log('airdrop ');
            const airdropData = await getAirdrop(address, chainId, apiClient);
            console.log('Airdrop data:', airdropData);
          } catch (error) {
            console.error('Error getting airdrop:', error);
          }
        }

        toast({
          title: 'Success',
          description: 'Trading enabled successfully',
        });

        // Refresh the page after a short delay to ensure all states are updated
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Error enabling trading:', error);
      toast({
        title: 'Error',
        description: 'Failed to enable trading. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything if user is already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <Dialog
      title={
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/logo/flash.svg"
            alt="Flash Duels Logo"
            width={48}
            height={48}
            className="mb-2"
          />
          <h2 className="text-xl font-semibold">Welcome to Flash Duels</h2>
        </div>
      }
      trigger={
        <Button
          className="font-semibold text-black bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 bg-[length:200%_100%] animate-gradient hover:animate-none shadow-[0_0_15px_rgba(241,158,210,0.5)] hover:shadow-[0_0_20px_rgba(241,158,210,0.7)] transition-all duration-300 relative group"
          disabled={isLoading}
        >
          <Sparkle className="absolute -top-2 -right-2 w-4 h-4 text-pink-300 animate-pulse" />
          {isLoading ? 'Enabling...' : NAVBAR.ENABLE_TRADING.BUTTON_TEXT}
        </Button>
      }
      maxWidth="max-w-xl"
    >
      <div className="grid gap-6">
        <div className="space-y-4">
          <div className="space-y-4 text-gray-300 text-sm">
            <h3 className="font-semibold text-white">Before you start, please know:</h3>
            <ul className="list-decimal list-inside space-y-2">
              <li>
                You maintain full control of your wallet&mdash;just be sure to back up your keys. We
                recommend starting with a test wallet to get comfortable.
              </li>
              <li>
                While FlashDuels has been audited, it&apos;s still in beta. Begin with a modest
                amount of ETH to cover network gas fees, and explore cautiously, knowing you can
                always step back. Currently, the application uses a mock &quot;CRD&quot;
                token&mdash;no real assets are involved.
              </li>
              <li>
                The interface may still have some quirks as we continue refining it. Please
                double-check your transactions and report any unusual behavior so we can improve the
                experience.
              </li>
            </ul>
          </div>
          {/* <div className="space-y-4">
            <h3 className="font-medium">By accessing Filament, you agree to the following:</h3> */}

          {/* <div className="space-y-4">
              <div>
                <h4 className="font-medium">Eligibility:</h4>
                <p className="text-sm text-gray-400">
                  You confirm that you are not a resident, citizen, or entity located in the United
                  States, United Kingdom, Mainland China, or any other restricted jurisdictions, and
                  you are not subject to sanctions.
                </p>
              </div>

              <div>
                <h4 className="font-medium">Risk Acknowledgment:</h4>
                <p className="text-sm text-gray-400">
                  You understand that trading digital assets and perpetual futures contracts is
                  highly risky and may result in the loss of your entire investment. You assume full
                  responsibility for any losses incurred.
                </p>
              </div>

              <div>
                <h4 className="font-medium">No Financial Advice:</h4>
                <p className="text-sm text-gray-400">
                  Filament does not provide financial, legal, or tax advice. All decisions are made
                  at your own risk.
                </p>
              </div>

              <div>
                <h4 className="font-medium">Acceptance of Terms:</h4>
                <p className="text-sm text-gray-400">
                  By proceeding, you acknowledge that you have read and agree to Filament&apos;s{' '}
                  <Link href="/terms" className="text-pink-400 hover:underline">
                    Terms of Use
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-pink-400 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div> */}
          {/* </div> */}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {/* I agree to the terms and conditions */}I agree to enable trading
            </label>
          </div>
        </div>

        <Button
          onClick={handleEnableTrading}
          disabled={!agreed || isLoading}
          className={cn(
            'w-full text-black font-medium',
            agreed ? 'bg-gradient-pink' : 'bg-gray-600 cursor-not-allowed',
          )}
        >
          {isLoading ? 'Enabling Trading...' : 'Agree'}
        </Button>
      </div>
    </Dialog>
  );
};

export default EnableTrading;
