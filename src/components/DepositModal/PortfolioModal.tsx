import React from "react";
import Header from "./Header";
import WalletInfo from "./WalletInfo";
// import DepositSection from "./DepositSection";
// import MyComponent from "../MyComponent";
import DisconnectButton from "../DisconnectButton";

interface DepositModalProps {
    onClose: () => void;
    onLogout: () => void;
}

const PortfolioModal: React.FC<DepositModalProps> = ({ onClose, onLogout }) => {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <main className="flex flex-col justify-center py-2.5 px-4 rounded-lg border border-solid bg-zinc-900 border-zinc-700 max-w-[432px]">
                <Header onClose={onClose} />
                <div className="flex gap-4 items-center max-w-full w-full h-full">
                    {/* WalletInfo */}
                    <div className="flex-1 w-1/2">
                        <WalletInfo onClose={onClose} />
                    </div>

                    {/* DisconnectButton */}
                    <div className="flex items-center justify-end w-[110px] mt-3.5">
                        <DisconnectButton
                            onClick={onLogout}
                            text="Disconnect"
                            iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/61720aa3ee0f9f91bd5350a506f3496c5251c0cc4dfd39a8ec85aba56e103526?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
                        />
                    </div>
                </div>


                {/* <WalletInfo onClose={onClose} />
                <DisconnectButton text="Disconnect" iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/61720aa3ee0f9f91bd5350a506f3496c5251c0cc4dfd39a8ec85aba56e103526?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d" /> */}
                {/* <DepositSection text={"Wallet Address"} /> */}
                {/* <button onClick={onLogout}>Logout</button> */}
                {/* <MyComponent></MyComponent> */}

            </main>
        </div>
    );
};

export default PortfolioModal;
