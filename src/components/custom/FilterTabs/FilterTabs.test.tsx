import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FilterTabs from "./FilterTabs";

const mockReplace = vi.fn();
const mockUsePathname = vi.fn(() => "/topics/programming/css");
const mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => mockUsePathname(),
}));

vi.mock("./FilterTabs.module.scss", () => ({
  default: new Proxy(
    {},
    {
      get: (_, prop) => String(prop),
    },
  ),
}));

type Item = {
  type: "article" | "tool";
  title: string;
  description: string;
  href: string;
};

const items: Item[] = [
  { type: "article", title: "A", description: "A", href: "/a" },
  { type: "tool", title: "B", description: "B", href: "/b" },
  { type: "article", title: "C", description: "C", href: "/c" },
];

describe("FilterTabs", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockUsePathname.mockReturnValue("/topics/programming/css");
    mockSearchParams.delete("filter");
  });

  it("renders counts and defaults to all", () => {
    render(<FilterTabs items={items} />);

    expect(screen.getByRole("button", { name: /All \(3\)/i })).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /Articles \(2\)/i }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: /Tools \(1\)/i })).toBeTruthy();

    const allTab = screen.getByRole("button", { name: /All \(3\)/i });
    expect(allTab.getAttribute("aria-pressed")).toBe("true");
    expect(allTab.className).toContain("tab--active");
  });

  it("filters items when a tab is clicked", async () => {
    const onFilterChange = vi.fn();

    render(<FilterTabs items={items} onFilterChange={onFilterChange} />);

    const articlesTab = screen.getByRole("button", {
      name: /Articles \(2\)/i,
    });
    fireEvent.click(articlesTab);

    await waitFor(() => {
      expect(articlesTab.getAttribute("aria-pressed")).toBe("true");
    });

    expect(onFilterChange).toHaveBeenCalledWith(
      "articles",
      expect.arrayContaining([expect.objectContaining({ type: "article" })]),
    );
  });

  it("syncs the URL parameter when changing filters", async () => {
    mockSearchParams.set("filter", "tools");

    render(<FilterTabs items={items} />);

    const toolsTab = screen.getByRole("button", { name: /Tools \(1\)/i });
    expect(toolsTab.getAttribute("aria-pressed")).toBe("true");

    const articlesTab = screen.getByRole("button", {
      name: /Articles \(2\)/i,
    });
    fireEvent.click(articlesTab);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        "/topics/programming/css?filter=articles",
        { scroll: false },
      );
    });
  });

  it("supports keyboard focus for accessibility", () => {
    render(<FilterTabs items={items} />);

    const allTab = screen.getByRole("button", { name: /All \(3\)/i });
    const articlesTab = screen.getByRole("button", {
      name: /Articles \(2\)/i,
    });
    const toolsTab = screen.getByRole("button", { name: /Tools \(1\)/i });

    // Verify buttons are keyboard accessible
    expect(allTab.tagName).toBe("BUTTON");
    expect(articlesTab.tagName).toBe("BUTTON");
    expect(toolsTab.tagName).toBe("BUTTON");

    // Verify focus can be set
    allTab.focus();
    expect(document.activeElement).toBe(allTab);

    articlesTab.focus();
    expect(document.activeElement).toBe(articlesTab);
  });

  it("has aria-pressed attribute for screen readers", () => {
    render(<FilterTabs items={items} />);

    const allTab = screen.getByRole("button", { name: /All \(3\)/i });
    const articlesTab = screen.getByRole("button", {
      name: /Articles \(2\)/i,
    });

    expect(allTab.getAttribute("aria-pressed")).toBe("true");
    expect(articlesTab.getAttribute("aria-pressed")).toBe("false");
  });
});
