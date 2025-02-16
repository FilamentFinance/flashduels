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
          className={cn(
            'h-7 px-4 bg-transparent border border-neutral-700',
            'text-neutral-300 hover:text-white',
            'hover:bg-neutral-800 hover:border-neutral-600',
            'transition-colors duration-200',
            type === 'YES' ? 'hover:border-[#95DE64]/50' : 'hover:border-red-500/50',
          )}
        >
          BUY
        </Button>
      </TableCell>
    </TableRow>
  );
};
