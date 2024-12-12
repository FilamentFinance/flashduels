import * as React from "react";
import { Button } from "./Button";
import { Alert } from "./Alert";
import { Modal } from "./Modal";
import { NEXT_PUBLIC_FLASH_USDC } from "@/utils/consts";
import { shortenAddress } from "@/utils/helper";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAccount } from "wagmi";
import { useBalance } from "@/blockchain/useBalance";
import { useAtom } from "jotai";
import { GeneralNotificationAtom } from "../GeneralNotification";

interface FaucetContainerTypes {
  isOpen: boolean;
  // setIsOpen: (isOpen:boolean)=> void;
  handleClose: () => void;
}

export const FaucetContainer = ({
  isOpen,
  // setIsOpen,
  handleClose
}: FaucetContainerTypes) => {
  const router = useRouter()
  const { address } = useAccount();
  const [notification, setNotification] = useAtom(GeneralNotificationAtom);
  const { refetch} = useBalance(address as string);
  const content = `Token Address: ${shortenAddress(NEXT_PUBLIC_FLASH_USDC)}`
  const [mintLoading, setMintLoading] = React.useState(false);
  const handleClaimFaucet = async () => {
    try {
      setMintLoading(true);
      await axios.post("/api/mint", {
        address: address?.toLowerCase() || "",
      });

      setNotification({
        isOpen: true,
        success: true,
        massage: "Minted Successfully",
      });
    } catch (error) {
      setNotification({
        isOpen: true,
        success: false,
        massage: "Failed to Mint Tokens",
      });
      console.log("Error", error);
    } finally {
      setMintLoading(false);
      handleClose()
      refetch()
      
    }
  }
  console.log(notification)
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <main className="flex overflow-hidden flex-col rounded-lg shadow-sm bg-zinc-900 max-w-[540px]">
        <header className="flex relative gap-10 justify-center items-start py-6 w-full text-2xl font-semibold tracking-normal text-white max-md:max-w-full">
          <h1 className="z-0 my-auto">Claim Faucet</h1>
          <button
            onClick={handleClose}
            className="absolute right-8 top-2/4 z-0 -translate-y-2/4"
            aria-label="Close modal"
          >
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/d9f63011f3b5cf5468d7724bcba13a3112cfb52c57970ec3ce17a122f0874924?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
              alt=""
              className="object-contain shrink-0 self-start w-7 h-7 aspect-square fill-white fill-opacity-10 stroke-[1px] stroke-white stroke-opacity-0 translate-x-[0%]"
              aria-hidden="true"
            />
          </button>
        </header>
        <svg width="540" height="2" viewBox="0 0 540 2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 1H540" stroke="#42464D" stroke-linecap="square" />
        </svg>

        <section className="flex flex-col px-6 pb-6 w-full max-md:px-5 max-md:max-w-full">
          <div className="flex flex-col items-center w-full max-md:max-w-full">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/85384675f2be4096886f8a69b26bbc95c229210e189a090131ad02625833f6cf?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
              alt="Faucet illustration"
              className="object-contain max-w-full aspect-square w-[165px]"
            />
          </div>

          <Alert
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/a7470fcd85f0f1469f402706e8dd6a13d3c49985a44312f5a068888fd825a1f5?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
            content={content}
            ariaLabel="Token address information"
          />

          <div className="flex flex-wrap gap-2.5 mt-8 w-full min-h-[63px] max-md:max-w-full">
            <Button
              variant="primary"
              onClick={handleClaimFaucet}
              ariaLabel="Claim faucet"

            >
              {mintLoading ? <div className="spinner"></div> : "Claim Faucet"}
            </Button>

            <Button
              variant="secondary"
              onClick={() => { router.push('https://atlantic-2.app.sei.io/faucet/') }}

              ariaLabel="Access SEI faucet"
            >
              <span>SEI Faucet</span>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/0d3665acfaf591583f76bcb960986f9005a1f59e5362327aea445f84541a9bc1?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
                alt=""
                // className="object-contain shrink-0 self-stretch my-auto aspect-square w-[17px]"
                aria-hidden="true"
              />
            </Button>
          </div>
        </section>
      </main>
    </Modal>
  );
};
