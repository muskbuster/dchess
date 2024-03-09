import useFetchArt from "@/hooks/useFetchArt";
import IframeResizer from "iframe-resizer-react";

const ArtDisplay = ({ id }: { id: number }) => {
  const { art } = useFetchArt(id);

  return (
    <IframeResizer
      title="Embedded Page"
      srcDoc={art}
      style={{
        minWidth: "100%",
        minHeight: "100%",
        width: '100%'
      }}
    />
  );
};

export default ArtDisplay;
