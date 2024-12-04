import * as React from "react";
import { ClaimButtonProps } from "./types";
import { ClaimFundsModal } from "../claimFunds/ClaimFunds";

export const ClaimButton: React.FC<ClaimButtonProps> = ({
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  return (
    <>
    <button
      onClick={() => setIsModalOpen(true)}
      className="gap-2.5 self-stretch px-3 py-2.5 my-auto text-base font-semibold leading-none text-gray-900 rounded  shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)] border-white border-opacity-70"
    >
      {children}
    </button>
    <ClaimFundsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
