import { tokenURIToHtml } from "../../../../contracts/utils/frontend";

type NFTData = {
  id: string;
  uri: string;
};

const NFTDeck = ({ nfts }: { nfts: Array<NFTData> }) => {
  console.log(
    "nft data",
    nfts.map((nft) => tokenURIToHtml(nft.uri))
  );

  return nfts.length === 0 ? (
    <div>Buy an NFT to Support puzzle creators</div>
  ) : (
    <div className="flex direction=col">
      {nfts.map((nft) => (
        <iframe
          style={{ width: "250px", height: "250px" }}
          key={nft.id}
          srcDoc={tokenURIToHtml(nft.uri)}
        ></iframe>
      ))}
    </div>
  );
};

export default NFTDeck;
