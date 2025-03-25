/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/shadcn/components/ui/button';
import axios from 'axios';
import { FC, useState } from 'react';
import { useAccount } from 'wagmi';

const GAS_API_URL = 'https://orderbookv3.filament.finance/gastank';

const GetGas: FC = () => {
  const { address } = useAccount();
  const [gasClaimed, setGasClaimed] = useState(false);

  const getGas = async () => {
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
    }
  };

  return (
    <Button
      className="font-semibold bg-gradient-pink text-black"
      onClick={getGas}
    >
      Get Gas
    </Button>
  );
};

export default GetGas;