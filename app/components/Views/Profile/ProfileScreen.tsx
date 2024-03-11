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
    <div className="text-sm sm:text-base">
      <div className="flex justify-between pb-3">
        <span>Rating:</span>
        <span className="text-[#E6FA04]">{profile.ratings}</span> 
      </div>
      <div className="flex justify-between pb-3">
        <span>Solved:</span>
        <span className="text-[#E6FA04]">{profile.totalSolved}</span>
      </div>
      <div className="flex justify-between pb-3">
        <span>Attempted:</span>
        <span className="text-[#E6FA04]">{profile.totalAttempted}</span>
      </div>
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
    <div className="grid grid-cols-1 sm:grid-cols-3 w-full justify-center gap-x-10 gap-y-4 grow pixeloid-sans sm:px-20">
      <div className="sm:col-span-1 flex flex-col sm:space-y-5 bg-[#010712] rounded-[16px] p-4 sm:p-10">
        <div className="text-base sm:text-xl mb-5 pixeloid-sans-bold"> Account</div>
        <ProfileStats profile={profile} />
      </div>
      <div className="sm:col-span-2 flex flex-col sm:space-y-5 bg-[#010712] rounded-[16px] p-4 sm:p-10">
        <div className="text-base sm:text-xl mb-5 pixeloid-sans-bold"> NFTs Owned</div>
        <Gallery ids={profile.nftsOwned} />
      </div>
    </div>
  );
};

export default ProfileScreen;
