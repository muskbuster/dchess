import PrivyWrapper from "@/components/Common/PrivyWrapper";

const ProfilePage = async ({ params }: { params: { address: string } }) => {
  const userAddress = params.address;
  return (
    <section className="w-full">
      <PrivyWrapper page="Profile" args={{ address: userAddress }} />
    </section>
  );
};

export default ProfilePage;
