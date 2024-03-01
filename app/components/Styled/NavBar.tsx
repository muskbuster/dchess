import { StyledButton } from "./Button";
import { usePrivy } from "@privy-io/react-auth";
import LoggedInBar from "./LoggedInBar";
import useAccessControl from "@/hooks/useAccessControl";
import { useUserInfo } from "@/contexts/UserInfoContext";
import { zeroAddress } from "viem";
import { useRouter } from "next/navigation";

const NavBar = ({ loggedIn = false }: { loggedIn: boolean }) => {
  const { login } = usePrivy();
  const userInfo = useUserInfo();
  const { getOnLeaderboard, puzzleCreate } = useAccessControl(
    userInfo?.address || zeroAddress
  );
  const router = useRouter();

  return (
    <nav className="navbar bg-slate-600 fixed w-full z-20 top-0 start-0">
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row space-x-2">
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
