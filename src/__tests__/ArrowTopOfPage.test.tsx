import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ArrowTopOfPage from "./ArrowTopOfPage";

// Mock Button component
vi.mock("./Button", () => ({
  default: ({ children, onClick, className, ...props }: any) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  ArrowUpToLine: ({ size, className }: any) => (
    <div data-testid="arrow-icon" data-size={size} className={className}>
      ArrowUp
    </div>
  ),
}));

describe("ArrowTopOfPage", () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = vi.fn();

    // Mock window.scrollY
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Visibility", () => {
    it("does not render when scroll position is less than 300px", () => {
      window.scrollY = 100;
      render(<ArrowTopOfPage />);

      const button = screen.queryByRole("button");
      expect(button).toBeNull();
    });

    it("renders when scroll position is greater than 300px", async () => {
      window.scrollY = 350;
      render(<ArrowTopOfPage />);

      // Trigger scroll event
      fireEvent.scroll(window);

      await waitFor(() => {
        const button = screen.queryByRole("button");
        expect(button).toBeTruthy();
      });
    });

    it("shows button after scrolling down past threshold", async () => {
      const { rerender } = render(<ArrowTopOfPage />);

      // Initially at top
      expect(screen.queryByRole("button")).toBeNull();

      // Scroll down
      window.scrollY = 400;
      fireEvent.scroll(window);

      await waitFor(() => {
        rerender(<ArrowTopOfPage />);
        const button = screen.queryByRole("button");
        expect(button).toBeTruthy();
      });
    });

    it("hides button when scrolling back to top", async () => {
      window.scrollY = 400;
      const { rerender } = render(<ArrowTopOfPage />);

      fireEvent.scroll(window);
      await waitFor(() => {
        expect(screen.queryByRole("button")).toBeTruthy();
      });

      // Scroll back to top
      window.scrollY = 50;
      fireEvent.scroll(window);

      await waitFor(() => {
        rerender(<ArrowTopOfPage />);
        expect(screen.queryByRole("button")).toBeNull();
      });
    });
  });

  describe("Functionality", () => {
    beforeEach(() => {
      window.scrollY = 500; // Ensure button is visible
    });

    it("scrolls to top when clicked", async () => {
      render(<ArrowTopOfPage />);

      fireEvent.scroll(window);

      await waitFor(() => {
        const button = screen.getByRole("button");
        expect(button).toBeTruthy();

        fireEvent.click(button);

        expect(window.scrollTo).toHaveBeenCalledWith({
          top: 0,
          behavior: "smooth",
        });
      });
    });

    it("renders button text", async () => {
      render(<ArrowTopOfPage />);

      fireEvent.scroll(window);

      await waitFor(() => {
        expect(screen.getByText("Back to Top")).toBeTruthy();
      });
    });

    it("renders arrow icon", async () => {
      render(<ArrowTopOfPage />);

      fireEvent.scroll(window);

      await waitFor(() => {
        const icon = screen.getByTestId("arrow-icon");
        expect(icon).toBeTruthy();
        expect(icon.getAttribute("data-size")).toBe("36");
      });
    });
  });

  describe("Accessibility", () => {
    beforeEach(() => {
      window.scrollY = 500; // Ensure button is visible
    });

    it("has proper aria-label", async () => {
      render(<ArrowTopOfPage />);

      fireEvent.scroll(window);

      await waitFor(() => {
        const button = screen.getByRole("button");
        expect(button.getAttribute("aria-label")).toBe("Scroll to top");
      });
    });

    it("is keyboard accessible", async () => {
      render(<ArrowTopOfPage />);

      fireEvent.scroll(window);

      await waitFor(() => {
        const button = screen.getByRole("button");
        expect(button.tagName).toBe("BUTTON");
      });
    });

    it("has correct CSS classes", async () => {
      render(<ArrowTopOfPage />);

      fireEvent.scroll(window);

      await waitFor(() => {
        const button = screen.getByRole("button");
        expect(button.className).toContain("arrow-top");
      });
    });
  });

  describe("Event Listeners", () => {
    it("attaches scroll event listener on mount", () => {
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");
      render(<ArrowTopOfPage />);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
      );
    });

    it("removes scroll event listener on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
      const { unmount } = render(<ArrowTopOfPage />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
      );
    });
  });
});
