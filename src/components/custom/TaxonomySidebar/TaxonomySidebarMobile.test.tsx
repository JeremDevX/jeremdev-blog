import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TaxonomySidebarMobile from "./TaxonomySidebarMobile";

vi.mock("./TaxonomySidebar", () => ({
  default: ({ onItemNavigate }: { onItemNavigate?: () => void }) => (
    <div data-testid="taxonomy-sidebar">
      <a href="/topics/example" onClick={onItemNavigate}>
        Example topic
      </a>
    </div>
  ),
}));

vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children, open }: any) => (
    <div data-testid="sheet" data-open={open}>
      {children}
    </div>
  ),
  SheetContent: ({
    children,
    id,
    side,
    className,
    onOpenAutoFocus,
    onCloseAutoFocus,
  }: any) => (
    <div id={id} data-testid="sheet-content" data-side={side} className={className}>
      <button
        type="button"
        data-testid="sheet-open-autofocus"
        onClick={() =>
          onOpenAutoFocus?.({
            preventDefault: vi.fn(),
          })
        }
      >
        open autofocus
      </button>
      <button
        type="button"
        data-testid="sheet-close-autofocus"
        onClick={() =>
          onCloseAutoFocus?.({
            preventDefault: vi.fn(),
          })
        }
      >
        close autofocus
      </button>
      {children}
    </div>
  ),
  SheetHeader: ({ children, className }: any) => (
    <div data-testid="sheet-header" className={className}>
      {children}
    </div>
  ),
  SheetTitle: ({ children, className }: any) => (
    <h2 data-testid="sheet-title" className={className}>
      {children}
    </h2>
  ),
}));

vi.mock("lucide-react", () => ({
  ListTree: ({ className }: any) => (
    <svg className={className} aria-hidden="true" data-testid="list-tree-icon" />
  ),
}));

vi.mock("./TaxonomySidebarMobile.module.scss", () => ({
  default: {
    mobileOnly: "mobileOnly",
    trigger: "trigger",
    triggerIcon: "triggerIcon",
    sheetContent: "sheetContent",
    sheetHeader: "sheetHeader",
    sheetTitle: "sheetTitle",
  },
}));

describe("TaxonomySidebarMobile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("provides ARIA controls linkage and expanded state on trigger", () => {
    render(<TaxonomySidebarMobile articles={[]} tools={[]} />);

    const trigger = screen.getByRole("button", {
      name: /open topics navigation/i,
    });

    expect(trigger.getAttribute("aria-controls")).toBe(
      "taxonomy-sidebar-mobile-drawer",
    );
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("updates expanded state when drawer opens", async () => {
    render(<TaxonomySidebarMobile articles={[]} tools={[]} />);

    const trigger = screen.getByRole("button", {
      name: /open topics navigation/i,
    });
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
    });
  });

  it("renders drawer content with the controlled id", async () => {
    render(<TaxonomySidebarMobile articles={[]} tools={[]} />);

    fireEvent.click(
      screen.getByRole("button", { name: /open topics navigation/i }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("sheet-content").getAttribute("id")).toBe(
        "taxonomy-sidebar-mobile-drawer",
      );
    });
  });

  it("moves focus into drawer content when opened", async () => {
    render(<TaxonomySidebarMobile articles={[]} tools={[]} />);

    fireEvent.click(
      screen.getByRole("button", { name: /open topics navigation/i }),
    );
    fireEvent.click(screen.getByTestId("sheet-open-autofocus"));

    await waitFor(() => {
      expect(screen.getByRole("link", { name: /example topic/i })).toHaveFocus();
    });
  });

  it("restores focus to trigger when drawer closes", async () => {
    render(<TaxonomySidebarMobile articles={[]} tools={[]} />);

    const trigger = screen.getByRole("button", {
      name: /open topics navigation/i,
    });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByTestId("sheet-close-autofocus"));

    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });
});
