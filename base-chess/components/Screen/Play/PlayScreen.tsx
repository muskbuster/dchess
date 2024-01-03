// @ts-ignore
import { NextChessground } from "next-chessground";
import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";

import Confetti from "react-dom-confetti";
import { StyledButton } from "@/components/Layout/StyledButton";
import { FaUndo } from "react-icons/fa";
import { FaPlusSquare } from "react-icons/fa";
import { FaMinusSquare } from "react-icons/fa";
import { FaArrowRotateLeft } from "react-icons/fa6";
import Link from "next/link";
import { useRef, useState } from "react";
import Image from "next/image";
import placeholder from "@/public/placeholder.png";

// Documentation for the NextChessground
// https://github.com/victorocna/next-chessground/blob/master/lib/Chessground.jsx

enum ProblemStatus {
  Attempt,
  Success,
  Fail,
}

const confettiProps = {
  // angle: 90,
  spread: 360,
  // startVelocity: 40,
  elementCount: 100,
  // dragFriction: 0.12,
  // duration: 3000,
  // stagger: 3,
  // width: "10px",
  // height: "10px",
  // colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
};

const PlayScreen = ({
  loggedIn,
  args,
}: {
  loggedIn: boolean;
  args?: { puzzleId: string };
}) => {
  const [problemStatus, setProblemStatus] = useState(ProblemStatus.Attempt);
  const [selectedMove, setSelectedMove] = useState("--");
  const [attempts, setAttempts] = useState(0);
  const [viewOnly, setViewOnly] = useState(false);
  const [mintImage, setMintImage] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [mintCount, setMintCount] = useState(1);
  const [mintSuccess, setMintSuccess] = useState(false);

  const isAttempt = problemStatus.valueOf() == ProblemStatus.Attempt.valueOf();
  const isSuccess = problemStatus.valueOf() == ProblemStatus.Success.valueOf();
  const isFail = problemStatus.valueOf() == ProblemStatus.Fail.valueOf();

  const ref = useRef();

  const onMove = async (chess: any) => {
    setSelectedMove(chess.history()[0]);
    setViewOnly(true);
  };

  const undoMove = () => {
    setSelectedMove("--");
    setAttempts(attempts + 1);
    setViewOnly(false);
  };

  const flipImage = () => {
    if (isSuccess) setMintImage(!mintImage);
  };

  const handleSubmit = () => {
    setProblemStatus(ProblemStatus.Success);
    setTimeout(() => setIsExploding(true), 100);
  };

  const handleMint = () => {
    setMintSuccess(true);
  };

  const puzzleId = Number(args?.puzzleId) || 1;
  const description = `Black just played Qe2, which is a big mistake. White to play and win. I didn't find the move and ended up loosing badly. Can you find it?`;
  const submitter = "0xasdf.eth (1721)";
  const maxPuzzleId = 5;

  return (
    <div className="mt-20 flex flex-row justify-center">
      <div className="w-1/3 flex flex-col items-center space-y-5">
        <FaArrowRotateLeft
          size={30}
          onClick={flipImage}
          className={`${!isSuccess ? "opacity-5" : "cursor-pointer"}`}
        />
        {mintImage ? (
          <Image src={placeholder} alt="logo" />
        ) : (
          <NextChessground
            key={attempts}
            ref={ref}
            fen="8/1kPK4/8/8/8/8/8/8 w - - 0 1"
            onMove={onMove}
            viewOnly={viewOnly}
          />
        )}
      </div>
      <div className="ml-20 w-1/3 flex flex-col justify-between">
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
          {isSuccess ? (
            <div className="mt-10 font-extrabold text-green-500">solved!</div>
          ) : isFail ? (
            <div className="mt-10 font-extrabold text-red-500">wrong!</div>
          ) : (
            <></>
          )}
        </div>
        {isAttempt ? (
          <div className="mb-20">
            <div className="flex flex-row space-x-2 items-start">
              <div className="font-light mb-5 text-sm">{`selected move: ${selectedMove}`}</div>
              <FaUndo size={15} onClick={undoMove} />
            </div>
            <StyledButton
              className="max-w-32"
              wide={false}
              disabled={selectedMove === "--" || !loggedIn}
              onClick={handleSubmit}
            >
              Submit
            </StyledButton>
          </div>
        ) : (
          <></>
        )}
        {isSuccess ? (
          <div className="mb-20">
            <div className="my-2 flex flex-row items-center space-x-2">
              <FaMinusSquare
                size={30}
                className="text-yellow-300"
                onClick={() => {
                  if (mintCount > 1) setMintCount(mintCount - 1);
                }}
              />
              <div className="text-yellow-300 font-bold">{mintCount}</div>
              <FaPlusSquare
                size={30}
                className="text-yellow-300"
                onClick={() => setMintCount(mintCount + 1)}
              />
            </div>
            <StyledButton className="" wide={false} onClick={handleMint}>
              Mint | 0.0025 ETH
            </StyledButton>
            <Confetti active={isExploding} config={confettiProps} />
            {mintSuccess ? (
              <div className="text-sm font-light mt-2">successfully minted</div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default PlayScreen;
