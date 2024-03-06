import { FaSquareXTwitter } from "react-icons/fa6";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#E6FA040F] via-[#E6FA04CF] to-[#E6FA040F]">
      <div className="footer z-20 items-center py-2.5 bg-[#010712] mt-0.5 pixeloid-sans text-xs px-6">
        <aside className="items-center grid-flow-col">
          <p>Copyright © 2024 - All right reserved</p>
        </aside>
        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <a href="https://twitter.com/0xasdf_eth" target="_blank">
            <img src="/icons/X.png" alt="x" className="h-6"/>
          </a>
        </nav>
      </div>
    </footer>
  );
};
