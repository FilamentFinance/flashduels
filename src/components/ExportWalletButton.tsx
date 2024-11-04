import React from "react";
import {usePrivy} from '@privy-io/react-auth';

interface ExportWalletButtonProps {
  text: string;
  iconSrc: string;
}

const ExportWalletButton: React.FC<ExportWalletButtonProps> = ({
  text,
  iconSrc,
}) => {
  const {ready, authenticated, user, exportWallet} = usePrivy();
  // Check that your user is authenticated
  const isAuthenticated = ready && authenticated;
  // Check that your user has an embedded wallet
  const hasEmbeddedWallet = user && user.linkedAccounts.find(
    (account) => account.type === 'wallet' && account.walletClient === 'privy',
  );

  return (
    <button
    onClick={exportWallet} 
    disabled={!isAuthenticated || !hasEmbeddedWallet}
    className="flex button w-full mt-4 h-[65px] justify-center items-center gap-[10px] px-[12px] py-[10px] leading-none text-pink-300 rounded-[var(--4px, 4px)] border-[2px] border-solid border-[var(--text-pink, #F19ED2)] bg-[var(--input-bg, rgba(255, 255, 255, 0.02))] shadow-[0px_0px_4px_0px_rgba(255,255,255,0.05)_inset]">
      <span className="self-stretch my-auto">{text}</span>
      <img
        loading="lazy"
        src={iconSrc}
        alt=""
        className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
      />
    </button>
  );
};

export default ExportWalletButton;
