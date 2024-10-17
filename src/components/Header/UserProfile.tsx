"use client";
import { usePrivy, User } from "@privy-io/react-auth";
import React, { useState } from "react";
import { shortenAddress } from "@/utils/helper";
import PortfolioModal from "../DepositModal/PortfolioModal";

// Modal Component
// const Modal = ({ onClose, onLogout, user }: { onClose: () => void; onLogout: () => void; user: User }) => (
//   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
//     <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-1/3">
//       <h2 className="text-xl font-bold mb-4">User Details</h2>
//       <div className="mb-4">
//         <p className="text-sm">Twitter Username: {user?.twitter?.username || 'N/A'}</p>
//         <p className="text-sm">Wallet Address: {user?.wallet?.address || 'N/A'}</p>
//         {/* Add more user details as needed */}
//       </div>
//       <div className="flex justify-between">
//         <button 
//           onClick={onLogout} 
//           className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-200"
//         >
//           Logout
//         </button>
//         <button 
//           onClick={onClose} 
//           className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition duration-200"
//         >
//           Close
//         </button>
//         {/* Export Private Key Button */}
//         <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200">
//           <ExportWalletButton />
//         </button>
//       </div>
//     </div>
//   </div>
// );

const UserProfile: React.FC = () => {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const disableLogin = !ready || (ready && authenticated);

  const handleLogout = () => {
    logout();
    setIsModalOpen(false); // Close the modal after logout
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
