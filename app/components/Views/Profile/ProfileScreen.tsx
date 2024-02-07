"use client";

import { ConnectedWallet, usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

import { StyledButton } from "@/components/Styled/Button";
import AddressBar from "@/components/Common/AddressBar";
import useFetchProfile from "@/hooks/useFetchProfile";
import Gallery from "@/components/Views/Profile/Gallery";

const ProfileStats = ({
  profile,
}: {
  profile: {
    ratings: number;
    totalSolved: number;
    totalAttempted: number;
  };
}) => {
  return (
    <div>
      <div>Rating: {profile.ratings}</div>
      <div>Solves: {profile.totalSolved}</div>
      <div>Created: {profile.totalAttempted}</div>
    </div>
  );
};

const ProfileScreen = ({ activeWallet }: { activeWallet: ConnectedWallet }) => {
  const { authenticated, logout, exportWallet } = usePrivy();
  const router = useRouter();

  const { profile, isLoading } = useFetchProfile(activeWallet.address);

  const handleLogout = () => {
    logout();
    router.push(`/`);
  };

  const handleExport = () => {
    exportWallet();
  };

  return authenticated ? (
    <div className="flex flex-row w-full justify-around mt-10">
      <div className="flex flex-col space-y-5 w-1/3">
        <div className="text-2xl mb-5"> Account</div>
        <ProfileStats profile={profile} />
        <AddressBar address={activeWallet.address as string} />
        <StyledButton onClick={handleExport}>Export wallet</StyledButton>
        <StyledButton onClick={handleLogout}>Log out</StyledButton>
      </div>
      <div className="flex flex-col space-y-5 w-1/3">
        <div className="text-2xl mb-5"> NFTs Owned</div>
        <Gallery ids={profile.nftsOwned} />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ProfileScreen;
