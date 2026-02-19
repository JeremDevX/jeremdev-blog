import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navbar from "./Navbar";

// Mock Next.js modules
vi.mock("next/link", () => ({
  default: ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, className, priority, ...props }: any) => (
    <img src={src} alt={alt} className={className} {...props} />
  ),
}));

const mockUsePathname = vi.fn(() => "/");
vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

// Mock Search component
vi.mock("@/components/custom/Search/Search", () => ({
  default: () => <div data-testid="search-component">Search</div>,
  SEARCH_OPEN_EVENT: "techhowlerx:search-open",
}));

// Mock Sheet component
vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children, open, onOpenChange }: any) => (
    <div
      data-testid="sheet"
      data-open={open}
      onClick={() => onOpenChange?.(false)}
    >
      {children}
    </div>
  ),
  SheetContent: ({ children, side }: any) => (
    <div data-testid="sheet-content" data-side={side}>
      {children}
    </div>
  ),
  SheetHeader: ({ children }: any) => (
    <div data-testid="sheet-header">{children}</div>
  ),
  SheetTitle: ({ children }: any) => (
    <h2 data-testid="sheet-title">{children}</h2>
  ),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Menu: () => <div data-testid="menu-icon">Menu</div>,
  Search: () => (
    <div data-testid="search-icon" aria-hidden="true">
      SearchIcon
    </div>
  ),
}));

