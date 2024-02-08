import ArtDisplay from "@/components/Common/ArtDisplay";

const Gallery = ({ ids }: { ids: Array<any> }) => {
  return ids.length === 0 ? (
    <div>Buy an NFT to Support puzzle creators</div>
  ) : (
    <div className="grid gap-4 grid-cols-[300px_auto]">
      {ids.map((id) => (
        <ArtDisplay key={id.token_id} id={id.token_id} />
      ))}
    </div>
  );
};

export default Gallery;
