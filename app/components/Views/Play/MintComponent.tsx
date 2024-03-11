import { StyledButton } from "@/components/Styled/Button";
import useFetchMintPrice from "@/hooks/useFetchMintPrice";
import useMint from "@/hooks/useMint";
import { useEffect, useState } from "react";
import { FaPlusSquare } from "react-icons/fa";
import { FaMinusSquare } from "react-icons/fa";

export const MintComponent = ({ puzzleId }: { puzzleId: number }) => {
  const [mintCount, setMintCount] = useState(1);
  const [mintSuccess, setMintSuccess] = useState(false);

  const { mintPrice } = useFetchMintPrice(mintCount);
  const { write, refetch, isSuccess } = useMint(puzzleId, mintCount, mintPrice);

  const handleMint = async () => {
    try {
      await refetch();
      await write?.();
    } catch (e) {
      console.log(e);
      alert("Unable to mint! Please try again later!");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setMintSuccess(true);
    }
  }, [isSuccess]);

  const tooltip = `minting supports puzzle creators`;

  return (
    <div>
      <div className="my-2 flex flex-row items-center space-x-2 justify-center">
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
      <div>
        <StyledButton className="w-full" wide={false} onClick={handleMint}>
          Mint | {mintPrice} ETH
        </StyledButton>
      </div>
      {mintSuccess ? (
        <div className="text-sm font-light mt-2">successfully minted</div>
      ) : (
        <div className="flex items-center mt-4">
          <img src="/icons/Exclaim.png" alt="" className="mr-3" />
          <div className="text-sm font-extralight">{tooltip}</div>
        </div>
      )}
    </div>
  );
};
