import React from "react";

interface DuelCategoryCardProps {
  title: string;
  imageSrc?: string;
  isSpecial?: boolean;
  onClick: () => void; // Add onClick prop
}

const DuelCategoryCard: React.FC<DuelCategoryCardProps> = ({
  title,
  imageSrc,
  isSpecial,
  onClick, // Destructure the onClick prop
}) => {
  const baseClasses =
    "flex overflow-hidden grow shrink self-stretch pl-4 pb-4 my-auto rounded-[12px] border-2 border-solid min-w-[240px] w-[283px] h-[179px]";
  const specialClasses =
    "px-4 pt-28 pb-2 text-pink-300 border-pink-300 shadow-[0px_0px_19.9px_-3px_#F19ED2_inset] bg-[linear-gradient(180deg,#101010_0%,#000_100%)] max-md:pt-24 max-md:pr-5 flex-shrink-0";
  const regularClasses =
    "border-[#29272A] bg-[var(--card-bg,linear-gradient(180deg,#101010_0%,#000_100%))] flex-shrink-0";

  return (
    <button
      className={`${baseClasses} ${isSpecial ? specialClasses : regularClasses}`}
      onClick={onClick} // Attach onClick to the card
    >
      {!isSpecial && (
        <>
          <h2 className="z-10 grow self-end mt-28 max-md:mt-10 max-md:mr-0">
            {title}
          </h2>
          {imageSrc && (
            <img
              loading="lazy"
              src={imageSrc}
              alt=""
              className="object-contain shrink-0 max-w-full aspect-[1.05] w-[188px]"
            />
          )}
        </>
      )}
      {isSpecial && <h2 className="text-pink-300">{title}</h2>}
    </button>
  );
};

export default DuelCategoryCard;
