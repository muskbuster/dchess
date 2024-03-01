import { useEffect, useState } from "react";
import { Address, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

export default function useEnsName(userAddress: string) {
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(process.env.NEXT_PUBLIC_ALCHEMY_HTTPS_MAINNET),
  });

  const [resolvedAddress, setResolvedAddress] = useState(userAddress);

  useEffect(() => {
    const getEnsName = async () => {
      const ensName = await publicClient.getEnsName({
        address: userAddress as Address,
      });

      if (ensName) setResolvedAddress(ensName);
    };

    getEnsName();
  }, [userAddress, publicClient]);

  return { resolvedAddress };
}
