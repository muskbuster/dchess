// @ts-ignore
import { NextChessground } from "next-chessground";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { useParams } from "next/navigation";

import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";
import Confetti from "react-dom-confetti";
import { StyledButton } from "@/components/Styled/Button";
import { FaUndo } from "react-icons/fa";
import { FaPlusSquare } from "react-icons/fa";
import { FaMinusSquare } from "react-icons/fa";
import { FaArrowRotateLeft } from "react-icons/fa6";

import NFTVisual from "../Profile/NFTVisual";

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

const PlayScreen = ({ loggedIn }: { loggedIn: boolean }) => {
  const [problemStatus, setProblemStatus] = useState(ProblemStatus.Attempt);
  const [selectedMove, setSelectedMove] = useState("--");
  const [submittedTx, setSubmittedTx] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [viewOnly, setViewOnly] = useState(false);
  const [mintImage, setMintImage] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [mintCount, setMintCount] = useState(1);
  const [mintSuccess, setMintSuccess] = useState(false);
  const puzzleIdParams = useParams().id as string;
  const puzzleId = puzzleIdParams ? Number(puzzleIdParams) : 1;

  const isAttempt = problemStatus.valueOf() == ProblemStatus.Attempt.valueOf();
  const successfulSolved =
    problemStatus.valueOf() == ProblemStatus.Success.valueOf();
  const isFail = problemStatus.valueOf() == ProblemStatus.Fail.valueOf();

  const { wallet: activeWallet } = usePrivyWagmi();

  const ref = useRef();

  const puzzles = {
    loading: false,
    data: {
      puzzles: [
        {
          fen: "r2qkb1r/pp2nppp/3p4/2pNN1B1/2BnP3/3P4/PPP2PPP/R2bK2R w KQkq - 1 0",
          uri: "",
        },
        {
          fen: "1rb4r/pkPp3p/1b1P3n/1Q6/N3Pp2/8/P1P3PP/7K w - - 1 0",
          uri: "",
        },
        {
          fen: "4kb1r/p2n1ppp/4q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 1 0",
          uri: "",
        },
      ],
    },
  };

  /*
  useEffect(() => {
    // Initial load
    if (hasSolvedPuzzle.isSuccess && hasSolvedPuzzle.data) {
      setProblemStatus(ProblemStatus.Success);
    } else if (hasAttemptedPuzzle.isSuccess && hasAttemptedPuzzle.data) {
      setProblemStatus(ProblemStatus.Fail);
    }
    // On tx submit
    else if (waitForTx && waitForTx.data?.logs.length == 4) {
      setProblemStatus(ProblemStatus.Success);
    } else if (waitForTx && waitForTx.data?.logs.length == 3) {
      setProblemStatus(ProblemStatus.Fail);
    }

    if (waitForMint.data && waitForMint.data?.logs.length == 2) {
      setMintSuccess(true);
    }
  }, [waitForTx, setSubmittedTx, waitForMint]);
  */

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
    if (successfulSolved) setMintImage(!mintImage);
  };

  const handleMint = () => {
    // mintWrite({ args: [puzzleId - 1] });
  };

  const description = `Black just played Qe2, which is a big mistake. White to play and win. I didn't find the move and ended up loosing badly. Can you find it?`;
  const submitter = "0xasdf.eth (1721)";
  const maxPuzzleId = !puzzles.loading ? puzzles.data.puzzles.length : 1;

  const handleSubmit = async () => {
    // setSubmittedTx(true);
    // write({
    //   args: [puzzleId - 1, encodePacked(["string"], [selectedMove])],
    // });
  };

  return (
    <div className="mt-20 flex flex-row justify-center">
      <div className="w-1/3 flex flex-col items-center space-y-5">
        <FaArrowRotateLeft
          size={30}
          onClick={flipImage}
          className={`${!successfulSolved ? "opacity-5" : "cursor-pointer"}`}
        />
        {mintImage ? (
          puzzles.loading ? (
            <div>...loading</div>
          ) : (
            <NFTVisual uri={puzzles.data.puzzles[puzzleId - 1].uri} />
          )
        ) : puzzles.loading ? (
          <div>loading</div>
        ) : (
          <NextChessground
            key={attempts}
            ref={ref}
            fen={puzzles.data.puzzles[puzzleId - 1].fen}
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
          {successfulSolved ? (
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
        {successfulSolved ? (
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
