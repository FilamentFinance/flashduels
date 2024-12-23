import React from "react";

interface DuelCategoryCardProps {
  title: string;
  imageSrc?: string;
  isSpecial?: boolean;
  onClick: () => void;
}

const DuelCategoryCard: React.FC<DuelCategoryCardProps> = ({
  title,
  imageSrc,
  onClick,
  isSpecial
}) => {
  // const [isClicked, setIsClicked] = useState(false);

  const baseClasses =
    "flex items-center pt-[4px] pl-[4px] pb-[4px] pr-3 my-auto rounded-[12px] min-w-[194.5px] w-full h-[48px] border border-2 cursor-pointer transition-all";

  const clickedClasses = isSpecial
    ? "border-pink-300 border-pink-300 shadow-[0px_0px_19.9px_-3px_#F19ED2_inset]"
    : "bg-[var(--card-bg,linear-gradient(180deg,#101010_0%,#000_100%))] border-[#29272A]";

  const handleCardClick = () => {
    onClick(); // Trigger the parent's onClick
  };

  return (
    <button
      className={`${baseClasses} ${clickedClasses}`}
      onClick={handleCardClick}
    >
        <div className="flex items-center gap-[10px]">
          {imageSrc && (
            <img
              loading="lazy"
              src={imageSrc}
              alt=""
              className={`w-[32px] h-[32px] rounded-md ${isSpecial ? "bg-pink-300" : ""}`}
            />
          )}
          <h2 className={`font-medium ${isSpecial ? "text-white" : "text-gray-500"}`}>
            {title}
          </h2>
        </div>
    </button>
  );
};

export default DuelCategoryCard;
