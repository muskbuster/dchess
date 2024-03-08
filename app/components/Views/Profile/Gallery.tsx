import ArtDisplay from "@/components/Common/ArtDisplay";

const Gallery = ({ ids }: { ids: Array<any> }) => {
  return ids.length === 0 ? (
    <div>Buy an NFT to Support puzzle creators</div>
  ) : (
    <div className="grid gap-4 grid-cols-[300px_auto]">
      {ids.map((id) => (
        <div key={id.token_id} className="w-[300px] h-[300px]">
          <ArtDisplay id={id.token_id} />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
