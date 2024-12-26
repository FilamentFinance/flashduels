"use client";

import React, { useState } from "react";
import { shortenAddress } from "@/utils/helper";
import PortfolioModal from "../DepositModal/PortfolioModal";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { disconnect } from "@wagmi/core/actions";
import { config } from "@/app/config/wagmi";
import { CHAIN_ID } from "@/utils/consts";

const UserProfile = ({
  chainId,
  handleNetworkChange,
}: {
  chainId: number;
  handleNetworkChange: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { address, isConnected } = useAccount();

  const handleLogout = async () => {
    await disconnect(config);
    setIsModalOpen(false);
  };

  return (
    <div className="flex gap-[4px] items-center p-[4px] my-auto rounded-[8px] bg-[rgba(255,255,255,0.02)]">
      {isConnected ? (
        chainId === CHAIN_ID ? (
          <>
            <div
              className="flex items-start self-stretch my-auto w-[26px] cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="flex justify-center items-center bg-gray-500 rounded h-[26px] min-h-[26px] w-[26px]">
                <div className="flex overflow-hidden flex-col self-stretch my-auto rounded border border-solid border-white border-opacity-20 w-[26px]">
                  <div className="flex shrink-0 h-[26px]" />
                </div>
              </div>
            </div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="flex gap-3 items-center self-stretch my-auto text-right whitespace-nowrap"
            >
              <div className="flex flex-col justify-center self-stretch my-auto">
                <div className="text-xs tracking-normal leading-relaxed text-stone-500">
                  {shortenAddress(address as string)}
                </div>
              </div>
            </div>

            {isModalOpen && (
              <PortfolioModal
                onClose={() => setIsModalOpen(false)}
                onLogout={handleLogout}
              />
            )}
          </>
        ) : (
          <button
          className="gap-2.5 self-stretch px-3 py-2.5 my-auto text-base font-semibold leading-none text-gray-900 rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]"
          onClick={handleNetworkChange}
        >
          Switch Network
        </button>
        )
      ) : (
        <ConnectButton.Custom>
          {({ openConnectModal, mounted }) => {
            const ready = mounted;

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                <button
                  onClick={openConnectModal}
                  className="gap-2.5 self-stretch px-3 py-2.5 my-auto text-base font-semibold leading-none text-gray-900 rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]"
                >
                  Connect Wallet
                </button>
              </div>
            );
          }}
        </ConnectButton.Custom>
      )}
    </div>
  );
};

export default UserProfile;
