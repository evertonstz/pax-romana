import { Cloudy } from 'lucide-react';

import { ThemeDropdownButton } from '.';

const Navbar = () => {
  return (
    <div
      className="mx-auto flex h-16 w-screen items-center border-b border-neutral-300 bg-white px-6 
      dark:border-neutral-800 dark:bg-black"
    >
      <div className="flex gap-3">
        <Cloudy size={40} />
        <h1 className="select-none scroll-m-20 text-4xl font-extrabold tracking-tight">
          Pax Romana
        </h1>
      </div>
      <div className="flex-grow bg-white"></div>
      <ThemeDropdownButton />
    </div>
  );
};

export default Navbar;
