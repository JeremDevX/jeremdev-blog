import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

function readSource(relativePath: string): string {
  return readFileSync(path.resolve(process.cwd(), relativePath), "utf8");
}

describe("Accessibility focus and reduced-motion style guardrails", () => {
  it("keeps token-based global focus-visible ring defaults", () => {
    const globals = readSource("src/styles/_globals.scss");

    expect(globals).toMatch(/\*:focus-visible\s*\{/);
    expect(globals).toMatch(/outline:\s*2px solid hsl\(var\(--ring\)\);/);
    expect(globals).toMatch(/outline-offset:\s*2px;/);
  });

  it("keeps skip-link styles hidden by default and visible on focus", () => {
    const globals = readSource("src/styles/_globals.scss");
    expect(globals).toMatch(/\.skipLink\s*\{/);
    expect(globals).toMatch(/transform:\s*translateY\(-140%\);/);
    expect(globals).toMatch(/\.skipLink[\s\S]*&:focus-visible\s*\{[\s\S]*transform:\s*translateY\(0\);/);
  });

  it("keeps component focus-visible rings consistent and avoids local ring color overrides", () => {
    const focusStyleFiles = [
      "src/components/custom/Search/Search.module.scss",
      "src/components/custom/Navbar/Navbar.module.scss",
      "src/components/custom/TaxonomySidebar/TaxonomySidebar.module.scss",
      "src/components/custom/TaxonomySidebar/TaxonomySidebarMobile.module.scss",
      "src/components/ui/Accordion.module.scss",
      "src/components/ui/Sheet.module.scss",
      "src/components/custom/BridgeCallout/BridgeCallout.module.scss",
    ];

    for (const filePath of focusStyleFiles) {
      const content = readSource(filePath);
      expect(
        content,
        `${filePath} should use ring token`,
      ).toMatch(/outline:\s*2px solid hsl\(var\(--ring\)\);/);
      expect(
        content,
        `${filePath} should use 2px offset`,
      ).toMatch(/outline-offset:\s*2px;/);
      expect(
        content.includes("outline-offset: 4px;"),
        `${filePath} should not use 4px offset`,
      ).toBe(false);
      expect(
        content.includes("outline-offset: -2px;"),
        `${filePath} should not use negative offset`,
      ).toBe(false);
    }

    const sidebar = readSource(
      "src/components/custom/TaxonomySidebar/TaxonomySidebar.module.scss",
    );
    expect(
      sidebar.includes("outline-color:"),
      "taxonomy sidebar should not override the global ring token color",
    ).toBe(false);
  });

  it("keeps reduced-motion handling specific to transform and animation-heavy surfaces", () => {
    const globals = readSource("src/styles/_globals.scss");
    expect(globals).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(globals).toMatch(
      /transition-property:\s*color,\s*background-color,\s*border-color,\s*box-shadow,\s*opacity\s*!important;/,
    );

    const contentCard = readSource(
      "src/components/custom/ContentCard/ContentCard.module.scss",
    );
    expect(contentCard).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(contentCard).toMatch(
      /&:hover,\s*&:focus-within\s*\{\s*transform:\s*none;/,
    );

    const hero = readSource("src/components/custom/HeroSection/HeroSection.module.scss");
    expect(hero).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(hero).toMatch(/&:hover\s*\{\s*transform:\s*none;/);

    const homePage = readSource("src/app/HomePage.module.scss");
    expect(homePage).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(homePage).toMatch(/&:hover\s*\{\s*transform:\s*none;/);

    const sheet = readSource("src/components/ui/Sheet.module.scss");
    expect(sheet).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(sheet).toMatch(/animation:\s*none;/);

    const accordion = readSource("src/components/ui/Accordion.module.scss");
    expect(accordion).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(accordion).toMatch(/animation:\s*none;/);
  });

  it("keeps reduced-motion transitions without dropping non-motion feedback", () => {
    const reducedMotionFiles = [
      "src/styles/_globals.scss",
      "src/components/custom/ContentCard/ContentCard.module.scss",
      "src/components/custom/HeroSection/HeroSection.module.scss",
      "src/app/HomePage.module.scss",
      "src/components/ui/Sheet.module.scss",
      "src/components/ui/Accordion.module.scss",
      "src/components/custom/BridgeCallout/BridgeCallout.module.scss",
    ];

    for (const filePath of reducedMotionFiles) {
      const content = readSource(filePath);
      expect(
        content.includes("@media (prefers-reduced-motion: reduce)"),
        `${filePath} should include reduced-motion media handling`,
      ).toBe(true);
    }
  });
});
