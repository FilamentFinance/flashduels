/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/shadcn/components/ui/button';
import axios from 'axios';
import { FC, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
// import { SERVER_CONFIG } from '@/config/server-config';
import { sei, seiTestnet } from 'viem/chains';

// const GAS_API_URL = 'https://orderbookv3.filament.finance/gastank';
const GAS_API_URL = 'https://testnetserver.flashduels.xyz/gastank';

const GetGas: FC = () => {
  // Note - It will be enabled on mainnet soon

  const { address } = useAccount();
  const chainId = useChainId();
  const [gasClaimed, setGasClaimed] = useState(() => {
    // Check localStorage when component mounts
    return localStorage.getItem('gas_claimed') === 'true';
  });
  const [isLoading, setIsLoading] = useState(false);

  const getGas = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${GAS_API_URL}/api/transfer`, {
        address: address?.toLowerCase() ?? '',
        app: 'flash_duels',
      });
      setGasClaimed(true);
      localStorage.setItem('gas_claimed', 'true');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log('Error', error.message);
      if (error.message === 'Not Eligible') {
        localStorage.setItem('gas_claimed', 'true');
        setGasClaimed(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (chainId === sei.id) {
    return (
      <Button
        className="font-semibold text-pink-300 border border-pink-300 bg-transparent
        hover:shadow-lg hover:scale-[1.02] hover:bg-pink-300/10"
        onClick={getGas}
        disabled={gasClaimed || isLoading}
      >
        <span className="flex items-center gap-1">
          {gasClaimed ? (
            '0.02 SEI Claimed 🎉'
          ) : isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Claiming...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Get Gas
            </>
          )}
        </span>
      </Button>
    );
  } else if (chainId === seiTestnet.id) {
    return (
      <Button
        className="font-semibold text-pink-300 border border-pink-300 bg-transparent
        hover:shadow-lg hover:scale-[1.02] hover:bg-pink-300/10"
        onClick={getGas}
        disabled={gasClaimed || isLoading}
      >
        <span className="flex items-center gap-1">
          {gasClaimed ? (
            '0.02 SEI Claimed 🎉'
          ) : isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Claiming...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Get Gas
            </>
          )}
        </span>
      </Button>
    );
  } else {
    return (
      <Button
        className="font-semibold bg-gradient-pink text-black opacity-50 cursor-not-allowed
        border border-pink-300
        hover:shadow-lg hover:scale-[1.02]"
        title="Will be available on Mainnet soon"
      >
        <span className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Get Gas
        </span>
      </Button>
    );
  }
};

export default GetGas;
