import { FaSquareXTwitter } from "react-icons/fa6";

export const Footer = () => {
  return (
    <footer className="footer z-20 items-center p-2 bg-slate-300 text-black">
      <aside className="items-center grid-flow-col">
        <p>Copyright © 2024 - All right reserved</p>
      </aside>
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <a href="https://twitter.com/0xasdf_eth" target="_blank">
          <FaSquareXTwitter size={25} />
        </a>
      </nav>
    </footer>
  );
};
