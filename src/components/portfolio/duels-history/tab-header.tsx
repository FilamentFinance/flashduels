import React from 'react';

interface TableHeaderProps {
  label: string;
  width: string;
  align?: 'left' | 'center' | 'right';
}

export const TableHeader: React.FC<TableHeaderProps> = ({ label, width, align = 'left' }) => {
  return (
    <div
      className={`px-2 py-1 ${width} ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : ''}`}
    >
      {label}
    </div>
  );
};
