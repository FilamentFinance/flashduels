import React from "react";

interface SubmitButtonProps {
  onClick: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      className="gap-2.5 self-stretch px-3 py-2.5 mt-6 w-full text-base font-semibold leading-none text-gray-900 whitespace-nowrap rounded shadow-sm bg-[linear-gradient(180deg,#F19ED2_0%,#C87ECA_100%)]"
    >
      Create Flash Duel
    </button>
  );
};

export default SubmitButton;
