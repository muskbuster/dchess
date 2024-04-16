import { useQuery } from "@tanstack/react-query";

interface PointsResponse {
  points: number;
}

async function getPoints(userAddress: string | undefined) {
  if (!userAddress) return null;

  return (await fetch(`/api/points/${userAddress}`).then((res) =>
    res.json()
  )) as PointsResponse;
}

export default function useFetchPoints(userAddress: string | undefined) {
  const { isError, isLoading, data, error } = useQuery<PointsResponse | null>({
    queryKey: ["get-points", userAddress],
    queryFn: () => getPoints(userAddress),
  });

  let points = "0000";
  if (isError) console.log(error);

  if (!isError && !isLoading && data) {
    points = data.points.toString();
  }

  return { isLoading, points };
}
