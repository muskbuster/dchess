import { useQuery } from "@tanstack/react-query";

const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

async function getPrices() {
  const response = await fetch(
    `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ETHERSCAN_API_KEY}`
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
}

export default function useETHConversion() {
  const { isError, isLoading, data, error } = useQuery<any>({
    queryKey: ["get-price"],
    queryFn: () => getPrices(),
  });

  let ethusd = 0;
  if (!isError && !isLoading) {
    ethusd = Number(data!.result.ethusd);
  }

  return { isLoading, ethusd };
}
