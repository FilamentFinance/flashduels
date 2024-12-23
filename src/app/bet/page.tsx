"use client";

import React, { Suspense, useEffect, useState } from "react";
import { MarketDuel } from "@/components/marketDuel";
import { NewDuelItem, NEXT_PUBLIC_API } from "@/utils/consts";
// import { useRouter } from "next/navigation";
import { apiClient } from "@/utils/apiClient";
import { shortenAddress } from "@/utils/helper";
import { useSearchParams } from "next/navigation";
// import { useAccount } from "wagmi";
import { useBalance } from "@/blockchain/useBalance";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

const BetPage = () => {
  const searchParams = useSearchParams();
  // const router = useRouter();
  const duelId = searchParams.get("duelId");

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [duel, setDuel] = useState<NewDuelItem | null>(null); // Initialize as null to handle loading state
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState<string | null>(null); // To track errors
  const { address:accountAddress } = useAccount();
  const { balance } = useBalance(accountAddress as string);
  const balanceNum = (Number(ethers.formatUnits(balance ? balance.toString() : 0, 6)));


  console.log(isModalOpen);

  useEffect(() => {
    if (duelId) {
      const fetchDuel = async () => {
        try {
          setLoading(true); // Start loading
          const response = await apiClient.get(
            `${NEXT_PUBLIC_API}/duels/get-duel-by-id/${duelId}`
          );
          setDuel(response.data);
          setError(null); // Clear any previous errors
        } catch (error) {
          console.error("Error fetching duel:", error);
          setError("Failed to fetch duel details.");
        } finally {
          setLoading(false); // Stop loading
        }
      };

      fetchDuel();
    } else {
      setError("Duel ID is missing from the query parameters.");
      setLoading(false);
    }
  }, [duelId]);


  if (loading) {
    return <div>Loading duel details...</div>; // Show loading state while fetching
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error if fetching fails
  }

  if (!duel) {
    return <div>No duel details available.</div>; // Show fallback if `duel` is null
  }

  // Destructure duel object only after it's available
  const {
    betString = `Will ${duel.token} be ${duel.winCondition === 0 ? "ABOVE" : "BELOW"
    } ${duel.triggerPrice}`,
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

  console.log(category);

  const betTitle = betString;
  const imageUrl = betIcon;
  const volume = `$${totalBetAmount}`;
  const endTime = endsIn; // Assuming `endsIn` is a timestamp or string; ensure it's formatted correctly
  const percentage = 50; // Adjust based on actual data if needed
  const createdBy = twitterUsername || shortenAddress(address as string);

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
        availableAmount={balanceNum}
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
};

const SuspendedBetPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <BetPage />
  </Suspense>
);

export default SuspendedBetPage;
