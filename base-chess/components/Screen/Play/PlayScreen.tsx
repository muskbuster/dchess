// @ts-ignore
import { NextChessground } from "next-chessground";

// Documentation for the NextChessground
// https://github.com/victorocna/next-chessground/blob/master/lib/Chessground.jsx

const PlayScreen = () => {
  return (
    <div className="h-96 w-96">
      <NextChessground fen="8/1kPK4/8/8/8/8/8/8 w - - 0 1" />
    </div>
  );
};

export default PlayScreen;
