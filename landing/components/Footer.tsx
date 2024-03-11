import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#E6FA040F] via-[#E6FA04CF] to-[#E6FA040F] text-white">
      <div className="footer flex justify-between z-20 items-center py-2.5 bg-[#010712] mt-0.5 pixeloid-sans text-xs px-3 sm:px-10">
        <aside className="items-center grid-flow-col">
          <p>Copyright © 2024 - All right reserved</p>
        </aside>
        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <a href="https://twitter.com/0xasdf_eth" target="_blank">
            <Image src="/icons/X.png" alt="x" width={24} height={24} />
          </a>
        </nav>
      </div>
    </footer>
  );
};
