import useFetchArt from "@/hooks/useFetchArt";

const ArtDisplay = ({ id }: { id: number }) => {
  const { art } = useFetchArt(id);

  return (
    <iframe title="Embedded Page" width="300px" height="300px" srcDoc={art} />
  );
};

export default ArtDisplay;
