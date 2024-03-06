import { FAQ } from "@/components/FAQ";

export default function Home() {
  const q3 = `How does Virtuoso Club work?`;
  const a3_1 = `The protocol is designed such that it incentivizes “good” action that benefit the game of Chess. It introduces a new layer of governance.`;
  const a3_2 = `As of today, Virtuoso Club's serves as a training platform to learn the game of chess:`;
  const cards = [
    {
      title: 'a3_2_1',
      desc: `Players can solve puzzles build their chess ratings`,
      className: 'bg-pink-200 rounded-[16px] w-1/3 p-12 flex items-center justify-center bg-gradient-to-r from-[#071226] to-[#393b2c]',
    },
    {
      title: 'a3_2_2',
      desc: `Mint NFTs to gain privileges and support creators`,
      className: 'bg-pink-200 rounded-[16px] w-1/3 p-12 flex items-center justify-center bg-gradient-to-r from-[#393b2c] to-[#3b3d27]',
    },
    {
      title: 'a3_2_3',
      desc: `Players can create puzzles and earn for their supporting the ecosystem`,
      className: 'bg-pink-200 rounded-[16px] w-1/3 p-12 flex items-center justify-center bg-gradient-to-r from-[#393b2c] to-[#071226]',
    },
  ]
  const a3_3 = `In future, Virtuoso Club can offer competitive tournaments for cash prizes. Live stream games and allow audience to engage. And much more.`;
  const a3_3_extra = `Virtuoso Club is currently only deployed on Base Chain`;
  
  return (
    <main className="px-10">
      <div className="flex lg:flex-row md:flex-col-reverse flex-col-reverse justify-center items-center py-24">
        <div className="w-full lg:w-2/3 flex flex-col justify-center">
          <FAQ />
        </div>
        <div className="w-full lg:w-1/3 mr-0 flex flex-col items-center ">
          <iframe
            className="md:w-[600px] md:h-[600px] w-[87vw] h-[87vw] rounded-lg overscroll-hidden"
            src="https://www.fiveoutofnine.com/api/chess/asset/2"
            height={600}
            width={600}
          />
          <div className="mt-2 text-xs opacity-30">art credit: fiveoutofnine</div>
        </div>
      </div>
      <div className="text-center">
        <h2 className={`mb-6 text-2xl pixeloid-sans-bold`}>{q3}</h2>
        <div className={`pixeloid-sans`}>
          <p className="mb-4">{a3_1}</p>
          <p className="mb-8">{a3_2}</p>
          <div className="mb-4 flex gap-x-5 justify-center pixeloid-sans-bold text-lg text-[#E6FA04]">
            {cards.map(card => <div className={`${card.className}`}>{card.desc}</div>)}
          </div>
          <br/>
          <p>{a3_3}</p>
          <br/><br/><br/><br/>
        </div>
      </div>
    </main>
  );
}
