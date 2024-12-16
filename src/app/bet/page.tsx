"use client";

import React, { useEffect, useState } from "react";
import { MarketDuel } from "@/components/marketDuel";
import { BetCardProps, NewDuelItem, NEXT_PUBLIC_API } from "@/utils/consts";
import { useRouter } from "next/navigation";
import { apiClient } from "@/utils/apiClient";
import { shortenAddress } from "@/utils/helper";
import { useSearchParams } from "next/navigation";

export default function BetPage() {
  const searchParams = useSearchParams();
  const duelId = searchParams.get("duelId");

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [duel, setDuel] = useState<NewDuelItem | null>(null); // Initialize as null to handle loading state

  useEffect(() => {
    if (duelId) {
      const fetchDuel = async () => {
        try {
          const response = await apiClient.get(`${NEXT_PUBLIC_API}/duels/get-duel-by-id/${duelId}`);
          setDuel(response.data);
        } catch (error) {
          console.error("Error fetching duel:", error);
        }
      };

      fetchDuel();
    }
  }, [duelId]);

  if (!duel) {
    return <div>Loading duel details...</div>; // Show loading state while fetching
  }

  // Destructure duel object only after it's available
  const {
    betString = `Will ${duel.token} be ${duel.winCondition === 0 ? "ABOVE" : "BELOW"} ${duel.triggerPrice}`,
    betIcon = "empty-string",
    totalBetAmount = 0,
    category,
    status,
    duelType,
    endsIn,
    startAt = 0,
    createdAt,
    user: { twitterUsername, address },
    token,
    triggerPrice,
  } = duel;

  const betTitle = betString;
  const imageUrl = betIcon;
  const volume = `$${totalBetAmount}`;
  const endTime = endsIn; // Assuming `endsIn` is a timestamp or string; ensure it's formatted correctly
  const percentage = 50;  // Adjust based on actual data if needed
  const createdBy = twitterUsername || shortenAddress(address);
  const availableAmount = 0;  // Set according to your logic (balance or available funds)
  const asset = token;

  return (
    <div>
      <MarketDuel
        betTitle={betTitle}
        imageUrl={imageUrl}
        volume={volume}
        endTime={endTime}
        percentage={percentage}
        createdBy={createdBy}
        availableAmount={availableAmount}
        onClose={() => setIsModalOpen(false)}
        duelId={duelId as string}
        duelType={duelType}
        startAt={startAt}
        status={status}
        createdAt={createdAt}
        asset={asset}
        totalBetAmount={totalBetAmount}
        endsIn={endTime} // Ensure this value is correct for display
        triggerPrice={triggerPrice}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
