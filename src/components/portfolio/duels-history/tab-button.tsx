import React from 'react';

interface TabButtonProps {
  label: string;
  active?: boolean;
  onClick: () => void;
}

export const TabButton: React.FC<TabButtonProps> = ({ label, active, onClick }) => {
  return (
    <button
      className={`px-2 py-1 rounded-lg ${
        active ? 'bg-pink-300 text-neutral-900' : 'text-stone-300 hover:bg-neutral-800'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
