import { Address, useContractRead } from "wagmi";
import DChess from "@/utils/abi/DChess.json";
import { formatEther } from "viem";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;

const parsetokenURI = (tokenURI: string): string => {
  const base64Token = tokenURI.split(",")[1];
  const decodedBase64Token = atob(base64Token);
  const decodedJSON = JSON.parse(decodedBase64Token);
  const encodedAnimation = decodedJSON.animation_url.split(",")[1];
  return `
  <body style="margin: 0px">
	  <div style="transform: scale(0.3); transform-origin: 0px 0px; width: 300px; height: 300px;">
      ${atob(encodedAnimation)}
    </div>
	</body>`;
};

export default function useFetchArt(puzzleId: number) {
  const { data, isLoading, isError } = useContractRead({
    abi: DChess.abi,
    address: CONTRACT_ADDRESS,
    functionName: "uri",
    args: [puzzleId],
  });

  let art = "<div></div>";
  if (!isError && !isLoading) art = parsetokenURI(data as string);

  return { art, isLoading, isError };
}
