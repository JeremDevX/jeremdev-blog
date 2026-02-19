import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

function readSource(relativePath: string): string {
  return readFileSync(path.resolve(process.cwd(), relativePath), "utf8");
}

function countTag(content: string, tag: string): number {
  const regex = new RegExp(`<${tag}\\b`, "g");
  return (content.match(regex) ?? []).length;
}

describe("Route semantic landmarks and heading constraints", () => {
  it("keeps a primary content landmark on all core route templates", () => {
    const routeTemplates = [
      "src/app/page.tsx",
      "src/app/blog/page.tsx",
      "src/app/tools/page.tsx",
      "src/app/topics/page.tsx",
      "src/app/topics/[...path]/page.tsx",
      "src/app/not-found.tsx",
      "src/app/about/page.tsx",
      "src/app/termsofuse/page.tsx",
      "src/app/blog/posts/[slug]/page.tsx",
    ];

    for (const filePath of routeTemplates) {
      const content = readSource(filePath);
      const hasMain = content.includes("<main");
      const hasArticle = content.includes("<article");
      expect(
        hasMain || hasArticle,
        `${filePath} should contain a <main> or <article> landmark`,
      ).toBe(true);
    }
  });

  it("keeps explicit aside landmarks for taxonomy sidebars on content layouts", () => {
    const layoutsWithSidebar = [
      "src/app/blog/posts/layout.tsx",
      "src/app/tools/(tools)/layout.tsx",
    ];

    for (const filePath of layoutsWithSidebar) {
      const content = readSource(filePath);
      expect(content.includes("<aside"), `${filePath} should include <aside>`).toBe(
        true,
      );
    }
  });

  it("keeps skip-link and language semantics in the root layout", () => {
    const layoutContent = readSource("src/app/layout.tsx");
    const skipLinkContent = readSource("src/components/custom/SkipLink/SkipLink.tsx");

    expect(layoutContent.includes("<html lang=\"en\""), "layout should keep html lang=\"en\"").toBe(true);
    expect(layoutContent.includes("<SkipLink />"), "layout should render skip link first").toBe(true);
    expect(skipLinkContent.includes("href=\"#main-content\""), "skip link should keep target").toBe(true);
    expect(
      skipLinkContent.includes("Skip to main content"),
      "skip link should include exact text",
    ).toBe(true);
  });

  it("keeps a stable skip-link target id on all primary main landmarks", () => {
    const filesWithMainTarget = [
      "src/app/page.tsx",
      "src/app/blog/page.tsx",
      "src/app/tools/page.tsx",
      "src/app/topics/page.tsx",
      "src/app/topics/[...path]/page.tsx",
      "src/app/not-found.tsx",
      "src/app/about/page.tsx",
      "src/app/termsofuse/page.tsx",
      "src/app/blog/posts/layout.tsx",
      "src/app/tools/(tools)/layout.tsx",
    ];

    for (const filePath of filesWithMainTarget) {
      const content = readSource(filePath);
      expect(
        content.includes('id="main-content"'),
        `${filePath} should keep id="main-content" on its primary main landmark`,
      ).toBe(true);
    }
  });

  it("keeps exactly one h1 on each primary route surface", () => {
    const filesWithSingleH1 = [
      "src/components/custom/HeroSection/HeroSection.tsx",
      "src/app/blog/page.tsx",
      "src/app/tools/page.tsx",
      "src/app/topics/page.tsx",
      "src/app/topics/[...path]/page.tsx",
      "src/app/blog/posts/[slug]/page.tsx",
      "src/app/about/page.tsx",
      "src/app/termsofuse/page.tsx",
      "src/app/tools/(tools)/accessibility/contrast-checker/ContrastChecker.tsx",
      "src/app/tools/(tools)/css/border-radius/BorderRadius.tsx",
      "src/app/tools/(tools)/css/box-shadow/BoxShadow.tsx",
      "src/app/tools/(tools)/css/flexbox-playground/FlexboxPlayground.tsx",
      "src/app/tools/(tools)/code/slug-generator/SlugGenerator.tsx",
      "src/app/tools/(tools)/text/word-counter/WordCounter.tsx",
    ];

    for (const filePath of filesWithSingleH1) {
      const content = readSource(filePath);
      expect(
        countTag(content, "h1"),
        `${filePath} should contain exactly one h1`,
      ).toBe(1);
    }
  });
});
