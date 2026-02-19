import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RelatedSection from "./RelatedSection";

vi.mock("next/link", () => ({
  default: ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("./RelatedSection.module.scss", () => ({
  default: new Proxy(
    {},
    {
      get: (_, prop) => String(prop),
    },
  ),
}));

describe("RelatedSection", () => {
  it("renders heading, separator wrapper, and mixed article/tool cards", () => {
    render(
      <RelatedSection
        items={[
          {
            type: "article",
            title: "The Importance of Semantics in HTML",
            description: "Semantic tags improve accessibility and SEO.",
            href: "/blog/posts/importance-of-semantics-in-html",
            date: "2024-10-15",
            category: "programming/html/semantics",
          },
          {
            type: "tool",
            title: "Border Radius Generator",
            description: "Generate CSS border-radius values.",
            href: "/tools/css/border-radius",
            category: "CSS",
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Related" })).toBeTruthy();
    expect(screen.getByText("Article")).toBeTruthy();
    expect(screen.getByText("Tool")).toBeTruthy();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute("href")).toBe(
      "/blog/posts/importance-of-semantics-in-html",
    );
    expect(links[1].getAttribute("href")).toBe("/tools/css/border-radius");
  });

  it("does not render when there is no related content", () => {
    const { container } = render(<RelatedSection items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders placeholder when configured and related content is missing", () => {
    render(
      <RelatedSection
        items={[]}
        placeholder="Related content will be added soon."
      />,
    );

    expect(screen.getByRole("heading", { name: "Related" })).toBeTruthy();
    expect(
      screen.getByText("Related content will be added soon."),
    ).toBeTruthy();
  });

  it("renders a single related card when only one item exists", () => {
    render(
      <RelatedSection
        items={[
          {
            type: "article",
            title: "Flexbox vs Grid: Which Layout System Should You Choose?",
            description: "How to choose between Flexbox and Grid.",
            href: "/blog/posts/flexbox-vs-grid",
            date: "2026-02-19",
            category: "programming/css/layout",
          },
        ]}
        placeholder="Related content will be added soon."
      />,
    );

    expect(screen.getByRole("heading", { name: "Related" })).toBeTruthy();
    expect(
      screen.queryByText("Related content will be added soon."),
    ).toBeNull();
    expect(
      screen.getByRole("link", {
        name: /flexbox vs grid: which layout system should you choose\?/i,
      }),
    ).toBeTruthy();
  });

  it("preserves keyboard accessibility through card links", () => {
    render(
      <RelatedSection
        items={[
          {
            type: "article",
            title: "Why a VPN doesn't really make you Anonymous",
            description: "A VPN improves privacy but not full anonymity.",
            href: "/blog/posts/vpn-anonymity-explained",
            date: "2024-10-15",
            category: "networking-security/privacy/vpn-anonymity",
          },
          {
            type: "tool",
            title: "Contrast Checker",
            description: "Check WCAG color contrast ratios.",
            href: "/tools/accessibility/contrast-checker",
            category: "Accessibility",
          },
        ]}
      />,
    );

    const firstLink = screen.getByRole("link", {
      name: /why a vpn doesn't really make you anonymous/i,
    });
    firstLink.focus();
    expect(document.activeElement).toBe(firstLink);
  });
});
