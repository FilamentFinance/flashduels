import * as React from "react";
import { AlertProps } from "./types";
import { useState } from "react";
import { copyToClipboard } from "@/utils/helper";
import { NEXT_PUBLIC_FLASH_USDC } from "@/utils/consts";

export const Alert: React.FC<AlertProps> = ({ icon, content, ariaLabel }) => {
 
  const [isCopied, setIsCopied] = useState(false); // State to track copy status

  // Handle copy action
  const handleCopy = async () => {
    const success = await copyToClipboard(NEXT_PUBLIC_FLASH_USDC);
    if (success) {
      setIsCopied(true); // Update state to show tick
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }
  };
 
  return (
    <div
    className="rounded-lg border border-solid border-[rgba(255,255,255,0.02)] bg-[rgba(255,255,255,0.02)]"

      role="alert"
      aria-label={ariaLabel}
    >
      <div className="flex flex-wrap flex-1 shrink gap-2.5 items-center self-stretch px-4 py-3.5 my-auto w-full rounded-lg border border-solid basis-0 bg-white bg-opacity-0 border-white border-opacity-0 min-w-[240px] max-md:max-w-full">
        <div className="flex items-center self-stretch my-auto w-4">
          <img
            loading="lazy"
            src={icon}
            alt=""
            className="object-contain self-stretch my-auto w-4 aspect-square"
            aria-hidden="true"
          />
        </div>
        <p className="flex-1 shrink gap-0.5 self-stretch my-auto text-base font-medium tracking-normal leading-none min-w-[240px] text-stone-200 max-md:max-w-full">
          {content}
        </p>
        <div className="flex gap-2.5 items-center self-stretch pr-5 pl-3 my-auto w-[58px]">
              <button onClick={handleCopy} className="flex items-center justify-center w-8 h-8 bg-gray-800 rounded-full hover:bg-gray-700 transition">
                {isCopied ? (
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/your-tick-mark-image-url-here" // Replace with your tick mark icon URL
                    alt="Copied"
                    className="object-contain aspect-square"
                  />
                ) : (
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/6d53b90aba36f4daa7a7550385d72e42dfdeb995f6c6f1533e43f5e4e2a16204?placeholderIfAbsent=true&apiKey=9a4d3cdfd283475dbc30e1b60dc2077d"
                    alt="Copy"
                    className="object-contain aspect-square"
                  />
                )}
              </button>
            </div>
      </div>
    </div>
  );
};
