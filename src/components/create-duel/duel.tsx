import { DUEL_LOGOS } from '@/constants/app/logos';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { cn } from '@/shadcn/lib/utils';
import Image from 'next/image';
import { FC } from 'react';

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

const Duel: FC<Props> = ({ logo, title, description, isActive, onClick }) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'cursor-pointer transition-all duration-300 border border-transparent',
        isActive
          ? 'bg-[#1E1E1E] border-[#F19ED2] shadow-[0_0_10px_rgba(241,158,210,0.1)]'
          : 'bg-[#141414] hover:border-[#F19ED2] hover:shadow-[0_0_10px_rgba(241,158,210,0.1)]',
      )}
    >
      <CardContent className="flex flex-col items-center gap-4 p-6">
        <Image
          src={isActive ? logo.active : logo.inactive}
          alt={title}
          width={DUEL_LOGOS.COIN.width}
          height={DUEL_LOGOS.COIN.height}
          className="w-12 h-12"
        />
        <div className="text-center">
          <h4 className={cn('font-medium mb-2', isActive ? 'text-[#F19ED2]' : 'text-white')}>
            {title}
          </h4>
          <p className={cn('text-sm', isActive ? 'text-zinc-300' : 'text-zinc-400')}>
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Duel;
