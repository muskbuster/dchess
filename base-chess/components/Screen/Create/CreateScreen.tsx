// @ts-ignore
import { NextEditor } from "next-chessground";
import { useRef } from "react";

const CreateScreen = () => {
  const ref = useRef();

  const handleSelect = (fen: any) => {
    //
  };

  return (
    <div className="h-96 w-96">
      <NextEditor ref={ref} onSelect={handleSelect} />
    </div>
  );
};

export default CreateScreen;
