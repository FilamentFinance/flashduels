import React from "react";

interface DisconnectButtonProps {
  text: string;
  iconSrc: string;
  onClick: () => void;
}

const DisconnectButton: React.FC<DisconnectButtonProps> = ({
  text,
  iconSrc,
  onClick
}) => {
  return (
    <button onClick={onClick} className="flex justify-center items-center px-[12px] h-[35px] rounded-[8px] bg-gradient-to-b from-[#FF5A5C] to-[#BD3D44] shadow-[inset_0px_0px_4px_0px_rgba(255,255,255,0.05)]">
      <img
        loading="lazy"
        src={iconSrc}
        alt=""
        className="object-contain shrink-0 self-stretch my-auto w-4 aspect-[1.07]"
      />
      <span className="self-stretch my-auto text-base font-semibold leading-none text-stone-200">
        {text}
      </span>
    </button>
  );
};

export default DisconnectButton;
