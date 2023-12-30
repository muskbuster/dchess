import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

import { StyledButton } from "@/components/Layout/StyledButton";
import { useAccount } from "wagmi";
import AddressBar from "@/components/Common/AddressBar";

const ProfileScreen = () => {
  const { address } = useAccount();
  const { authenticated, logout, exportWallet } = usePrivy();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push(`/`);
  };

  const handleExport = () => {
    exportWallet();
  };

  return authenticated ? (
    <div className="flex flex-col space-y-5 mt-5">
      {address ? <AddressBar address={address as string} /> : <></>}
      <StyledButton onClick={handleExport}>Export wallet</StyledButton>
      <StyledButton onClick={handleLogout}>Log out</StyledButton>
    </div>
  ) : (
    <></>
  );
};

export default ProfileScreen;
