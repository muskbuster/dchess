import { tokenURIToHtml } from "../../../../contracts/utils/frontend";

const NFTVisual = ({ uri }: { uri: string }) => {
  return (
    <iframe
      style={{ width: "250px", height: "250px" }}
      srcDoc={tokenURIToHtml(uri)}
    ></iframe>
  );
};

export default NFTVisual;
