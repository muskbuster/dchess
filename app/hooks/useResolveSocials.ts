import { useQuery } from "@tanstack/react-query";

interface ResolveSocialsResponse {}

async function resolveSocials(userAddress: string | undefined) {
  if (!userAddress) return null;

  return (await fetch(`/api/resolve-socials/${userAddress}`).then((res) =>
    res.json()
  )) as ResolveSocialsResponse;
}

export default function useResolveSocials(userAddress: string | undefined) {
  const { isError, isLoading, data, error } =
    useQuery<ResolveSocialsResponse | null>({
      queryKey: ["resolve-socials", userAddress],
      queryFn: () => resolveSocials(userAddress),
    });

  if (isError) console.log(error);

  if (!isError && !isLoading && data) {
    // points = data.points.toString();
  }

  return { isLoading };
}
