import React, { useEffect, useState } from "react";
// import usePopup from "@/app/providers/PopupProvider";
import { generateAndStorePrivateKey } from "@/utils/sign";
import Link from "next/link";
import { useDisconnect } from "wagmi";
// import Image from "next/image";
// import { disconnect } from "process";
import { apiClient, setupInterceptors } from "@/utils/apiClient";
import { ethers } from "ethers";
import { NEXT_PUBLIC_API } from "@/utils/consts";
import { getAccount, signMessage } from "@wagmi/core";
import { useConfig } from "wagmi";
import { useBalance } from "@/blockchain/useBalance";
import { estConnection } from "@/utils/atoms";
import { useAtom } from "jotai";

interface DisclaimerPopupProps {
  onClose: () => void;
}

const DisclaimerPopup: React.FC<DisclaimerPopupProps> = ({ onClose }) => {
  const [disclaimerVisible, setDisclaimerVisible] = useState(true);
  const [enableButton, setenableButton] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const config = useConfig();
  const { address, connector } = getAccount(config);

  const { refetch } = useBalance(address as string);
  const [establishConnection, setEstablishConnection] = useAtom(estConnection);
  // const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };
  // const {address} = useAccount()
  console.log(enableButton, establishConnection);
  const handleDisclaimerAccept = async () => {
    setDisclaimerVisible(false);
    // const registerFunction = async (
    //   showPopup: () => void,
    //   disconnect: () => void
    // ) => {
    try {
      const { privateKey, expiry } = await generateAndStorePrivateKey(
        address as string
      );
      const wallet = new ethers.Wallet(privateKey);
      const publicKey = (await wallet.getAddress()).toLowerCase();
      const hashMessage = `${publicKey}`;
      const hashMsg = ethers.hashMessage(hashMessage);
      //   const hashMessage = ethers.solidityPackedKeccak256(["string", "string"], [publicKey, expiry]);

      let signature;
      try {
        signature = await signMessage(config, {
          connector,
          message: publicKey,
        });
      } catch (e) {
        if ((e as { code: number }).code === 4001) {
          // If the user rejects the signature request (MetaMask rejection code)
          console.log("User rejected the signature request.");
          disconnect(); // Disconnect the user
          return; // Exit early to prevent further execution
        }
        console.log("Error during signature", e);
      }
      if (signature) {
        console.log(hashMessage, "hashMessage", hashMsg);
        const response = await apiClient.post(`${NEXT_PUBLIC_API}/users/auth`, {
          account: address?.toLowerCase(),
          signature: signature,
          publicKey: publicKey.toLowerCase(),
          expiry,
        });
        const result = response.data.result;
        console.log(result, "result");
        // if (result.status === 401) {
        //   localStorage.removeItem(`signingKey_${address?.toLowerCase()}`);
        //   localStorage.removeItem(`signingKeyExpiry_${address?.toLowerCase()}`);
        //   localStorage.removeItem(`Bearer_${address?.toLowerCase()}`);
        //   disconnect();
        // }
        localStorage.setItem(
          `signingKey_${address?.toLowerCase()}`,
          privateKey
        );
        localStorage.setItem(
          `signingKeyExpiry_${address?.toLowerCase()}`,
          expiry
        );
        localStorage.setItem(`Bearer_${address?.toLowerCase()}`, result);
        setEstablishConnection(false);
        await setupInterceptors(
          (address as string)?.toLowerCase(),
          disconnect,
          setEstablishConnection
        );
      }
    } catch (error) {
      console.error("Error handling user connection:", error);
    } finally {
      refetch();
      onClose();
    }
  };

  useEffect(() => {
    return () => {
      setenableButton(false);
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleScroll = (event: any) => {
    const hitBottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (hitBottom) {
      setenableButton(true);
    }
  };

  return (
    <div>
      {disclaimerVisible && (
        // <>
        //   <div className="fixed inset-0 flex justify-center items-center z-[9999] bg-background/80 backdrop-blur-sm bg-black opacity-90"></div>
        //   <div className="fixed inset-0 flex justify-center items-center z-[9999] top-[10%] max-[500px]:px-4">
        //     <div className="pool_wallet_popup w-full max-w-[540px] transform text-left align-middle shadow-xl transition-all">
        //       <div className="agree_bg h-[220px]">
        //         <div className=" justify-end flex p-5 relative">
        //           {/* <button
        //   className="bg-[#1B1B1B] border-[1px] border-solid border-[#323232] rounded-[4px] w-[34px] h-[34px] flex items-center justify-center"
        //   onClick={() => {
        //     onClose();
        //     sessionStorage.clear();
        //     handleDisclaimerDecline();
        //   }}
        // >
        //   <AiOutlineClose className="text-2xl text-white" />
        // </button> */}
        //         </div>
        //         <div className="text-center">
        //           <div className="flex justify-center">
        //             <Image
        //               className="w-[60px]"
        //               width={60}
        //               height={60}
        //               priority
        //               src={
        //                 "https://filamentimages.s3.ap-southeast-1.amazonaws.com/webapp_assets/images/filament-icon.svg"
        //               }
        //               alt="logo"
        //             />
        //           </div>
        //           <p className="text-[#fff] mt-4 text-2xl font-semibold pool_font tracking-[0.12px]">
        //             Welcome to Filament
        //           </p>
        //           <div className="p-5">
        //             <div className="border-b-[1px] border-[#25272A] border-solid "></div>
        //           </div>
        //         </div>
        //       </div>

        //       <div
        //         className="p-5 gap-y-2 overflow-y-auto h-[300px] no-scrollbar"
        //         onScroll={handleScroll}
        //       >
        //         <p className="text-[#FFFFFF] text-sm font-medium mb-6">
        //           By accessing Filament, you agree to the following:
        //         </p>
        //         <p className="text-[#FFFFFF] text-xs mb-2">
        //           <b>Eligibility:</b> You confirm that you are not a resident,
        //           citizen, or entity located in the United States, United
        //           Kingdom, Mainland China, or any other restricted
        //           jurisdictions, and you are not subject to sanctions.
        //         </p>
        //         <p className="text-[#FFFFFF] text-xs mb-2">
        //           <b>Risk Acknowledgment:</b> You understand that trading
        //           digital assets and perpetual futures contracts is highly risky
        //           and may result in the loss of your entire investment. You
        //           assume full responsibility for any losses incurred.
        //         </p>
        //         <p className="text-[#FFFFFF] text-xs mb-2">
        //           <b>No Financial Advice:</b> Filament does not provide
        //           financial, legal, or tax advice. All decisions are made at
        //           your own risk.
        //         </p>
        //         <p className="text-[#FFFFFF] text-xs">
        //           <b>Acceptance of Terms:</b> By proceeding, you acknowledge
        //           that you have read and agree to Filament`s{" "}
        //           <Link href="/terms-of-use">
        //             <span className="text-[#40E0D0]">Terms of Use</span>
        //           </Link>{" "}
        //           and{" "}
        //           <Link href="/privacy-policy">
        //             <span className="text-[#40E0D0]">Privacy Policy</span>
        //           </Link>
        //           .
        //         </p>
        //       </div>

        //       <div className="p-5">
        //         <div className="flex items-center mb-4">
        //           <input
        //             type="checkbox"
        //             id="agree"
        //             checked={isChecked}
        //             onChange={handleCheckboxChange}
        //             className="mr-2"
        //           />
        //           <label
        //             htmlFor="agree"
        //             className="text-white text-xs font-medium"
        //           >
        //             I agree to the terms and conditions
        //           </label>
        //         </div>
        //         <button
        //           onClick={handleDisclaimerAccept}
        //           disabled={!isChecked}
        //           className={`w-full text-sm font-semibold py-3 rounded-lg ${
        //             isChecked
        //               ? "bg-[#40E0D0] text-[#0B2B28]"
        //               : "bg-gray-600 text-gray-400 cursor-not-allowed"
        //           }`}
        //         >
        //           Agree
        //         </button>
        //       </div>
        //     </div>
        //   </div>
        // </>
        <>
          <div className="fixed inset-0 flex justify-center items-center z-[9999] bg-background/80 backdrop-blur-sm bg-black opacity-90"></div>
          <div className="fixed inset-0 flex justify-center items-center z-[9999] top-[10%] max-[500px]:px-4">
            <div
              className="pool_wallet_popup w-full max-w-[540px] transform text-left align-middle shadow-xl transition-all"
              style={{
                borderRadius: "8px",
                border: "1px solid var(--Border-Border-Color, #25272A)",
                background: "var(--Background-Card-Body-Color, #1B1C1E)",
                boxShadow: "0px 6px 4px 0px rgba(0, 0, 0, 0.20)",
              }}
            >
              <div className="agree_bg h-[220px]">
                <div className="justify-end flex p-5 relative">
                  {/* <button
          className="bg-[#1B1B1B] border-[1px] border-solid border-[#323232] rounded-[4px] w-[34px] h-[34px] flex items-center justify-center"
          onClick={() => {
            onClose();
            sessionStorage.clear();
            handleDisclaimerDecline();
          }}
        >
          <AiOutlineClose className="text-2xl text-white" />
        </button> */}
                </div>
                <div className="text-center">
                  <div className="flex justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="74"
                      viewBox="0 0 64 74"
                      fill="none"
                    >
                      <circle
                        cx="55.5"
                        cy="61"
                        r="8.35"
                        fill="#F19ED2"
                        stroke="#F19ED2"
                        stroke-width="0.3"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M31.35 28.3636C31.35 29.551 32.3126 30.5136 33.5 30.5136H52.063C53.5766 30.5136 54.4497 32.2323 53.5571 33.4547L27.994 68.4609C26.9385 69.9063 24.65 69.1597 24.65 67.3699V45.6364C24.65 44.4489 23.6874 43.4864 22.5 43.4864H3.93698C2.42335 43.4864 1.55028 41.7677 2.44293 40.5453L28.006 5.53913C29.0615 4.09365 31.35 4.84028 31.35 6.63015V28.3636Z"
                        fill="#F19ED2"
                        stroke="#F19ED2"
                        stroke-width="0.3"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-[#fff] mt-4 text-2xl font-semibold pool_font tracking-[0.12px]">
                    Welcome to Flash Duels
                  </p>
                  <div className="p-5">
                    <div className="border-b-[1px] border-[#25272A] border-solid "></div>
                  </div>
                </div>
              </div>

              <div
                className="px-5 gap-y-2 overflow-y-auto h-[250px] no-scrollbar"
                onScroll={handleScroll}
              >
                <p className="text-[#FFFFFF] text-sm font-medium mb-6">
                  By accessing Filament, you agree to the following:
                </p>
                <p className="text-[#FFFFFF] text-xs mb-2">
                  <b>Eligibility:</b> You confirm that you are not a resident,
                  citizen, or entity located in the United States, United
                  Kingdom, Mainland China, or any other restricted
                  jurisdictions, and you are not subject to sanctions.
                </p>
                <p className="text-[#FFFFFF] text-xs mb-2">
                  <b>Risk Acknowledgment:</b> You understand that trading
                  digital assets and perpetual futures contracts is highly risky
                  and may result in the loss of your entire investment. You
                  assume full responsibility for any losses incurred.
                </p>
                <p className="text-[#FFFFFF] text-xs mb-2">
                  <b>No Financial Advice:</b> Filament does not provide
                  financial, legal, or tax advice. All decisions are made at
                  your own risk.
                </p>
                <p className="text-[#FFFFFF] text-xs">
                  <b>Acceptance of Terms:</b> By proceeding, you acknowledge
                  that you have read and agree to Filament`s{" "}
                  <Link href="/terms-of-use">
                    <span className="text-[#40E0D0]">Terms of Use</span>
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy">
                    <span className="text-[#40E0D0]">Privacy Policy</span>
                  </Link>
                  .
                </p>
              </div>

              <div className="p-5">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="agree"
                    className="text-white text-xs font-medium"
                  >
                    I agree to the terms and conditions
                  </label>
                </div>
                <button
                  onClick={handleDisclaimerAccept}
                  disabled={!isChecked}
                  className={`w-full text-sm font-semibold py-3 rounded-lg ${
                    isChecked
                      ? "bg-[#40E0D0] text-[#0B2B28]"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Agree
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DisclaimerPopup;
