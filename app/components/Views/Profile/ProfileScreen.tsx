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
      <div className="md:block flex flex-row justify-between"><div>Rating:</div> <div>{profile.ratings}</div></div>
      <div className="md:block flex flex-row justify-between"><div>Solved:</div> <div>{profile.totalSolved}</div></div>
      <div className="md:block flex flex-row justify-between"><div>Attempted:</div> <div>{profile.totalAttempted}</div></div>
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
    <div className="my-flex md:flex-row my-flex-col w-full justify-center ">
      <div className="my-flex flex-col space-y-5 md:w-1/4 my-w-full">
        <div className="md:text-2xl text-lg mb-5"> Account</div>
        <ProfileStats profile={profile} />
      </div>
      <div className="my-flex flex-col space-y-5 md:w-1/2 my-w-full md:mt-0 mt-[20px]">
        <div className="md:text-2xl text-lg mb-5"> NFTs Owned</div>
        <Gallery ids={profile.nftsOwned} />
      </div>
    </div>
  );
};

export default ProfileScreen;
