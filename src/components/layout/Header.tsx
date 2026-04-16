import Link from "next/link";
import { FiBriefcase } from "react-icons/fi";
import { Nav } from "./Nav";

export function Header() {
  return (

    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 shadow-md">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-bold text-lg tracking-tight hover:opacity-90 transition-opacity"
          >
            <FiBriefcase size={20} />
            CurrículoPro
          </Link>
          <Nav />
        </div>
      </div>
    </header>
  );
}
