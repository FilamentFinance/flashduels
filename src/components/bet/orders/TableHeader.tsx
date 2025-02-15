import * as React from 'react';

interface TableHeaderProps {
  label: string;
  width: string;
  isRight?: boolean;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ label, width, isRight }) => (
  <div
    className={`flex gap-2.5 items-start p-2 ${
      isRight ? 'text-right' : 'pl-4 pr-2'
    } border-t border-b border-neutral-800 text-stone-300 ${width}`}
  >
    <div className="flex flex-1 shrink gap-2 items-start w-full basis-0">
      <div className="flex flex-col flex-1 shrink w-full basis-0">
        <div className="flex gap-1 items-center w-full">
          <div className="overflow-hidden flex-1 shrink gap-1 self-stretch my-auto w-full text-ellipsis">
            {label}
          </div>
        </div>
      </div>
    </div>
  </div>
);
