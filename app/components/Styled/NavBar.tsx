import { StyledButton } from "./Button";
import { usePrivy } from "@privy-io/react-auth";
import LoggedInBar from "./LoggedInBar";
import useAccessControl from "@/hooks/useAccessControl";
import { useUserInfo } from "@/contexts/UserInfoContext";
import { zeroAddress } from "viem";
import { usePathname, useRouter } from "next/navigation";
import { StyledButtonSecondary } from "./ButtonSecondary";

const NavBar = ({ loggedIn = false }: { loggedIn: boolean }) => {
  const { login } = usePrivy();
  const userInfo = useUserInfo();
  const { getOnLeaderboard, puzzleCreate } = useAccessControl(
    userInfo?.address || zeroAddress
  );
  const router = useRouter();
  const pathname = usePathname();
  const activeStyle = 'bg-[#171F2E] text-[#E6FA04]'

  return (
    <nav className="bg-gradient-to-r from-[#E6FA040F] via-[#E6FA04CF] to-[#E6FA040F]">
      <div className="navbar bg-[#010712] w-full z-20 top-0 start-0 py-3.5 px-6 mb-0.5">
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row space-x-2">
            <StyledButtonSecondary 
              className={`flex items-center ${pathname.includes('play') ? activeStyle : ''}`} 
              onClick={() => router.push("/play/0")}
              >
              <svg className="h-5 pr-2"  viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.5 9.74238V11.2575H16.75V12.0151H16V12.7727H14.5V13.5303H13V14.2878H12.25V15.0454H10.75V15.803H9.25V16.5606H8.5V17.3181H7V18.0757H5.5V18.8333H3.25V18.0757H2.5V2.9242H3.25V2.16663H5.5V2.9242H7V3.68178H8.5V4.43935H9.25V5.19693H10.75V5.9545H12.25V6.71208H13V7.46966H14.5V8.22723H16V8.98481H16.75V9.74238H17.5Z" fill={pathname.includes('play') ? "#E6FA04" : 'white'}/>
              </svg>
              <span>Play</span>
            </StyledButtonSecondary>
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
              <StyledButtonSecondary
                className={`flex items-center ${pathname.includes('stats') ? activeStyle : ''}`} 
                disabled={!loggedIn || !getOnLeaderboard}
                onClick={() => router.push("/stats")}
              >
                <svg className="h-5 pr-2" viewBox="0 0 20 21" fill={pathname.includes('stats') ? "#E6FA04" : 'white'} xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3.83329V2.16663H4.99998V3.83329H0.833313V7.99996H1.66665V9.66663H2.49998V10.5H3.33331V11.3333H4.16665V12.1666H4.99998V13H7.49998V13.8333H9.16665V16.3333H5.83331V18.8333H14.1666V16.3333H10.8333V13.8333H12.5V13H15V12.1666H15.8333V11.3333H16.6666V10.5H17.5V9.66663H18.3333V7.99996H19.1666V3.83329H15ZM4.16665 10.5V9.66663H3.33331V7.99996H2.49998V5.49996H4.16665V6.33329H4.99998V7.99996H5.83331V10.5H6.66665V11.3333H4.99998V10.5H4.16665ZM17.5 7.99996H16.6666V9.66663H15.8333V10.5H15V11.3333H13.3333V10.5H14.1666V8.83329H15V6.33329H15.8333V5.49996H17.5V7.99996Z"/>
                </svg>
                <span>Score</span>
              </StyledButtonSecondary>
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
              <StyledButtonSecondary
                className={`flex items-center ${pathname.includes('create') ? activeStyle : ''}`} 
                disabled={!loggedIn || !puzzleCreate}
                onClick={() => router.push("/create")}
              >
                <svg className="h-5 pr-2" viewBox="0 0 20 21" fill={pathname.includes('create') ? "#E6FA04" : 'white'} xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.3333 9.74238V11.2575H17.5757V12.0151H11.5151V18.0757H10.7575V18.8333H9.24238V18.0757H8.48481V12.0151H2.4242V11.2575H1.66663V9.74238H2.4242V8.98481H8.48481V2.9242H9.24238V2.16663H10.7575V2.9242H11.5151V8.98481H17.5757V9.74238H18.3333Z"/>
                </svg>
                <span>Create</span>
              </StyledButtonSecondary>
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
      </div>
    </nav>
  );
};

export default NavBar;
