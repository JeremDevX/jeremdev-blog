"use client";

import { MouseEvent } from "react";

export default function SkipLink() {
  const handleSkip = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const mainRegion = document.getElementById("main-content");
    if (!mainRegion) return;

    if (!mainRegion.hasAttribute("tabindex")) {
      mainRegion.setAttribute("tabindex", "-1");
    }

    mainRegion.focus();
    mainRegion.scrollIntoView({ block: "start" });
  };

  return (
    <a href="#main-content" className="skipLink" onClick={handleSkip}>
      Skip to main content
    </a>
  );
}
