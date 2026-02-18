import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Breadcrumb from "./Breadcrumb";

const mockUsePathname = vi.fn(() => "/topics/programming/css");

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("./Breadcrumb.module.scss", () => ({
  default: new Proxy(
    {},
    {
      get: (_, prop) => String(prop),
    },
  ),
}));

const createMatchMedia = (matches: boolean) =>
  vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

describe("Breadcrumb", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/topics/programming/css");
    window.matchMedia = createMatchMedia(false) as unknown as (
      query: string,
    ) => MediaQueryList;
  });

  it("renders links and current segment", () => {
    render(
      <Breadcrumb
        path={[
          { name: "Topics", href: "/topics" },
          { name: "Programming", href: "/topics/programming" },
          { name: "CSS" },
        ]}
      />,
    );

    const links = screen.getAllByRole("link");
    expect(links.length).toBe(2);

    const current = screen.getByText("CSS");
    expect(current.tagName).toBe("SPAN");
    expect(current.getAttribute("aria-current")).toBe("page");

    expect(screen.getAllByText("›").length).toBe(2);
  });

  it("truncates long paths on mobile", () => {
    window.matchMedia = createMatchMedia(true) as unknown as (
      query: string,
    ) => MediaQueryList;

    render(
      <Breadcrumb
        path={[
          { name: "Topics", href: "/topics" },
          { name: "Programming", href: "/topics/programming" },
          { name: "CSS", href: "/topics/programming/css" },
          { name: "Visual Effects", href: "/topics/programming/css/visual" },
          { name: "Glow" },
        ]}
      />,
    );

    expect(screen.getByText("...")).toBeTruthy();
    expect(screen.getByText("Topics")).toBeTruthy();
    expect(screen.getByText("Visual Effects")).toBeTruthy();
    expect(screen.getByText("Glow")).toBeTruthy();
  });
});