// Mock SCSS module
vi.mock("./Navbar.module.scss", () => ({
  default: {
    navbar: "navbar",
    container: "container",
    logo: "logo",
    logoLarge: "logoLarge",
    logoMedium: "logoMedium",
    logoSmall: "logoSmall",
    navLinks: "navLinks",
    navLink: "navLink",
    navLinkActive: "navLinkActive",
    searchIcon: "searchIcon",
    hamburger: "hamburger",
    drawerSheetContent: "drawerSheetContent",
    drawerHeader: "drawerHeader",
    drawerContent: "drawerContent",
    drawerLink: "drawerLink",
    drawerLinkActive: "drawerLinkActive",
    drawerSearch: "drawerSearch",
  },
}));

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue("/");
  });

  describe("Desktop Navigation", () => {
    it("renders navbar container", () => {
      render(<Navbar />);
      const nav = screen.getByRole("navigation");
      expect(nav).toBeTruthy();
      expect(nav.className).toContain("navbar");
    });

    it("renders logo with all responsive variants", () => {
      render(<Navbar />);
      const images = screen.getAllByRole("img");

      // Should have 3 logo variants
      const logos = images.filter(
        (img) => img.getAttribute("alt") === "TechHowlerX Logo",
      );
      expect(logos.length).toBe(3);

      // Check sources
      const sources = logos.map((img) => img.getAttribute("src"));
      expect(sources).toContain("/wolf-logo.svg");
      expect(sources).toContain("/wolf-logo-small.svg");
      expect(sources).toContain("/wolf-only.svg");
    });

    it("logo links to homepage", () => {
      render(<Navbar />);
      const logoLinks = screen.getAllByRole("link", {
        name: /go to homepage/i,
      });
      expect(logoLinks.length).toBeGreaterThan(0);
      expect(logoLinks[0].getAttribute("href")).toBe("/");
    });

    it("renders desktop navigation links", () => {
      render(<Navbar />);

      // Links appear in both desktop nav and mobile drawer, so use getAllByRole
      const homeLinks = screen.getAllByRole("link", { name: /home/i });
      const blogLinks = screen.getAllByRole("link", { name: /blog/i });
      const toolsLinks = screen.getAllByRole("link", { name: /^tools$/i });
      const aboutLinks = screen.getAllByRole("link", { name: /about/i });

      expect(homeLinks.length).toBeGreaterThan(0);
      expect(blogLinks.length).toBeGreaterThan(0);
      expect(toolsLinks.length).toBeGreaterThan(0);
      expect(aboutLinks.length).toBeGreaterThan(0);
    });

    it("applies active class to current page link", () => {
      mockUsePathname.mockReturnValue("/blog");

      render(<Navbar />);

      // Get all blog links (desktop + mobile drawer)
      const blogLinks = screen.getAllByRole("link", { name: /blog/i });
      // Find the one with navLinkActive class (desktop nav)
      const activeBlogLink = blogLinks.find((link) =>
        link.className.includes("navLinkActive"),
      );
      expect(activeBlogLink).toBeTruthy();
    });

    it("renders search component", () => {
      render(<Navbar />);
      expect(screen.getByTestId("search-component")).toBeTruthy();
    });
  });

  describe("Mobile Navigation", () => {
    it("renders hamburger menu button", () => {
      render(<Navbar />);
      const hamburgerButton = screen.getByRole("button", {
        name: /toggle navigation menu/i,
      });
      expect(hamburgerButton).toBeTruthy();
      expect(screen.getByTestId("menu-icon")).toBeTruthy();
    });

    it("opens mobile drawer when hamburger is clicked", async () => {
      render(<Navbar />);
      const hamburgerButton = screen.getByRole("button", {
        name: /toggle navigation menu/i,
      });

      fireEvent.click(hamburgerButton);

      await waitFor(() => {
        const sheet = screen.getByTestId("sheet");
        expect(sheet.getAttribute("data-open")).toBe("true");
      });
    });

    it("renders mobile drawer links and search access", async () => {
      render(<Navbar />);
      const hamburgerButton = screen.getByRole("button", {
        name: /toggle navigation menu/i,
      });

      fireEvent.click(hamburgerButton);

      await waitFor(() => {
        expect(screen.getAllByRole("link", { name: /^home$/i }).length).toBeGreaterThan(0);
        expect(screen.getAllByRole("link", { name: /^blog$/i }).length).toBeGreaterThan(0);
        expect(screen.getAllByRole("link", { name: /^tools$/i }).length).toBeGreaterThan(0);
        expect(screen.getAllByRole("link", { name: /^about$/i }).length).toBeGreaterThan(0);
        expect(screen.getByRole("button", { name: /search/i })).toBeTruthy();
      });
    });

    it("dispatches the search open event from mobile drawer", async () => {
      const dispatchSpy = vi.spyOn(window, "dispatchEvent");
      render(<Navbar />);
      fireEvent.click(
        screen.getByRole("button", { name: /toggle navigation menu/i }),
      );

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /search/i })).toBeTruthy();
      });

      fireEvent.click(screen.getByRole("button", { name: /search/i }));
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "techhowlerx:search-open" }),
      );
    });

    it("closes drawer when link is clicked", async () => {
      render(<Navbar />);
      const hamburgerButton = screen.getByRole("button", {
        name: /toggle navigation menu/i,
      });

      fireEvent.click(hamburgerButton);

      await waitFor(() => {
        const sheet = screen.getByTestId("sheet");
        expect(sheet.getAttribute("data-open")).toBe("true");
      });

      // Click a link in the drawer
      const blogLink = screen.getAllByRole("link", { name: /blog/i })[1]; // Second one is in drawer
      fireEvent.click(blogLink);

      await waitFor(() => {
        const sheet = screen.getByTestId("sheet");
        expect(sheet.getAttribute("data-open")).toBe("false");
      });
    });
  });

  describe("Accessibility", () => {
    it("hamburger button has proper ARIA attributes", () => {
      render(<Navbar />);
      const hamburgerButton = screen.getByRole("button", {
        name: /toggle navigation menu/i,
      });

      expect(hamburgerButton.getAttribute("aria-label")).toBe(
        "Toggle navigation menu",
      );
      expect(hamburgerButton.getAttribute("aria-expanded")).toBe("false");
      expect(hamburgerButton.getAttribute("aria-controls")).toBe(
        "navbar-mobile-drawer",
      );
    });

    it("updates aria-expanded when drawer opens", async () => {
      render(<Navbar />);
      const hamburgerButton = screen.getByRole("button", {
        name: /toggle navigation menu/i,
      });

      fireEvent.click(hamburgerButton);

      await waitFor(() => {
        expect(hamburgerButton.getAttribute("aria-expanded")).toBe("true");
      });
    });

    it("navigation has semantic nav element", () => {
      render(<Navbar />);
      const nav = screen.getByRole("navigation");
      expect(nav).toBeTruthy();
    });
  });

  describe("Active Link Detection", () => {
    it("highlights home link when on homepage", () => {
      mockUsePathname.mockReturnValue("/");

      render(<Navbar />);
      const homeLinks = screen.getAllByRole("link", { name: /^home$/i });
      // Find the one with navLinkActive class (desktop nav)
      const activeHomeLink = homeLinks.find((link) =>
        link.className.includes("navLinkActive"),
      );
      expect(activeHomeLink).toBeTruthy();
    });

    it("highlights blog link when on blog pages", () => {
      mockUsePathname.mockReturnValue("/blog/posts/some-post");

      render(<Navbar />);
      const blogLinks = screen.getAllByRole("link", { name: /^blog$/i });
      // Find the one with navLinkActive class (desktop nav)
      const activeBlogLink = blogLinks.find((link) =>
        link.className.includes("navLinkActive"),
      );
      expect(activeBlogLink).toBeTruthy();
    });

    it("highlights tools link when on tools pages", () => {
      mockUsePathname.mockReturnValue("/tools/css/border-radius");

      render(<Navbar />);
      const toolsLinks = screen.getAllByRole("link", { name: /^tools$/i });
      // Find the one with navLinkActive class (desktop nav)
      const activeToolsLink = toolsLinks.find((link) =>
        link.className.includes("navLinkActive"),
      );
      expect(activeToolsLink).toBeTruthy();
    });

    it("only highlights home link when exactly on homepage", () => {
      mockUsePathname.mockReturnValue("/blog");

      render(<Navbar />);
      const homeLinks = screen.getAllByRole("link", { name: /^home$/i });
      // Check that none of them have the active class
      const hasActive = homeLinks.some((link) =>
        link.className.includes("navLinkActive"),
      );
      expect(hasActive).toBe(false);
    });
  });
});
