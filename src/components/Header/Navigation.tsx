import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = ({ pathname }: { pathname: string }) => {
  const router = usePathname();
  const isPath = router === `/${pathname}`;
  const capitalizedPathname =
    pathname.charAt(0).toUpperCase() + pathname.slice(1);

  return (
    <Link href={`/${pathname}`} passHref>
      <div
        className={`text-base leading-5 whitespace-nowrap font-normal ${
          isPath
            ? "text-[var(--text-pink,#F19ED2)]"
            : "text-[rgba(243,239,224,0.60)]"
        } cursor-pointer flex items-center`}
      >
        <div
          className={`${
            isPath ? "font-cairo text-[16px] font-normal leading-[20px]" : ""
          }`}
        >
          {capitalizedPathname}
        </div>
      </div>
    </Link>
  );
};


export default Navigation;
