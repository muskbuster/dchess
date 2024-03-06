import Link from "next/link";
import React from "react";
import { StyledButton } from "./StyledButton";
import Image from "next/image";
import logo from "@/public/logo.png";

export const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-[#E6FA040F] via-[#E6FA04CF] to-[#E6FA040F]">
      <div className="navbar bg-[#010712] w-full z-20 top-0 start-0 py-3 px-10 mb-0.5">
        <div className="flex flex-row justify-between w-full">
          <div className="lg:flex flex-row space-x-3 items-center hidden ">
            <Image src={logo} alt="logo" width={40} />
            <p className="text-white pixeloid-sans-bold text-xl">Virtuoso Club</p>
          </div>
          <Link href="https://testnet.virtuoso.club/" target="_blank">
            <StyledButton wide={false}>Launch App</StyledButton>
          </Link>
        </div>
      </div>
    </nav>
  );
};
