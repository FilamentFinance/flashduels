import { Button } from '@/shadcn/components/ui/button';
import { TableCell, TableRow } from '@/shadcn/components/ui/table';
import { cn } from '@/shadcn/lib/utils';
import * as React from 'react';

interface OrderItemProps {
  price: string;
  amount: string;
  type: 'YES' | 'NO';
  onBuy: () => void;
}

export const OrderItem: React.FC<OrderItemProps> = ({ price, amount, type, onBuy }) => {
  const formattedPrice = Number(price).toFixed(2);
  const formattedAmount = Number(amount).toFixed(2);

  return (
    <TableRow className="border-0 hover:bg-neutral-800/50">
      <TableCell className="py-2 px-4 font-medium text-stone-200">{formattedPrice}</TableCell>
      <TableCell
        className={cn('py-2 px-4 font-medium', type === 'YES' ? 'text-[#95DE64]' : 'text-red-500')}
      >
        {formattedAmount} {type}
      </TableCell>
      <TableCell className="py-2 px-4 text-right">
        <Button
          onClick={onBuy}
          variant="outline"
          size="sm"
          className="h-7 px-4 hover:bg-white/5 hover:text-white"
        >
          BUY
        </Button>
      </TableCell>
    </TableRow>
  );
};
