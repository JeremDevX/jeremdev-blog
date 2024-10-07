import Link from "next/link";
import SearchInput from "./Search";

export default function Navbar() {
  return (
    <nav className="flex justify-center items-center bg-accent fixed top-0 left-0 right-0 h-16 z-10 border-b border-accent-darker">
      <div className="flex justify-end items-center max-w-1440 w-full px-8 relative gap-8 ">
        <Link
          href="/"
          className="absolute left-8 h-16 flex items-center w-logo"
        >
          JeremDevLogo
        </Link>
        <div className="flex flex-row gap-8">
          <Link href="/categories">Categories</Link>
          <p>About</p>
        </div>
        <SearchInput />
      </div>
    </nav>
  );
}
