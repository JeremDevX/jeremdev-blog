// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import TaxonomySidebar from "@/components/custom/TaxonomySidebar/TaxonomySidebar";
import { getAllTools } from "@/lib/tools";
import type { ArticleMeta } from "@/types/content";

const mockUsePathname = vi.fn(() => "/tools/css/box-shadow");

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

// Mock CSS modules with default export
vi.mock(
  "@/components/custom/TaxonomySidebar/TaxonomySidebar.module.scss",
  () => ({
    default: new Proxy(
      {},
      {
        get: (_, prop) => String(prop),
      }
    ),
  })
);

const mockArticle: ArticleMeta = {
  title: "VPN Anonymity Explained",
  slug: "vpn-anonymity-explained",
  date: "2024-10-15",
  resume: "A test article",
  category: "networking-security/privacy/vpn-anonymity",
  published: true,
};

const mockTools = getAllTools();

describe("TaxonomySidebar Component", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/tools/css/box-shadow");
  });

  it("renders with correct aria-label for navigation landmark", () => {
    render(<TaxonomySidebar articles={[]} tools={mockTools} />);
    const nav = screen.getByRole("navigation", {
      name: "Taxonomy navigation",
    });
    expect(nav).toBeInTheDocument();
  });

  it("renders tool items with wrench icon", () => {
    render(<TaxonomySidebar articles={[]} tools={mockTools} />);

    const toolLink = screen.getByRole("link", {
      name: /Box Shadow Generator/,
    });
    expect(toolLink).toBeInTheDocument();

    // Wrench icon should be present and hidden from assistive technology
    const wrenchIcon = toolLink.querySelector("[aria-hidden='true']");
    expect(wrenchIcon).toBeInTheDocument();
  });

  it("renders article items as standard links", () => {
    // Set pathname to article page so its branch auto-expands
    mockUsePathname.mockReturnValue("/blog/posts/vpn-anonymity-explained");

    render(<TaxonomySidebar articles={[mockArticle]} tools={[]} />);

    const articleLink = screen.getByRole("link", {
      name: "VPN Anonymity Explained",
    });
    expect(articleLink).toBeInTheDocument();
    expect(articleLink).toHaveAttribute(
      "href",
      "/blog/posts/vpn-anonymity-explained"
    );
  });

  it("marks the active page with aria-current='page'", () => {
    render(<TaxonomySidebar articles={[]} tools={mockTools} />);

    const activeLink = screen.getByRole("link", {
      name: /Box Shadow Generator/,
    });
    expect(activeLink).toHaveAttribute("aria-current", "page");
  });

  it("does not mark non-active items with aria-current", () => {
    render(<TaxonomySidebar articles={[]} tools={mockTools} />);

    const inactiveLink = screen.getByRole("link", {
      name: /Border Radius Generator/,
    });
    expect(inactiveLink).not.toHaveAttribute("aria-current");
  });

  it("marks tool item active when pathname has trailing slash", () => {
    mockUsePathname.mockReturnValue("/tools/css/box-shadow/");

    render(<TaxonomySidebar articles={[]} tools={mockTools} />);

    const activeLink = screen.getByRole("link", {
      name: /Box Shadow Generator/,
    });
    expect(activeLink).toHaveAttribute("aria-current", "page");
  });

  it("applies activeLink class to the current page item", () => {
    render(<TaxonomySidebar articles={[]} tools={mockTools} />);

    const activeLink = screen.getByRole("link", {
      name: /Box Shadow Generator/,
    });
    expect(activeLink.className).toContain("activeLink");
  });

  it("applies toolLink class to tool items", () => {
    render(<TaxonomySidebar articles={[]} tools={mockTools} />);

    const toolLink = screen.getByRole("link", {
      name: /Border Radius Generator/,
    });
    expect(toolLink.className).toContain("toolLink");
  });

  it("renders Big Topics as accordion sections", () => {
    render(<TaxonomySidebar articles={[]} tools={mockTools} />);

    // "Tools & Utilities" should be visible as an accordion trigger
    expect(screen.getByText("Tools & Utilities")).toBeInTheDocument();
  });

  it("keeps active state synchronized when route changes from tool to article", () => {
    const { rerender } = render(
      <TaxonomySidebar articles={[]} tools={mockTools} />
    );

    const initialActiveTool = screen.getByRole("link", {
      name: /Box Shadow Generator/,
    });
    expect(initialActiveTool).toHaveAttribute("aria-current", "page");

    mockUsePathname.mockReturnValue("/blog/posts/vpn-anonymity-explained");
    rerender(<TaxonomySidebar articles={[mockArticle]} tools={mockTools} />);

    const activeArticle = screen.getByRole("link", {
      name: "VPN Anonymity Explained",
    });
    expect(activeArticle).toHaveAttribute("aria-current", "page");
  });

  it("preserves expanded branch context across route changes", () => {
    const { rerender } = render(
      <TaxonomySidebar articles={[]} tools={mockTools} />
    );

    const accessibilityTrigger = screen.getByRole("button", {
      name: "Accessibility",
    });
    expect(accessibilityTrigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(accessibilityTrigger);
    expect(accessibilityTrigger).toHaveAttribute("aria-expanded", "true");

    mockUsePathname.mockReturnValue("/blog/posts/vpn-anonymity-explained");
    rerender(<TaxonomySidebar articles={[mockArticle]} tools={mockTools} />);

    const accessibilityTriggerAfterRouteChange = screen.getByRole("button", {
      name: "Accessibility",
    });
    expect(accessibilityTriggerAfterRouteChange).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("uses native button triggers for Enter/Space keyboard activation", () => {
    mockUsePathname.mockReturnValue("/about");

    render(<TaxonomySidebar articles={[]} tools={mockTools} />);

    const toolsTrigger = screen.getByRole("button", {
      name: "Tools & Utilities",
    });

    expect(toolsTrigger.tagName).toBe("BUTTON");
    expect(toolsTrigger).toHaveAttribute("type", "button");
    expect(toolsTrigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toolsTrigger);
    expect(toolsTrigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(toolsTrigger);
    expect(toolsTrigger).toHaveAttribute("aria-expanded", "false");
  });

  it("supports arrow-key navigation between top-level accordion triggers", () => {
    mockUsePathname.mockReturnValue("/about");

    render(<TaxonomySidebar articles={[]} tools={mockTools} />);

    const accessibilityTrigger = screen.getByRole("button", {
      name: "Accessibility",
    });
    const toolsTrigger = screen.getByRole("button", {
      name: "Tools & Utilities",
    });

    accessibilityTrigger.focus();
    fireEvent.keyDown(accessibilityTrigger, { key: "ArrowDown" });

    expect(toolsTrigger).toHaveFocus();
  });

  it("keeps sidebar triggers keyboard focusable", () => {
    render(<TaxonomySidebar articles={[]} tools={mockTools} />);

    const toolsTrigger = screen.getByRole("button", {
      name: "Tools & Utilities",
    });
    toolsTrigger.focus();

    expect(toolsTrigger).toHaveFocus();
    expect(toolsTrigger).not.toHaveAttribute("tabindex", "-1");
  });

  it("renders correct href for tool links", () => {
    render(<TaxonomySidebar articles={[]} tools={mockTools} />);

    const toolLink = screen.getByRole("link", {
      name: /Box Shadow Generator/,
    });
    expect(toolLink).toHaveAttribute("href", "/tools/css/box-shadow");
  });

  it("renders distinct sections for article and tool taxonomies", () => {
    const articleInToolBranch: ArticleMeta = {
      title: "A Box Shadow Guide",
      slug: "a-box-shadow-guide",
      date: "2024-10-16",
      resume: "An article in the box-shadow branch",
      category: "tools/css-tools/box-shadow",
      published: true,
    };

    mockUsePathname.mockReturnValue("/blog/posts/a-box-shadow-guide");

    render(<TaxonomySidebar articles={[articleInToolBranch]} tools={mockTools} />);

    const articleSection = screen.getByLabelText("Article taxonomy");
    const toolSection = screen.getByLabelText("Tools taxonomy");

    expect(within(articleSection).getByText("Articles")).toBeInTheDocument();
    expect(within(toolSection).getByText("Tools")).toBeInTheDocument();
  });
});
