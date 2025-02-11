'use client';

import { NAVBAR } from '@/constants/content/navbar';
import { cn } from '@/shadcn/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import FlashDuelLogo from '../../../public/logo/flash-dual.svg';

interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({ className }) => {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <Image
        src={FlashDuelLogo}
        alt={NAVBAR.LOGO.ALT_TEXT}
        width={117}
        height={41}
        style={{ width: 'auto', height: '41px' }}
        className="object-contain"
        priority
      />
    </Link>
  );
};

export default Logo;
