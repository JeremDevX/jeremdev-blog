"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SearchInput from "@/components/custom/Search/Search";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import styles from "./Navbar.module.scss";

// Navigation links configuration
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Tools", href: "/tools" },
  { label: "About", href: "/about" },
];

// Mobile drawer links organized by category
const mobileMenuLinks = [
  {
    category: "Blog",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Categories", href: "/blog/categories" },
    ],
  },
  {
    category: "Dev tools",
    links: [{ label: "Tools", href: "/tools" }],
  },
  {
    category: "Other",
    links: [
      { label: "About", href: "/about" },
      { label: "Terms of Use", href: "/termsofuse" },
    ],
  },
];

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer handler
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
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
          className={styles.hamburger}
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Toggle navigation menu"
          aria-expanded={isDrawerOpen}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer using shadcn/ui Sheet */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="left" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
            <SheetClose asChild>
              <button
                aria-label="Close navigation menu"
                className="absolute right-4 top-4"
              >
                <X size={24} />
              </button>
            </SheetClose>
          </SheetHeader>

          <div className={styles.drawerContent}>
            {mobileMenuLinks.map((category) => (
              <div key={category.category} className={styles.drawerCategory}>
                <p className={styles.drawerCategoryTitle}>
                  {category.category}
                </p>
                {category.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${styles.drawerLink} ${
                      isLinkActive(link.href) ? styles.drawerLinkActive : ""
                    }`}
                    onClick={handleCloseDrawer}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
