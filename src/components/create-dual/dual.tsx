import { FC } from 'react';
import Image from 'next/image';
import { cn } from '@/shadcn/lib/utils';

type Props = {
  logo: {
    active: string;
    inactive: string;
  };
  title: string;
  description: string;
  isActive: boolean;
  onClick?: () => void;
};

const Dual: FC<Props> = ({ logo, title, description, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center p-8 rounded-lg transition-all cursor-pointer',
        'bg-zinc-900 hover:bg-zinc-800/50',
        'border border-zinc-700',
        isActive && 'bg-pink-500/10',
      )}
    >
      <div className="w-12 h-12 mb-4">
        <Image
          src={isActive ? logo.active : logo.inactive}
          alt={title}
          width={48}
          height={48}
          className="w-full h-full object-contain"
        />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 text-center">{description}</p>
    </div>
  );
};

export default Dual;
