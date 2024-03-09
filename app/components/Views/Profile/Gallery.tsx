import ArtDisplay from "@/components/Common/ArtDisplay";
import "./Gallery.css"

const Gallery = ({ ids }: { ids: Array<any> }) => {
  return ids.length === 0 ? (
    <div>Buy an NFT to Support puzzle creators</div>
  ) : (
    <div id="gallery-grid" className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 ">
      {ids.map((id) => (
        <div key={id.token_id} className="aspect-square rounded-xl overflow-hidden">
          <ArtDisplay id={id.token_id} />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
