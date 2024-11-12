"use client";

import Link from "next/link";
import SearchInput from "./Search";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCloseOnClickAway } from "@/utils/useOnClickAway";

export default function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const pathname = usePathname();
  const isBlogPage = pathname.startsWith("/blog");
  const isToolPage = pathname.startsWith("/tools");

  const hamburgerLine = `h-0.5 w-6 my-1 bg-foreground transition ease transform duration-300`;

  const handleToggleMenu = () => {
    setToggleMenu(!toggleMenu);
  };

  const closeMenu = () => {
    setToggleMenu(false);
  };

  const handleEscapeKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setToggleMenu(false);
    }
  };

  useEffect(() => {
    if (toggleMenu) {
      document.addEventListener("keydown", handleEscapeKeyPress);
    } else {
      document.removeEventListener("keydown", handleEscapeKeyPress);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, [toggleMenu]);

  useCloseOnClickAway(menuRef, closeMenu, hamburgerRef);

  return (
    <nav className="flex justify-center items-center bg-background fixed top-0 left-0 right-0 h-20 z-30 border-b border-muted overflow-y-hidden">
      <div className="flex justify-end items-center max-w-1440 w-full px-8 relative gap-8 h-20">
        <Link
          href="/"
          className="absolute -left-8 sm:left-0 xxs:-left-2 h-16 flex items-center w-fit rounded-2xl"
          onClick={closeMenu}
        >
          <Image
            src="/wolf-logo.svg"
            width={308}
            height={112}
            alt=""
            className="max-w-1000 max-h-screen h-28 hidden xs:block"
          />
          <Image
            src="/wolf-logo-small.svg"
            width={247}
            height={112}
            alt=""
            className="max-w-1000 max-h-screen h-28 hidden xs:hidden xxs:block"
          />
          <Image
            src="/wolf-only.svg"
            width={176}
            height={64}
            alt=""
            className="max-w-1000 max-h-screen h-16 block xxs:hidden"
          />
        </Link>
        <div className="hidden md:flex flex-row gap-8">
          {!isBlogPage && !isToolPage && (
            <>
              <Link
                href="/blog"
                className="font-semibold hover:text-primary hover:underline underline-offset-4 focus:text-primary"
              >
                Blog
              </Link>
              <Link
                href="/tools"
                className="font-semibold hover:text-primary hover:underline underline-offset-4 focus:text-primary"
              >
                Tools
              </Link>
            </>
          )}
          {isBlogPage && (
            <>
              <Link
                href="/blog"
                className="font-semibold hover:text-primary hover:underline underline-offset-4 focus:text-primary"
              >
                Blog
              </Link>
              <Link
                href="/blog/categories"
                className="font-semibold hover:text-primary hover:underline underline-offset-4 focus:text-primary"
              >
                Categories
              </Link>
            </>
          )}

          {isToolPage && (
            <>
              <Link
                href="/tools"
                className="font-semibold hover:text-primary hover:underline underline-offset-4 focus:text-primary"
              >
                Tools
              </Link>
            </>
          )}
          <SearchInput />
        </div>
        <div className="block md:hidden -mr-4" onClick={closeMenu}>
          <SearchInput />
        </div>
        <div
          className={`flex flex-col justify-center items-end cursor-pointer h-16`}
          onClick={handleToggleMenu}
          ref={hamburgerRef}
        >
          <span
            className={`${hamburgerLine} ${
              toggleMenu && "rotate-45 translate-y-2.5"
            }`}
          ></span>
          <span
            className={`${hamburgerLine} ${toggleMenu && "opacity-0"}`}
          ></span>
          <span
            className={`${hamburgerLine} ${
              toggleMenu && "-rotate-45 -translate-y-2.5"
            }`}
          ></span>
        </div>
      </div>

      {toggleMenu && (
        <div className="fixed top-20 left-0 right-0 bottom-0 bg-background animate-fade animate-duration-300">
          <div
            className={`flex flex-col w-full md:w-1/2 max-w-1440 mx-auto mt-8 p-4 justify-center items-center gap-4 ${toggleMenu && "animate-fade-down"}`}
            ref={menuRef}
          >
            <p className="py-1 text-center rounded-lg bg-secondary mt-2 w-1/3 font-semibold max-w-40">
              Blog
            </p>
            <Link
              href="/blog"
              className="border-b w-8/12 xs:w-1/2 text-left pb-2 hover:text-primary"
              onClick={handleToggleMenu}
            >
              Blog
            </Link>
            <Link
              href="/blog/categories"
              className="border-b w-8/12 xs:w-1/2 text-left pb-2 hover:text-primary"
              onClick={handleToggleMenu}
            >
              Categories
            </Link>
            <p className="py-1 text-center rounded-lg bg-secondary mt-2 w-1/3 font-semibold max-w-40">
              Dev tools
            </p>
            <Link
              href="/tools"
              className="border-b w-8/12 xs:w-1/2 text-left pb-2 hover:text-primary"
              onClick={handleToggleMenu}
            >
              Tools
            </Link>
            <p className="py-1 text-center rounded-lg bg-secondary mt-2 w-1/3 font-semibold max-w-40">
              Other
            </p>
            <Link
              href="/"
              className="border-b w-8/12 xs:w-1/2 text-left pb-2 hover:text-primary"
              onClick={handleToggleMenu}
            >
              Support me
            </Link>
            <Link
              href="/about"
              className="border-b w-8/12 xs:w-1/2 text-left pb-2 hover:text-primary"
              onClick={handleToggleMenu}
            >
              About
            </Link>
            <Link
              href="/termsofuse"
              className="border-b w-8/12 xs:w-1/2 text-left pb-2 hover:text-primary"
              onClick={handleToggleMenu}
            >
              Terms of Use
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
