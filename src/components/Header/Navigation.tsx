import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = ({pathname}: {pathname:string}) => {
  const router = usePathname();
  const isPath = router === `/${pathname}`;
  const capitalizedPathname = pathname.charAt(0).toUpperCase() + pathname.slice(1);


  return (
    <Link href={`/${pathname}`} passHref>
      <div
        className={`flex gap-1 items-center self-stretch my-auto text-base leading-5 whitespace-nowrap font-normal ${
          isPath ? "text-[var(--text-pink,#F19ED2)]" : "text-[rgba(243,239,224,0.60)]"
        } cursor-pointer`}
      >
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6596b129f1d0f2fde3bdde3998bf4b071e41dd448efc561252beb12ca68970cc?placeholderIfAbsent=true&apiKey=5395477fd4e141368e15c98db5e38353"
          alt="Leaderboard Icon"
          className="object-contain shrink-0 self-stretch my-auto aspect-square w-[13px]"
        />
        <div
          className={`self-stretch my-auto ${
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
