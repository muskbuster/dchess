import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";
import Confetti from "react-dom-confetti";
import { StyledButton } from "@/components/Styled/Button";
import { FaUndo } from "react-icons/fa";

import useFetchPuzzles from "@/hooks/useFetchPuzzles";
import { canonicalFen, truncateAddress } from "@/utils/general";
import { zeroAddress, Address } from "viem";
import useSubmitSolution from "@/hooks/useSubmitSolution";
import useHasAttempted from "@/hooks/useHasAttempted";
import { ConnectedWallet } from "@privy-io/react-auth";
import useHasSolved from "@/hooks/useHasSolved";
import { MintComponent } from "./MintComponent";
import { BoardAreaComponent } from "./BoardAreaComponent";
import { DrawerComponent } from "./DrawerComponent";
import { useUserInfo, useUserInfoDispatch } from "@/contexts/UserInfoContext";
import useFetchRatings from "@/hooks/useFetchRatings";
import ArtDisplay from "@/components/Common/ArtDisplay";

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
  activeWallet,
}: {
  loggedIn: boolean;
  activeWallet: ConnectedWallet | undefined;
}) => {
  const [problemStatus, setProblemStatus] = useState(ProblemStatus.Attempt);
  const [selectedMove, setSelectedMove] = useState("--");
  const [attempts, setAttempts] = useState(0);
  const [viewOnly, setViewOnly] = useState(false || !loggedIn);
  const [isExploding, setIsExploding] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const puzzleIdParams = useParams().id as string;
  const puzzleId = puzzleIdParams ? Number(puzzleIdParams) : 0;

  const isAttempt = problemStatus.valueOf() == ProblemStatus.Attempt.valueOf();
  const successfulSolved =
    problemStatus.valueOf() == ProblemStatus.Success.valueOf();
  const isFail = problemStatus.valueOf() == ProblemStatus.Fail.valueOf();

  const { data: attempted, refetch: refetchHasAttempted } = useHasAttempted(
    puzzleId,
    activeWallet
  );
  const { data: solved, refetch: refetchHasSolved } = useHasSolved(
    puzzleId,
    activeWallet
  );

  useEffect(() => {
    if (solved) setProblemStatus(ProblemStatus.Success);
    if (attempted && !solved) setProblemStatus(ProblemStatus.Fail);
  }, [attempted, solved]);

  const {
    puzzles,
    error: fetchPuzzlesError,
    loading: fetchPuzzlesLoading,
  } = useFetchPuzzles();

  const userInfo = useUserInfo();
  const dispatch = useUserInfoDispatch();
  const { rating, refetch: refetchRating } = useFetchRatings(userInfo?.address);
  useEffect(() => {
    dispatch({
      type: "UPDATE_RATING",
      payload: {
        rating: rating,
      },
    });
  }, [rating, dispatch]);

  const {
    write: writeSolution,
    isSuccess: isSubmissionSuccess,
    isLoading: isSubmissionLoading,
  } = useSubmitSolution(puzzleId, selectedMove);

  useEffect(() => {
    if (isSubmissionSuccess) {
      refetchHasAttempted();
      refetchHasSolved();
      // adding delay so new rating has propagated
      setTimeout(() => {
        refetchRating();
      }, 3000);
    }
  }, [
    isSubmissionSuccess,
    refetchHasAttempted,
    refetchHasSolved,
    refetchRating,
  ]);

  const onMove = async (chess: any) => {
    setSelectedMove(chess.history()[0]);
    setViewOnly(true);
  };

  const undoMove = () => {
    setSelectedMove("--");
    setAttempts(attempts + 1);
    setViewOnly(false);
  };

  const handleSubmit = async () => {
    if (selectedMove === "--") return;

    try {
      await writeSolution?.();
    } catch (e) {
      console.log(e);
      alert("Something is broken on the app! Please try again later!");
    }
  };

  let description = "...";
  let submitter = truncateAddress(zeroAddress);
  let maxPuzzleId = 0;
  let fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  if (!fetchPuzzlesLoading && !fetchPuzzlesError && puzzles.length > 0) {
    description = puzzles[puzzleId].description;
    submitter = truncateAddress(puzzles[puzzleId].creator);
    // BUG: Chessground doesn't accept 0 as a valid full-move number
    // so we replace 0 with 1 for the full-move number
    fen = canonicalFen(puzzles[puzzleId].fen);
    maxPuzzleId = puzzles.length - 1;
  }

  return (
    <div className="grow grid grid-cols-1 sm:grid-cols-4 justify-center gap-x-20">
      <div className="sm:hidden text-[#E6FA04] pixeloid-sans-bold text-sm pt-3 pb-2.5" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
        List Of Puzzles
      </div>
      <DrawerComponent activeWallet={activeWallet} puzzleId={puzzleId} isDrawerOpen={isDrawerOpen} toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />
      {!isAttempt ? (
        <div className="col-span-2 w-[90%] h-[90%]">
          <ArtDisplay id={puzzleId} />
        </div>
      ) : (
        <BoardAreaComponent
          successfulSolved={successfulSolved}
          fetchPuzzlesLoading={fetchPuzzlesLoading}
          attempts={attempts}
          fen={fen}
          onMove={onMove}
          viewOnly={viewOnly}
        />
      )}
      <div className="flex flex-col items-center justify-center bg-[#010712] rounded-[16px] pixeloid-sans p-5">
        <div className="flex flex-row items-center space-x-10 pixeloid-sans-bold pb-4">
          {puzzleId > 0 ? (
            <Link href={`/play/${puzzleId - 1}`}>
              <CaretLeftIcon
                height={40}
                width={40}
                className="text-white active:text-slate-400"
              />
            </Link>
          ) : (
            <CaretLeftIcon height={40} width={40} className="text-slate-700" />
          )}
          <div className="font-bold text-xl">{`Puzzle #${puzzleId + 1}`}</div>
          {puzzleId < maxPuzzleId ? (
            <Link href={`/play/${puzzleId + 1}`}>
              <CaretRightIcon
                height={40}
                width={40}
                className="text-white active:text-slate-400"
              />
            </Link>
          ) : (
            <CaretRightIcon height={40} width={40} className="text-slate-700" />
          )}
        </div>
        <div className="font-extralight text-xs text-center">{`submitted by ${submitter}`}</div>
        <div className="my-5 text-center">{description}</div>
        {successfulSolved ? (
          <div className="mt-10 font-extrabold text-green-500">solved!</div>
        ) : isFail ? (
          <div className="mt-10 font-extrabold text-red-500">wrong!</div>
        ) : (
          <></>
        )}
        {isAttempt ? (
          <div className="mb-20 w-full">
            <div className="flex flex-row justify-center space-x-2 items-start mt-10">
              <div className="font-light mb-5 text-sm">{`selected move: ${selectedMove}`}</div>
              <FaUndo size={15} onClick={undoMove} />
            </div>
            <StyledButton
              waiting={isSubmissionLoading}
              className="w-full"
              disabled={selectedMove === "--" || !loggedIn}
              onClick={handleSubmit}
            >
              Submit
            </StyledButton>
            <Confetti active={isExploding} config={confettiProps} />
          </div>
        ) : (
          <></>
        )}
        {successfulSolved ? <MintComponent puzzleId={puzzleId} /> : <></>}
      </div>
    </div>
  );
};

export default PlayScreen;
