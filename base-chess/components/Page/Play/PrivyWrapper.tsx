"use client";

import { PrivyProvider } from "@privy-io/react-auth";

const PrivyWrapper = () => {
  return (
    <PrivyProvider appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}>
      Test
    </PrivyProvider>
  );
};

export default PrivyWrapper;
