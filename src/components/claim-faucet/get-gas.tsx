/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/shadcn/components/ui/button';
import axios from 'axios';
import { FC, useState } from 'react';
import { useAccount } from 'wagmi';

const GAS_API_URL = 'https://orderbookv3.filament.finance/gastank';

const GetGas: FC = () => {
  // Note - It will be enabled on mainnet soon

  // const { address } = useAccount();
  // const [gasClaimed, setGasClaimed] = useState(false);

  // const getGas = async () => {
  //   try {
  //     await axios.post(`${GAS_API_URL}/api/transfer`, {
  //       address: address?.toLowerCase() ?? '',
  //       app: 'flash_duels',
  //     });
  //     setGasClaimed(true);
  //     localStorage.setItem('gas_claimed', 'true');
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (error: any) {
  //     console.log('Error', error.message);
  //     if (error.message === 'Not Eligible') {
  //       localStorage.setItem('gas_claimed', 'true');
  //       setGasClaimed(true);
  //     }
  //   }
  // };

  // return (
  //   <Button
  //     className="font-semibold bg-gradient-pink text-black"
  //     onClick={getGas}
  //   >
  //     Get Gas
  //   </Button>
  // );

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
};

export default GetGas;
