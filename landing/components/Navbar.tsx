import Link from "next/link";
import React from "react";
import { StyledButton } from "./StyledButton";

export const Navbar = () => {
  return (
    <nav className="navbar fixed w-full z-20 top-0 start-0 pt-0 pb-0 pl-5 pr-5 bg-[#0D3B66]">
      <div className="flex flex-row lg:justify-end justify-between w-full lg:border-b-0 border-b border-solid border-b-[#3d6285]">
      <div className="flex flex-row space-x-5 items-center lg:hidden ">
          <Image src={logo} alt="logo" width={40}  className="w-5 h-5 sm:w-10 sm:h-10"/>
          <p className="font-mono md:text-4xl text-base sm:ml-3 ml-0 text-[#ffffff]">Virtuoso Club</p>
        </div>
        <div className="flex flex-row  lg:pt-5 lg:pb-0 pt-4 pb-4">
          <Link href="https://testnet.virtuoso.club/" target="_blank">
            <StyledButton wide={false}>Launch App</StyledButton>
          </Link>
        </div>
      </div>
    </nav>
  );
};
