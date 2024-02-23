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
    <div className="my-flex md:flex-row my-flex-col w-full justify-center">
      <div className="my-flex flex-col space-y-5 md:w-1/4 my-w-full">
        <div className="text-2xl mb-5"> Account</div>
        <ProfileStats profile={profile} />
      </div>
      <div className="my-flex flex-col space-y-5 md:w-1/2 my-w-full">
        <div className="text-2xl mb-5"> NFTs Owned</div>
        <Gallery ids={profile.nftsOwned} />
      </div>
    </div>
  );
};

export default ProfileScreen;
