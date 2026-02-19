import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

vi.mock("next/link", () => ({
  default: ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, className, ...props }: any) => (
    <img src={src} alt={alt} className={className} {...props} />
  ),
}));

const mockUsePathname = vi.fn(() => "/");
vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

describe("Footer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue("/");
  });

  it("renders required internal footer navigation links", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^blog$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^tools$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^about$/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /^terms of use$/i }),
    ).toBeInTheDocument();
  });

  it("renders required social and support links with secure new-tab attributes", () => {
    render(<Footer />);

    const github = screen.getByRole("link", {
      name: /visit github profile/i,
    });
    const linkedIn = screen.getByRole("link", {
      name: /visit linkedin profile/i,
    });
    const x = screen.getByRole("link", {
      name: /visit x \(twitter\) profile/i,
    });
    const support = screen.getByRole("link", {
      name: /visit buy me a coffee page/i,
    });

    for (const link of [github, linkedIn, x, support]) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("adds explicit accessible labels on social and support links", () => {
    render(<Footer />);

    const github = screen.getByRole("link", { name: /github/i });
    const linkedIn = screen.getByRole("link", { name: /linkedin/i });
    const x = screen.getByRole("link", { name: /x \(twitter\)/i });
    const support = screen.getByRole("link", { name: /buy me a coffee/i });

    for (const link of [github, linkedIn, x, support]) {
      expect(link).toHaveAttribute("aria-label");
      expect(link.getAttribute("aria-label")).toMatch(/opens in new tab/i);
    }
  });

  it("keeps social and support links keyboard focusable", () => {
    render(<Footer />);

    const links = [
      screen.getByRole("link", { name: /visit github profile/i }),
      screen.getByRole("link", { name: /visit linkedin profile/i }),
      screen.getByRole("link", { name: /visit x \(twitter\) profile/i }),
      screen.getByRole("link", { name: /visit buy me a coffee page/i }),
    ];

    for (const link of links) {
      link.focus();
      expect(link).toHaveFocus();
    }
  });

  it("hides footer on tool detail pages", () => {
    mockUsePathname.mockReturnValue("/tools/css/box-shadow");
    const { container } = render(<Footer />);

    const footer = container.querySelector("footer");
    expect(footer?.className).toContain("footer--hidden");
  });

  it("hides footer on article detail pages", () => {
    mockUsePathname.mockReturnValue("/blog/posts/test-article-rendering");
    const { container } = render(<Footer />);

    const footer = container.querySelector("footer");
    expect(footer?.className).toContain("footer--hidden");
  });
});
