/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/shadcn/components/ui/button';
import axios from 'axios';
import { FC, useState } from 'react';
import { useAccount } from 'wagmi';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shadcn/components/ui/tooltip";

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="font-semibold bg-gradient-pink text-black opacity-50 cursor-not-allowed"
            disabled={true}
          >
            Get Gas
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Will be available on Mainnet soon</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default GetGas;