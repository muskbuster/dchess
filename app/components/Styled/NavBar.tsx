import { useState } from 'react';
import { StyledButton } from "./Button";
import { usePrivy } from "@privy-io/react-auth";
import LoggedInBar from "./LoggedInBar";
import NavToggle from './NavToggle';
import useAccessControl from "@/hooks/useAccessControl";
import { useUserInfo } from "@/contexts/UserInfoContext";
import { zeroAddress } from "viem";
import { useRouter } from "next/navigation";

const NavBar = ({ loggedIn = false }) => {
  const { login } = usePrivy();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };
  return (
    <nav className="navbar bg-slate-600 fixed w-full z-20 top-0 start-0 border-b-[1px] border-solid border-white md:border-b-0">
      <div className="flex flex-row justify-between w-full sm:static relative">
      <div className="block md:hidden">
          <NavToggle toggleNav={toggleNav} isOpen={undefined} />
        </div>
        <div className="{`md:flex ${isNavOpen ? 'flex-row' : 'hidden'} gap-3 sm:gap-0 sm:space-x-2 space-x-0 sm:pl-0 sm:pr-0 pl-[10px] pr-[10px] sm:static absolute left-0 right-0 top-[100%] bg-slate-600`}">
          <StyledButton wide={false} onClick={() => router.push("/play/0")}>
            Play
          </StyledButton>
          <div
            className={`${
              !loggedIn || !getOnLeaderboard ? "tooltip tooltip-bottom" : ""
            }`}
            data-tip={`${
              !loggedIn
                ? "Wallet not connected!"
                : !getOnLeaderboard
                ? "Acquire at least 1 token"
                : ""
            }`}
          >
            <StyledButton
              wide={false}
              disabled={!loggedIn || !getOnLeaderboard}
              onClick={() => router.push("/stats")}
            >
              Score
            </StyledButton>
          </div>
          <div
            className={`${
              !loggedIn || !getOnLeaderboard ? "tooltip tooltip-bottom" : ""
            }`}
            data-tip={`${
              !loggedIn
                ? "Wallet not connected!"
                : !puzzleCreate
                ? "Acquire at least 5 token"
                : ""
            }`}
          >
            <StyledButton
              wide={false}
              disabled={!loggedIn || !puzzleCreate}
              onClick={() => router.push("/create")}
            >
              Create
            </StyledButton>
          </div>
        </div>
        <div>
          {loggedIn ? (
            <LoggedInBar />
          ) : (
            <StyledButton wide={false} onClick={login}>
              Connect Wallet
            </StyledButton>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
