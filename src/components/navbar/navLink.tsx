import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

interface NavLinkProps {
  path: string;
  title: string;
}

const NavLink: FC<NavLinkProps> = ({ path, title }) => {
  const pathname = usePathname();
  return (
    <Link
      href={path}
      className={` transition-colors text-base leading-5 ${
        pathname === path ? 'text-nav-active' : 'text-nav-inactive hover:text-nav-hover'
      }`}
    >
      {title}
    </Link>
  );
};

export default NavLink;
