"use client";

import { useState, useEffect } from "react";
import { ArrowUpToLine } from "lucide-react";
import Button from "./Button";

const VISIBILITY_THRESHOLD = 300;
const DEFAULT_CLEARANCE = 24;
const FOOTER_BUFFER = 16;

export default function ArrowTopOfPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [footerClearance, setFooterClearance] =
    useState<number>(DEFAULT_CLEARANCE);

  useEffect(() => {
    const getFooterClearance = () => {
      const footer = document.querySelector<HTMLElement>("footer");
      if (!footer || footer.classList.contains("footer--hidden")) {
        return DEFAULT_CLEARANCE;
      }

      const { top, height } = footer.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const visibleFooterHeight = Math.min(
        height,
        Math.max(0, viewportHeight - top),
      );

      if (visibleFooterHeight <= 0) {
        return DEFAULT_CLEARANCE;
      }

      return Math.max(
        DEFAULT_CLEARANCE,
        Math.ceil(visibleFooterHeight + FOOTER_BUFFER),
      );
    };

    const syncArrowState = () => {
      const shouldShow = window.scrollY > VISIBILITY_THRESHOLD;
      const nextClearance = getFooterClearance();

      setIsVisible((current) => (current === shouldShow ? current : shouldShow));
      setFooterClearance((current) =>
        current === nextClearance ? current : nextClearance,
      );
    };

    window.addEventListener("scroll", syncArrowState);
    window.addEventListener("resize", syncArrowState);
    syncArrowState();

    return () => {
      window.removeEventListener("scroll", syncArrowState);
      window.removeEventListener("resize", syncArrowState);
    };
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
