"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isToolPage = pathname.startsWith("/tools/");

  return (
    <footer className={`footer ${isToolPage ? "footer--hidden" : ""}`}>
      <div className="footer__container">
        <div className="footer__logo">
          <Image src={"/wolf-only.svg"} height={50} width={50} alt="" />
          <span className="footer__logo-text">TechHowlerX</span>
        </div>
        <div className="footer__links">
          <Link href={"/about"} className="footer__link">
            About
          </Link>
          <Link href={"/termsofuse"} className="footer__link">
            Terms of Use
          </Link>
          <Link href={"https://github.com/JeremDevX"} className="footer__link">
            GitHub
          </Link>
          <Link href={"/"} className="footer__link">
            Support me
          </Link>
        </div>
        <div className="footer__legal">
          <span>© 2024 TechHowlerX</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
