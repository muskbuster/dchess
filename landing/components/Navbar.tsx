import Link from "next/link";
import React from "react";
import { StyledButton } from "./StyledButton";

export const Navbar = () => {
  return (
    <nav className="navbar bg-slate-800 fixed w-full z-20 top-0 start-0">
      <div className="flex flex-row justify-end w-full">
        <div className="flex flex-row pr-5 pt-5">
          <Link href="https://app.virtuoso.club/" target="_blank">
            <StyledButton wide={false}>Launch App</StyledButton>
          </Link>
        </div>
      </div>
    </nav>
  );
};
