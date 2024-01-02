// @ts-ignore
import { NextChessground } from "next-chessground";
import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";

import { StyledButton } from "@/components/Layout/StyledButton";
import Link from "next/link";

// Documentation for the NextChessground
// https://github.com/victorocna/next-chessground/blob/master/lib/Chessground.jsx

const PlayScreen = ({ args }: { args?: { puzzleId: string } }) => {
  const puzzleId = Number(args?.puzzleId) || 1;
  const description = `Black just played Qe2, which is a big mistake. White to play and win. I didn't find the move and ended up loosing badly. Can you find it?`;
  const submitter = "0xasdf.eth";
  const maxPuzzleId = 5;

  return (
    <div className="mt-20 flex flex-row justify-center">
      <div className="h-96 w-96">
        <NextChessground fen="8/1kPK4/8/8/8/8/8/8 w - - 0 1" />
      </div>
      <div className="ml-20 max-h-96 flex flex-col justify-between">
        <div>
          <div className="flex flex-row items-center space-x-10">
            {puzzleId > 1 ? (
              <Link href={`/play/${puzzleId - 1}`}>
                <CaretLeftIcon
                  height={40}
                  width={40}
                  className="text-white active:text-slate-400"
                />
              </Link>
            ) : (
              <CaretLeftIcon
                height={40}
                width={40}
                className="text-slate-700"
              />
            )}
            <div className="font-bold text-xl">{`Puzzle #${puzzleId}`}</div>
            {puzzleId < maxPuzzleId ? (
              <Link href={`/play/${puzzleId + 1}`}>
                <CaretRightIcon
                  height={40}
                  width={40}
                  className="text-white active:text-slate-400"
                />
              </Link>
            ) : (
              <CaretRightIcon
                height={40}
                width={40}
                className="text-slate-700"
              />
            )}
          </div>
          <div className="max-w-96 my-5">{description}</div>
          <div className="font-extralight">{`submitted by ${submitter}`}</div>
        </div>
        <div>
          <div className="font-light mb-5 text-sm">{`selected move: --`}</div>
          <StyledButton className="max-w-32" wide={false}>
            Submit
          </StyledButton>
        </div>
      </div>
    </div>
  );
};

export default PlayScreen;
