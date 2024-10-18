"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isPostPage = pathname.startsWith("/blog/posts");

  return (
    <footer
      className={`h-auto md:h-20 bg-accent w-full flex justify-center items-center text-base mt-auto ${isPostPage && "hidden"}`}
    >
      <div className="max-w-1440 w-full flex gap-4 py-4 md:py-0 md:gap-10 justify-between items-center  flex-col md:flex-row px-8">
        <div className="flex items-center">
          <Image src={"/wolf-only.svg"} height={50} width={50} alt="" />
          <span className="mt-6 font-bold text-xl">TechHowlerX</span>
        </div>
        <div className="flex gap-6">
          <Link
            href={"/"}
            className="hover:text-primary hover:underline underline-offset-4"
          >
            About
          </Link>
          <Link
            href={"/"}
            className="hover:text-primary hover:underline underline-offset-4"
          >
            Terms of Use
          </Link>
          <Link
            href={"/"}
            className="hover:text-primary hover:underline underline-offset-4"
          >
            GitHub
          </Link>
          <Link
            href={"/"}
            className="hover:text-primary hover:underline underline-offset-4"
          >
            Support me
          </Link>
        </div>
        <div>
          <span>© 2024 JeremDevX</span>
        </div>
      </div>
    </footer>
  );
}
