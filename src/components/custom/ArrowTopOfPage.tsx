"use client";

import { useState, useEffect } from "react";
import { ArrowUpToLine } from "lucide-react";
import Button from "./Button";

export default function ArrowTopOfPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      const shouldShow = window.scrollY > 300;
      setIsVisible(shouldShow);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Check initial position
    handleScroll();

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      onClick={scrollToTop}
      className="arrow-top"
      ariaLabel="Scroll to top"
    >
      Back to Top
      <ArrowUpToLine size={36} className="arrow-top__icon" />
    </Button>
  );
}
