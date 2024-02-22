import Link from "next/link";

import { StyledButton } from "./Button";
import { usePrivy } from "@privy-io/react-auth";
import LoggedInBar from "./LoggedInBar";

const NavBar = ({ loggedIn = false }: { loggedIn: boolean }) => {
  const { login } = usePrivy();

  return (
    <nav className="navbar bg-slate-600 fixed w-full z-20 top-0 start-0">
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row space-x-2">
          <Link href="/play/0">
            <StyledButton wide={false}>Play</StyledButton>
          </Link>
          <Link href="/stats">
            <StyledButton wide={false}>Score</StyledButton>
          </Link>
          <Link href="/create">
            <StyledButton wide={false}>Create</StyledButton>
          </Link>
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
