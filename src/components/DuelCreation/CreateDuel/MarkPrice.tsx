// import React, { useEffect, useState } from "react";
// import { getCryptoPrices } from "@/utils/prices";
import React from "react";
import { priceIds } from "@/utils/helper";
import { usePrice } from "@/app/providers/PriceContextProvider";
import { ethers } from "ethers";

const MarkPriceComponent = ({ asset }: { asset: string }) => {
    // const [markPrice, setMarkPrice] = useState<string | null>(null);

    // useEffect(() => {
    //     const fetchMarkPrice = async () => {

    //         const price = await getCryptoPrices(asset);
    //         setMarkPrice(price);

    //     };

    //     fetchMarkPrice();
    // }, [asset]);
    const { prices } = usePrice()
    const id = asset
        ? priceIds.find((obj) => obj[asset as keyof typeof obj])?.[asset as keyof typeof priceIds[0]]
        : undefined;
    const formattedId = id?.startsWith("0x") ? id.slice(2) : id;
    const price = formattedId && prices[formattedId]
    const priceFormatted = Number(ethers.formatUnits(
        String((price) || 0),
        8
    ))

    return (
        <div className="flex flex-col mt-4 w-full text-base tracking-normal leading-none">
            <div className="flex flex-1 gap-1 items-center self-stretch my-auto text-base tracking-normal leading-none basis-0 justify-between">
                <div className="flex-1 shrink gap-1 self-stretch tracking-tighter my-auto text-gray-400">
                    Mark Price
                </div>
                <div className="flex-1 shrink gap-1 self-stretch my-auto text-white whitespace-nowrap text-right">
                    ${(priceFormatted).toFixed(4)}
                </div>
            </div>
        </div>
    );
};

export default MarkPriceComponent;
