import React from "react";
import DepositWithdrawToggle from "../DepositWithdrawToggle";

interface ActionButtonsProps {
  activeTab: "deposit" | "withdraw"; // More specific type
  setActiveTab: React.Dispatch<React.SetStateAction<"deposit" | "withdraw">>;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="flex px-2 overflow-hidden justify-center self-center p-1 mt-4 text-base text-center whitespace-nowrap rounded-lg min-h-[60px]">
      <DepositWithdrawToggle activeTab={activeTab} onTabChange={setActiveTab} />
    </nav>
  );
};

export default ActionButtons;
