import * as React from 'react';
interface OrderItemProps {
  price: string;
  amount: string;
  type: string;
  onBuy: () => void;
}

export const OrderItem: React.FC<OrderItemProps> = ({ price, amount, type, onBuy }) => {
  return (
    <div className="flex pr-3 w-full">
      <div className="flex gap-2.5 items-start py-1 pl-3.5 h-full whitespace-nowrap text-stone-200 w-[97px]">
        <div className="flex gap-2 items-start w-[139px]">
          <div className="flex flex-col w-[139px]">
            <div className="gap-1 self-stretch w-full text-ellipsis">
              {Number(price).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`flex flex-1 shrink gap-2.5 items-start py-1 h-full ${
          type === 'YES' ? 'text-lime-300' : 'text-red-500'
        } basis-10`}
      >
        <div className="flex gap-2 items-start w-[139px]">
          <div className="flex flex-col flex-1 shrink w-full basis-0">
            <div className="flex-1 shrink gap-1 self-stretch w-full text-ellipsis">
              {Number(amount).toFixed(2)} {type}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={onBuy}
        className="gap-2.5 self-stretch px-5 py-1 my-auto text-xs font-bold tracking-normal leading-relaxed whitespace-nowrap rounded-lg border border-solid bg-white bg-opacity-0 border-zinc-700 min-h-[24px] text-zinc-700"
        aria-label={`Buy ${amount} ${type} at ${price}`}
      >
        BUY
      </button>
    </div>
  );
};
