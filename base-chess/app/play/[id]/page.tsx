import PrivyWrapper from "@/components/Common/PrivyWrapper";

const PlayPage = ({ params }: { params: { id: string } }) => {
  const puzzleId = params.id;
  return (
    <section className="w-full">
      <PrivyWrapper page="Play" args={{ puzzleId }} />
    </section>
  );
};

export default PlayPage;
