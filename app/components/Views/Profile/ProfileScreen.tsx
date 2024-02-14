"use client";

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
  const { profile } = useFetchProfile(address);

  return (
    <div className="flex flex-row w-full justify-center">
      <div className="flex flex-col space-y-5 w-1/4">
        <div className="text-2xl mb-5"> Account</div>
        <ProfileStats profile={profile} />
      </div>
      <div className="flex flex-col space-y-5 w-1/2">
        <div className="text-2xl mb-5"> NFTs Owned</div>
        <Gallery ids={profile.nftsOwned} />
      </div>
    </div>
  );
};

export default ProfileScreen;
