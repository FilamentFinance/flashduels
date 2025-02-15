import { OptionBetType } from '@/types/dual';
import { FC } from 'react';
import { OrderItem } from './OrderItem';

type Props = {
  yesBets: OptionBetType[];
  noBets: OptionBetType[];
  handleBuyOrders: (
    betOptionMarketId: string,
    quantity: string,
    index: number,
    sellId: number,
    amount: string,
  ) => void;
};
const OrderBook: FC<Props> = ({ yesBets, noBets, handleBuyOrders }) => {
  return (
    <div className="flex overflow-hidden flex-wrap items-start py-1 mt-7 text-base tracking-normal rounded-xl border-2 border-solid bg-neutral-900 border-stone-900">
      {/* Yes orders */}
      {yesBets.length === 0 && noBets.length === 0 ? (
        <span className="text-white flex items-center justify-center h-[441px] w-full">
          No Open Orders
        </span>
      ) : (
        <>
          <div className="flex flex-col flex-1 self-stretch mt-2">
            <div className="flex items-center w-full whitespace-nowrap text-stone-200">
              <div className="flex gap-2.5 items-start self-stretch py-2 pl-3.5 my-auto border-b-2 border-stone-900 w-[97px]">
                <div className="flex gap-2 items-start w-[139px]">
                  <div className="flex flex-col w-[139px]">
                    <div className="gap-1 self-stretch w-full text-ellipsis">Price</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 shrink gap-2.5 items-start self-stretch py-2 my-auto border-b-2 basis-[13px] border-stone-900 min-w-[240px]">
                <div className="flex gap-2 items-start w-[139px]">
                  <div className="flex flex-col flex-1 shrink w-full basis-0">
                    <div className="flex-1 shrink gap-1 self-stretch w-full text-ellipsis">
                      Quantity
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col mt-1.5 w-full h-[388px]">
              {yesBets.map((order: OptionBetType, index: number) => (
                <OrderItem
                  key={index}
                  price={order.price}
                  amount={order.quantity}
                  type={'YES'}
                  onBuy={() =>
                    handleBuyOrders(
                      order.id,
                      order.quantity,
                      order.betOption?.index as number,
                      order.sellId,
                      order.amount,
                    )
                  }
                />
              ))}
            </div>
          </div>

          <div className="shrink-0 w-0.5 border-2 border-solid border-stone-900 h-[441px]" />

          {/* No orders */}
          <div className="flex flex-col flex-1 mt-2">
            <div className="flex items-center w-full whitespace-nowrap text-stone-200">
              <div className="flex gap-2.5 items-start self-stretch py-2 pl-3.5 my-auto border-b-2 border-stone-900 w-[97px]">
                <div className="flex gap-2 items-start w-[139px]">
                  <div className="flex flex-col w-[139px]">
                    <div className="gap-1 self-stretch w-full text-ellipsis">Price</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 shrink gap-2.5 items-start self-stretch py-2 my-auto border-b-2 basis-[13px] border-stone-900 min-w-[240px]">
                <div className="flex gap-2 items-start w-[139px]">
                  <div className="flex flex-col flex-1 shrink w-full basis-0">
                    <div className="flex-1 shrink gap-1 self-stretch w-full text-ellipsis">
                      Amount
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col mt-1.5 w-full">
              {noBets.map((order: OptionBetType, index) => (
                <OrderItem
                  key={index}
                  price={order.price}
                  amount={order.quantity}
                  type={'NO'}
                  onBuy={() =>
                    handleBuyOrders(
                      order.id,
                      order.quantity,
                      order.betOption?.index as number,
                      order.sellId,
                      order.amount,
                    )
                  }
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderBook;
