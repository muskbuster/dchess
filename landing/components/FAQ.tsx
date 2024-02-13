import React from "react";

export const FAQ = () => {
  const q1 = `What is Virtuoso Club?`;
  const a1_1 = `Over the last two decades or so, platforms \
such as chess.com have amassed too much power. There are no incentives for fair play \
and cheating is rampant. Chess.com has established itself as the guardians of the game \
when it was never designed as such.`;
  const a1_2 = `Virtuoso Club is a web3 take on chess. Establish \
and own your ratings. Be rewarded for maintaining the ecosystem. \
Punish wrongful behavior. And help us find \
the next chess virtuoso!`;

  const q2 = `How do I play it?`;
  const a2_1 = `Virtuoso Club is currently deployed on Base L2. \
In other to play the game, you must connect to a funded crypto wallet. \
Virtuoso does not cost anything to play (however Base L2 does take a small fee). \
Virtuoso allows you to mint NFTs that unlocks different capabilities.`;
  const a2_2 = `At the present moment, we only puzzles and ratings. However, tournaments are \
coming soon!`;

  const q3 = `How does it work?`;
  const a3 = `Virtuoso Club is fully on-chain. \
This allows you as a player to build your reputation \
which will go on to live forever.`;

  return (
    <div className="flex flex-col mt-10">
      <div className="mt-10">
        <h2 className={`mb-3 text-2xl font-semibold`}>{q1}</h2>
        <div className={`max-w-[750px] text-sm opacity-60`}>
          <p>{a1_1}</p>
          <br />
          <p>{a1_2}</p>
        </div>
      </div>
      <div className="mt-10">
        <h2 className={`mb-3 text-2xl font-semibold`}>{q2}</h2>
        <div className={`max-w-[750px] text-sm opacity-60`}>
          <p>{a2_1}</p>
          <p>{a2_2}</p>
        </div>
      </div>
      <div className="mt-10">
        <h2 className={`mb-3 text-2xl font-semibold`}>{q3}</h2>
        <div className={`max-w-[750px] text-sm opacity-60`}>{a3}</div>
      </div>
    </div>
  );
};
