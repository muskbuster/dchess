"use client";

import { usePrivy } from "@privy-io/react-auth";
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
      <div>Solved: {profile.totalSolved}</div>
      <div>Attempted: {profile.totalAttempted}</div>
    </div>
  );
};

const ProfileScreen = ({
  loggedIn,
  address,
}: {
  loggedIn: boolean;
  address: string;
}) => {
  const { logout, exportWallet } = usePrivy();
  const router = useRouter();

  const { profile } = useFetchProfile(address);

  const handleLogout = () => {
    logout();
    router.push(`/`);
  };

  const handleExport = () => {
    exportWallet();
  };

  return loggedIn ? (
    <div className="flex flex-row w-full justify-center mt-10">
      <div className="flex flex-col space-y-5 w-1/4">
        <div className="text-2xl mb-5"> Account</div>
        <ProfileStats profile={profile} />
        <AddressBar address={address} />
        <StyledButton onClick={handleExport}>Export wallet</StyledButton>
        <StyledButton onClick={handleLogout}>Log out</StyledButton>
      </div>
      <div className="flex flex-col space-y-5 w-1/2">
        <div className="text-2xl mb-5"> NFTs Owned</div>
        <Gallery ids={profile.nftsOwned} />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ProfileScreen;
