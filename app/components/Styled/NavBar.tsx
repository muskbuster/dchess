// components/NavBar.js
import { useState } from 'react';
import Link from 'next/link';
import NavToggle from './NavToggle';
import { StyledButton } from './Button';
import { usePrivy } from '@privy-io/react-auth';
import LoggedInBar from './LoggedInBar';

const NavBar = ({ loggedIn = false }) => {
  const { login } = usePrivy();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };
/*--*/
  return (
    <nav className="navbar bg-slate-600 fixed w-full z-20 top-0 start-0 border-b-[1px] border-solid border-white md:border-b-0">
      <div className="flex flex-row justify-between w-full sm:static relative">
        <div className="block md:hidden">
          <NavToggle toggleNav={toggleNav} isOpen={undefined} />
        </div>
        <div className={`md:flex ${isNavOpen ? 'flex-row' : 'hidden'} gap-3 sm:gap-0 sm:space-x-2 space-x-0 sm:pl-0 sm:pr-0 pl-[10px] pr-[10px] sm:static absolute left-0 right-0 top-[100%] bg-slate-600`}>
          <Link href="/play/0" className='sm:inline-block block my-1.5 sm:my-0'>
            <StyledButton className='sm:w-fit my-w-full' wide={false}>Play</StyledButton>
          </Link>
          <Link href="/stats" className='sm:inline-block block my-1.5 sm:my-0'>
            <StyledButton className='sm:w-fit my-w-full' wide={false}>Score</StyledButton>
          </Link>
          <Link href="/create" className='sm:inline-block block my-1.5 sm:my-0'>
            <StyledButton className='sm:w-fit my-w-full' wide={false}>Create</StyledButton>
          </Link>
        </div>
        <div>
          {loggedIn ? (
            <LoggedInBar />
          ) : (
            <StyledButton wide={false} onClick={login}>
              Log in
            </StyledButton>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;