"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import SearchInput, { SEARCH_OPEN_EVENT } from "@/components/custom/Search/Search";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Search } from "lucide-react";
import styles from "./Navbar.module.scss";

// Navigation links configuration
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Tools", href: "/tools" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  const drawerId = "navbar-mobile-drawer";
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);
  const firstDrawerActionRef = useRef<HTMLAnchorElement>(null);
  const skipCloseFocusRestoreRef = useRef(false);

  // Close drawer handler
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleOpenSearchFromDrawer = () => {
    skipCloseFocusRestoreRef.current = true;
    setIsDrawerOpen(false);
    window.dispatchEvent(new Event(SEARCH_OPEN_EVENT));
  };

  // Check if link is active
  const isLinkActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo Section with responsive variants */}
        <Link href="/" className={styles.logo} aria-label="Go to homepage">
          <Image
            src="/wolf-logo.svg"
            width={308}
            height={112}
            alt="TechHowlerX Logo"
            className={styles.logoLarge}
            priority
          />
          <Image
            src="/wolf-logo-small.svg"
            width={247}
            height={112}
            alt="TechHowlerX Logo"
            className={styles.logoMedium}
          />
          <Image
            src="/wolf-only.svg"
            width={176}
            height={64}
            alt="TechHowlerX Logo"
            className={styles.logoSmall}
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${
                isLinkActive(link.href) ? styles.navLinkActive : ""
              }`}
              aria-current={isLinkActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search Icon */}
        <div className={styles.searchIcon}>
          <SearchInput />
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          ref={drawerTriggerRef}
          type="button"
          className={styles.hamburger}
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Toggle navigation menu"
          aria-expanded={isDrawerOpen}
          aria-controls={drawerId}
          aria-haspopup="dialog"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer using shadcn/ui Sheet */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent
          side="left"
          className={styles.drawerSheetContent}
          id={drawerId}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            firstDrawerActionRef.current?.focus();
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (skipCloseFocusRestoreRef.current) {
              skipCloseFocusRestoreRef.current = false;
              return;
            }
            drawerTriggerRef.current?.focus();
          }}
        >
          <SheetHeader className={styles.drawerHeader}>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>

          <div className={styles.drawerContent}>
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                ref={index === 0 ? firstDrawerActionRef : undefined}
                href={link.href}
                className={`${styles.drawerLink} ${
                  isLinkActive(link.href) ? styles.drawerLinkActive : ""
                }`}
                onClick={handleCloseDrawer}
                aria-current={isLinkActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              className={styles.drawerSearch}
              onClick={handleOpenSearchFromDrawer}
            >
              <Search size={16} aria-hidden="true" />
              Search
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
