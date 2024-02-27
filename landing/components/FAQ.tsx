import React from "react";

export const FAQ = () => {
  const q1 = `What is Virtuoso Club?`;
  const a1 = `Virtuoso Club is an experimental take on building a Chess protocol`;

  const q2 = `Why do we need a Chess protocol?`;
  const a2 = `Traditional chess platforms are closed ecosystems: \
game history, ratings live on a centralized database. In addition to that, \
platforms such as Chess.com \
are quite influential to the game. A recent example of this is Chess.com's controversial \
decision of banning Hans Niemann and accusing him of cheating without \
sufficient proof.`;

  const q3 = `How does Virtuoso Club work?`;
  const a3_1 = `As of today, Virtuoso Club's primary responsibility is to assign on-chain \
ratings to chess players. Players can solve puzzles, mint NFTs and \
create their own puzzles. The protocol is designed such as that it incentivizes \
“good” action that benefit the game of Chess. In future, Virtuoso Club can offer \
competitive tournaments for cash prizes. Live stream games and allow audience \
to engage. And much more.`;
  const a3_2 = `Virtuoso Club is only deployed on Base`;

  return (
    <div className="flex flex-col lg:mt-10">
      <div className="lg:mt-10 mt-5">
        <h2 className={`mb-3 text-2xl font-semibold`}>{q1}</h2>
        <div className={`max-w-[750px] text-sm opacity-70`}>
          <p>{a1}</p>
        </div>
      </div>
      <div className="lg:mt-10 mt-5">
        <h2 className={`mb-3 text-2xl font-semibold`}>{q2}</h2>
        <div className={`max-w-[750px] text-sm opacity-70`}>
          <p>{a2}</p>
        </div>
      </div>
      <div className="lg:mt-10 mt-5">
        <h2 className={`mb-3 text-2xl font-semibold`}>{q3}</h2>
        <div className={`max-w-[750px] text-sm opacity-70`}>
          <p>{a3_1}</p>
          <br />
          <p>{a3_2}</p>
        </div>
      </div>
    </div>
  );
};
