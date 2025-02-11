'use client';

import { NAVBAR } from '@/constants/content/navbar';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import FlashDuelLogo from '../../../public/logo/flash-dual.svg';

const Logo: FC = () => {
  return (
    <Link href="/" className="cursor-pointer">
      <Image
        src={FlashDuelLogo}
        alt={NAVBAR.LOGO.ALT_TEXT}
        width={117}
        height={41}
        className="object-contain"
        priority
      />
    </Link>
  );
};

export default Logo;
