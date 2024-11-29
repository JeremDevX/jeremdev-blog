"use client";

import Link from "next/link";
import SearchInput from "./Search";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCloseOnClickAway } from "@/utils/useOnClickAway";

const links = [
  { label: "Blog", href: "/blog", isBlogPage: true, isHomePage: true },
  { label: "Categories", href: "/blog/categories", isBlogPage: true },
  { label: "Tools", href: "/tools", isToolPage: true, isHomePage: true },
  { label: "Support me", href: "/", category: "Other" },
];

const menuLinks = [
  {
    category: "Blog",
    links: [
      { label: "Blog", href: "/blog", isBlogPage: true, isHomePage: true },
      { label: "Categories", href: "/blog/categories", isBlogPage: true },
    ],
  },
  {
    category: "Dev tools",
    links: [
      { label: "Tools", href: "/tools", isToolPage: true, isHomePage: true },
    ],
  },
  {
    category: "Other",
    links: [
      { label: "About", href: "/about", category: "Other" },
      { label: "Terms of Use", href: "/termsofuse", category: "Other" },
      { label: "Support me", href: "/", category: "Other" },
    ],
  },
];

export default function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const pathname = usePathname();
  const isHomePage =
    pathname === "/" || pathname === "/about" || pathname === "/termsofuse";
  const isBlogPage = pathname.startsWith("/blog");
  const isToolPage = pathname.startsWith("/tools");

  const filteredLinks = links.filter((link) => {
    if (isHomePage && link.isHomePage) return true;
    if (isBlogPage && link.isBlogPage) return true;
    if (isToolPage && link.isToolPage) return true;
    return false;
  });

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
    <nav className="navbar">
      <div className="navbar__container">
        <Link href="/" className="navbar__logo" onClick={closeMenu}>
          <Image
            src="/wolf-logo.svg"
            width={308}
            height={112}
            alt=""
            className="navbar__logo--large"
          />
          <Image
            src="/wolf-logo-small.svg"
            width={247}
            height={112}
            alt=""
            className="navbar__logo--medium"
          />
          <Image
            src="/wolf-only.svg"
            width={176}
            height={64}
            alt=""
            className="navbar__logo--small"
          />
        </Link>
        <div className="navbar__links">
          {filteredLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="navbar__link"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="navbar__search" onClick={closeMenu}>
          <SearchInput />
        </div>
        <div
          className="navbar__hamburger"
          onClick={handleToggleMenu}
          ref={hamburgerRef}
        >
          <span
            className={`navbar__hamburger-line ${
              toggleMenu ? "navbar__hamburger-line--top" : ""
            }`}
          ></span>
          <span
            className={`navbar__hamburger-line ${toggleMenu ? "navbar__hamburger-line--middle" : ""}`}
          ></span>
          <span
            className={`navbar__hamburger-line ${
              toggleMenu ? "navbar__hamburger-line--bottom" : ""
            }`}
          ></span>
        </div>
      </div>

      {toggleMenu && (
        <div className="navbar__menu">
          <div className="navbar__menu__container" ref={menuRef}>
            {menuLinks.map((category) => (
              <div key={category.category} className="test">
                <p className="navbar__menu__category">{category.category}</p>
                {category.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="navbar__menu__link"
                    onClick={handleToggleMenu}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
