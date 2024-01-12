import NFTVisual from "./NFTVisual";

type NFTData = {
  id: string;
  uri: string;
};

const NFTDeck = ({ nfts }: { nfts: Array<NFTData> }) => {
  return nfts.length === 0 ? (
    <div>Buy an NFT to Support puzzle creators</div>
  ) : (
    <div className="flex direction=col">
      {nfts.map((nft) => (
        <NFTVisual key={nft.id} uri={nft.uri} />
      ))}
    </div>
  );
};

export default NFTDeck;
