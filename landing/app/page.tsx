import Image from "next/image";
import logo from "@/public/logo.png";
import { FAQ } from "@/components/FAQ";
import { readFileSync } from "fs";

export default function Home() {
  return (
    <main className="flex flex-row justify-center items-center">
      <div className="w-2/3 flex flex-col">
        <div className="flex flex-row space-x-5 items-center">
          <Image src={logo} alt="logo" width={40} />
          <p className="font-mono text-4xl">Virtuoso Club</p>
        </div>
        <FAQ />
      </div>
      <div className="w-1/3 mr-40">
        <iframe
          src="https://www.fiveoutofnine.com/api/chess/asset/2"
          height={500}
          width={500}
        />
      </div>
    </main>
  );
}
