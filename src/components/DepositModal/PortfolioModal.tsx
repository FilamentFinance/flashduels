import React from "react";
import Header from "./Header";
import WalletInfo from "./WalletInfo";
import DepositSection from "./DepositSection";
import { User } from "@privy-io/react-auth";
import MyComponent from "../MyComponent";

interface DepositModalProps {
    onClose: () => void;
    onLogout: () => void;
    user: User
}

const PortfolioModal: React.FC<DepositModalProps> = ({ onClose, onLogout }) => {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <main className="flex flex-col justify-center py-2.5 px-4 rounded-lg border border-solid bg-zinc-900 border-zinc-700 max-w-[432px]">
                <Header onClose={onClose} />
                <WalletInfo />
                <DepositSection text={"Wallet Address"} />
                <button onClick={onLogout}>Logout</button>
                <MyComponent></MyComponent>

            </main>
        </div>
    );
};

export default PortfolioModal;
