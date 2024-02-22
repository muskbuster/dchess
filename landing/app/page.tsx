import Image from "next/image";
import logo from "@/public/logo.png";
import { FAQ } from "@/components/FAQ";
import { readFileSync } from "fs";
export default function Home() {
  return (
    <main className="flex lg:flex-row md:flex-col-reverse flex-col-reverse justify-center items-center ">
      <div className="w-full lg:w-2/3 flex flex-col">
        <div className="lg:flex flex-row space-x-5 items-center hidden ">
          <Image src={logo} alt="logo" width={40} />
          <p className="font-mono text-4xl">Virtuoso Club</p>
        </div>
        <FAQ />
      </div>
      <div className="w-full lg:w-1/3 lg:mr-40 mr-0">
        <iframe className="md:w-[500px] md:h-[500px] w-[87vw] h-[87vw]"
          src="https://www.fiveoutofnine.com/api/chess/asset/2"
          height={500}
          width={500}
        />
      </div>
    </main>

  );
}
