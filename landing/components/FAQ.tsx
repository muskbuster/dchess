import React from "react";

export const FAQ = () => {
  const q1 = `What is Virtuoso Club?`;
  const a1 = `Virtuoso Club is an experimental take on building a Chess protocol`;

  const q2 = `Why do we need a Chess protocol?`;
  const a2_1 = `Traditional platforms are closed ecosystems. \
User profiles with players' history and ratings \
exist within the permissioned walled gardens -- resulting in disparate reputation systems \
that cannot be easily translated.`;
  const a2_2 = `No single platform should solely be responsible for the upkeep of \
the game. A recent example of this is Chess.com's controversial \
decision of banning Hans Niemann and accusing him of cheating without \
providing sufficient proof which created a stir among the chess community.`;

  return (
    <div className="flex flex-col lg:max-w-[700px] pixeloid-sans">
      <div className="">
        <h2 className={`mb-4 text-xl sm:text-2xl pixeloid-sans-bold`}>{q1}</h2>
        <div className={`max-w-[750px]`}>
          <p className="text-sm sm:text-base">{a1}</p>
        </div>
      </div>
      <div className="lg:mt-10 mt-5">
        <h2 className={`mb-4 text-xl sm:text-2xl pixeloid-sans-bold`}>{q2}</h2>
        <div className={`max-w-[750px]`}>
          <p className="text-sm sm:text-base">{a2_1}</p>
          <br />
          <p className="text-sm sm:text-base">{a2_2}</p>
        </div>
      </div>
    </div>
  );
};
