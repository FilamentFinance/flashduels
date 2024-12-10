import { FaucetContainer } from "@/components/faucet/FaucetContainer";
import { GeneralNotification } from "@/components/GeneralNotification";
import * as React from "react";

interface IconButtonProps {
  iconSrc: string;
  iconAlt?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  iconSrc,
  iconAlt = "",
}) => {
   const [isOpen, setIsOpen] = React.useState(false);

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  return (
    <div>
    <button
    onClick={handleOpen}
      className="flex gap-3 justify-center items-center px-3 w-9 h-9 rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]"
      aria-label={iconAlt || "Icon button"}
    >
      <img
        loading="lazy"
        src={iconSrc}
        alt={iconAlt}
        className="object-contain self-stretch my-auto w-3 aspect-[0.75] shadow-[0px_0px_4px_rgba(251,255,18,1)]"
      />
    </button>
     {isOpen && <FaucetContainer isOpen={isOpen} handleClose={handleClose} />}
     <GeneralNotification></GeneralNotification>
     </div>
  );
};
