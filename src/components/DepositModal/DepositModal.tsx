import React, { useState } from "react";
import Header from "./Header";
import WalletInfo from "./WalletInfo";
import ActionButtons from "./ActionButtons";
import DepositSection from "./DepositSection";
import MyComponent from "../MyComponent";

interface DepositModalProps {
  onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <main className="flex flex-col justify-center py-2.5 px-4 rounded-lg border border-solid bg-zinc-900 border-zinc-700 max-w-[432px]">
        <Header onClose={onClose} />
        <WalletInfo />
        <ActionButtons activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "deposit" ? <DepositSection text={"Deposit USDC on SEI to this wallet"} /> : <MyComponent />}
      </main>
    </div>
  );
};

export default DepositModal;
