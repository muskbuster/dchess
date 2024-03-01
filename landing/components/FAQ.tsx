import React from "react";

export const FAQ = () => {
  const q1 = `What is Virtuoso Club?`;
  const a1 = `Virtuoso Club is an experimental take on building a Chess protocol`;

  const q2 = `Why do we need a Chess protocol?`;
  const a2_1 = `Traditional platforms are closed ecosystems. \
User profiles with players' history and ratings \
exist within the permissioned walled gardens -- resulting in disparate reputation systems \
that can not be easily translated.`;
  const a2_2 = `No single platform should solely be responsible for the upkeep of \
the game. A recent example of this is Chess.com's controversial \
decision of banning Hans Niemann and accusing him of cheating without \
providing sufficient proof which created a stir among the chess community.`;

  const q3 = `How does Virtuoso Club work?`;
  const a3_1 = `The protocol is designed such that it incentivizes \
“good” action that benefit the game of Chess. It introduces a new layer of governance.`;
  const a3_2 = `As of today, Virtuoso Club's serves as a training platform to learn \
the game of chess:`;
  const a3_2_1 = `a) Players can solve puzzles build their chess ratings`;
  const a3_2_2 = `b) Mint NFTs to gain privileges and support creators`;
  const a3_2_3 = `c) Players can create puzzles and earn for their supporting the ecosystem`;
  const a3_3 = `In future, Virtuoso Club can offer \
competitive tournaments for cash prizes. Live stream games and allow audience \
to engage. And much more.`;
  const a3_3_extra = `Virtuoso Club is currently only deployed on Base Chain`;

  return (
    <div className="flex flex-col lg:mt-10 lg:max-w-[700px]">
      <div className="lg:mt-10 mt-5">
        <h2 className={`mb-3 text-2xl font-semibold`}>{q1}</h2>
        <div className={`max-w-[750px] text-sm opacity-70`}>
          <p>{a1}</p>
        </div>
      </div>
      <div className="lg:mt-10 mt-5">
        <h2 className={`mb-3 text-2xl font-semibold`}>{q2}</h2>
        <div className={`max-w-[750px] text-sm opacity-70`}>
          <p>{a2_1}</p>
          <br />
          <p>{a2_2}</p>
        </div>
      </div>
      <div className="lg:mt-10 mt-5">
        <h2 className={`mb-3 text-2xl font-semibold`}>{q3}</h2>
        <div className={`max-w-[750px] text-sm opacity-70`}>
          <p>{a3_1}</p>
          <br />
          <p>{a3_2}</p>
          <p>{a3_2_1}</p>
          <p>{a3_2_2}</p>
          <p>{a3_2_3}</p>
          <br />
          <p>{a3_3}</p>
        </div>
      </div>
    </div>
  );
};
