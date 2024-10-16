
import React from "react";
import Logo from "./Logo";
import Navbar from "./Navbar";

const Header: React.FC = () => {
  return (
    <header className="flex w-full h-[107px] px-[50px] justify-between items-center flex-shrink-0 border-b-2 border-gray-500 border-opacity-20">
      <Logo />
     <Navbar></Navbar>
    </header>
  );
};

export default Header;

