import { useQuery, gql } from "@apollo/client";
import { Address } from "viem";

export const USER_RATING = gql`
  query FetchRatingsByUser($userAddress: Bytes) {
    userRatingChangeds(where: { user: $userAddress }, orderBy: blockTimestamp) {
      newUserRating
    }
  }
`;

export default function useFetchRatings(address: Address | undefined) {
  const { data, loading, error, refetch } = useQuery(USER_RATING, {
    variables: { userAddress: address },
  });

  let rating = "1000";
  if (!loading && !error) {
    rating =
      data?.userRatingChangeds[data?.userRatingChangeds.length - 1]
        ?.newUserRating || rating;
  }

  return { rating, loading, error, refetch };
}
