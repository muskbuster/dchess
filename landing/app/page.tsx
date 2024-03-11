"use client";

import { FAQ } from "@/components/FAQ";
import IframeResizer from "iframe-resizer-react";

export default function Home() {
  const q3 = `How does Virtuoso Club work?`;
  const a3_1 = `We believe the key is to provide incentives that reward Chess "creators" for promoting and maintaining the game`;
  const a3_2 = `As of today, Virtuoso Club allows players to get better at the game of chess by solving puzzles`;
  const cards = [
    {
      title: "a3_2_1",
      desc: `Players solve puzzles and mint NFTs to gain privileges`,
      className:
        "bg-pink-200 rounded-[16px] w-full sm:w-1/3 p-6 sm:p-12 flex items-center justify-center bg-gradient-to-r from-[#071226] to-[#393b2c]",
    },
    {
      title: "a3_2_2",
      desc: `Players build ratings and compete with one another`,
      className:
        "bg-pink-200 rounded-[16px] w-full sm:w-1/3 p-6 sm:p-12 flex items-center justify-center bg-gradient-to-r from-[#3b3d27] to-[#3b3d27]",
    },
    {
      title: "a3_2_3",
      desc: `Players can create puzzles and earn ETH`,
      className:
        "bg-pink-200 rounded-[16px] w-full sm:w-1/3 p-6 sm:p-12 flex items-center justify-center bg-gradient-to-r from-[#393b2c] to-[#071226]",
    },
  ];
  const a3_3 = `In the future, we will allow players to play full games, offer competitive tournaments, and allow the audience to engage`;
  const a3_3_extra = `Virtuoso Club is currently only deployed on Base Chain`;

  return (
    <main className="px-3 sm:px-10">
      <div className="flex lg:flex-row md:flex-col flex-col justify-center items-center gap-y-8 py-10 sm:py-24">
        <div className="w-full lg:w-2/3 flex flex-col justify-center">
          <FAQ />
        </div>
        <div className="lg:w-1/3 mr-0 flex flex-col items-center rounded-lg overflow-hidden">
          <IframeResizer
            src="https://www.fiveoutofnine.com/api/chess/asset/220"
            style={{
              minWidth: "100%",
              aspectRatio: 1 / 1,
            }}
          />
          <div className="mt-2 text-xs opacity-30">
            art credit: fiveoutofnine
          </div>
        </div>
      </div>
      <div className="text-center">
        <h2 className={`mb-6 text-xl sm:text-2xl pixeloid-sans-bold`}>{q3}</h2>
        <div className={`pixeloid-sans`}>
          <p className="mb-4 text-sm sm:text-base">{a3_1}</p>
          <p className="mb-8 text-sm sm:text-base">{a3_2}</p>
          <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center pixeloid-sans-bold text-sm sm:text-lg text-[#E6FA04]">
            {cards.map((card, id) => (
              <div key={id} className={`${card.className}`}>
                {card.desc}
              </div>
            ))}
          </div>
          <br />
          <p className="text-sm sm:text-base">{a3_3}</p>
          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
    </main>
  );
}
