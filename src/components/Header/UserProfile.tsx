"use client";
import { usePrivy, User } from "@privy-io/react-auth";
import React, { useEffect, useState } from "react";
import { shortenAddress } from "@/utils/helper";
import PortfolioModal from "../DepositModal/PortfolioModal";
import { NEXT_PUBLIC_API } from "@/utils/consts";

const UserProfile: React.FC = () => {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const disableLogin = !ready || (ready && authenticated);

  const interactWithBackend = async (twitterUsername: string | null | undefined, walletAddress: string | undefined) => {
    if (!twitterUsername || !walletAddress) return;

    try {
      const response = await fetch(`${NEXT_PUBLIC_API}/users/auth`, { // Updated endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ twitterUsername, address: walletAddress }), // Sending both username and address
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Authentication successful:', data);
        // Here you can save the token or user data as needed
      } else {
        console.error('Failed to authenticate:', response.statusText);
      }
    } catch (error) {
      console.error('Error interacting with backend:', error);
    }
  };

  useEffect(() => {
    if (authenticated) {
      const walletAddress = user?.wallet?.address;
      const twitterUsername = user?.twitter?.username;
      interactWithBackend(twitterUsername, walletAddress);
    }
  }, [authenticated, user]);
  

  const handleLogout = () => {
    logout();
    setIsModalOpen(false); 
  };

  return (
    <div className="flex gap-[4px] items-center p-[4px] my-auto rounded-[8px] bg-[rgba(255,255,255,0.02)]">
      {authenticated ? (
        <>
          <div 
            className="flex items-start self-stretch my-auto w-[26px] cursor-pointer" 
            onClick={() => setIsModalOpen(true)} // Open modal on click
          >
            <div className="flex justify-center items-center bg-gray-500 rounded h-[26px] min-h-[26px] w-[26px]">
              <div className="flex overflow-hidden flex-col self-stretch my-auto rounded border border-solid border-white border-opacity-20 w-[26px]">
                <div className="flex shrink-0 h-[26px]" />
              </div>
            </div>
          </div>
          <div onClick={() => setIsModalOpen(true)} className="flex gap-3 items-center self-stretch my-auto text-right whitespace-nowrap">
            <div className="flex flex-col justify-center self-stretch my-auto">
              <div className="text-xs font-medium tracking-normal leading-none text-stone-200">
                {user?.twitter?.username}
              </div>
              <div className="text-xs tracking-normal leading-relaxed text-stone-500">
                {shortenAddress(user?.wallet?.address as string)}
              </div>
            </div>
          </div>

          {/* Modal for user details */}
          {isModalOpen && (
            <PortfolioModal  onClose={() => setIsModalOpen(false)} onLogout={handleLogout} user={user as User} />
            // onClose={() => setIsModalOpen(false)} onLogout={handleLogout} user={user as User}
          )}
        </>
      ) : (
        <button 
          onClick={login} 
          disabled={disableLogin} 
          className="gap-2.5 self-stretch px-3 py-2.5 my-auto text-base font-semibold leading-none text-gray-900 rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]"
        >
          Connect
        </button>
      )}
    </div>
  );
};

export default UserProfile;
