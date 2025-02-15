import React from 'react';

interface YesNoButtonProps {
  text: string;
  color: 'lime' | 'red';
  onClick: () => void;
  isSelected: boolean;
}

const YesNoButton: React.FC<YesNoButtonProps> = ({ text, color, onClick, isSelected }) => {
  const baseClasses =
    'flex-1 shrink gap-2.5 p-2.5 rounded-lg border border-solid focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 w-48';
  const colorClasses = {
    lime: 'text-lime-300 bg-lime-500 bg-opacity-10 border-lime-400 border-opacity-20 hover:bg-lime-500 hover:bg-opacity-20 focus:ring-lime-500',
    red: 'text-red-500 bg-red-600 bg-opacity-10 border-red-600 border-opacity-10 hover:bg-red-600 hover:bg-opacity-20 focus:ring-red-500',
  };
  const selectedClasses = {
    lime: 'bg-lime-500 bg-opacity-20 text-lime-100',
    red: 'bg-red-600 bg-opacity-20 text-red-100',
  };

  return (
    <button
      className={`${baseClasses} ${colorClasses[color]} ${isSelected ? selectedClasses[color] : ''}`}
      onClick={onClick}
      aria-label={`Select ${text}`}
      aria-pressed={isSelected}
    >
      {text}
    </button>
  );
};

export default YesNoButton;
