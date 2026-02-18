"use client";

import { useState, useEffect } from "react";
import { ArrowUpToLine } from "lucide-react";
import Button from "./Button";

export default function ArrowTopOfPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [footerClearance, setFooterClearance] = useState<number>(24);

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

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const footer = document.querySelector("footer");
    if (!footer) return;

    const defaultClearance = 24;
    const updateClearance = (isIntersecting: boolean) => {
      if (!isIntersecting) {
        setFooterClearance(defaultClearance);
        return;
      }

      const footerHeight = footer.getBoundingClientRect().height;
      setFooterClearance(Math.max(defaultClearance, Math.ceil(footerHeight + 16)));
    };

    const observer = new IntersectionObserver(
      ([entry]) => updateClearance(entry.isIntersecting),
      { threshold: 0.01 },
    );

    observer.observe(footer);
    return () => observer.disconnect();
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
      style={{
        bottom: `calc(${footerClearance}px + env(safe-area-inset-bottom, 0px))`,
      }}
    >
      Back to Top
      <ArrowUpToLine size={20} className="arrow-top__icon" />
    </Button>
  );
}
