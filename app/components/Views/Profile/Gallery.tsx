import NFTVisual from "@/components/Common/ArtDisplay";

const Gallery = ({ ids }: { ids: Array<number> }) => {
  return ids.length === 0 ? (
    <div>Buy an NFT to Support puzzle creators</div>
  ) : (
    <div className="">
      {ids.map((id) => (
        <NFTVisual key={id} id={id} />
      ))}
    </div>
  );
};

export default Gallery;
