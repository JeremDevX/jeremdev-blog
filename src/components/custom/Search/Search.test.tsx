import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchInput from "./Search";

const mockRouterPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

vi.mock("usehooks-ts", () => ({
  useDebounceValue: (value: string) => [value],
}));

vi.mock("lucide-react", () => ({
  Search: ({ className }: { className?: string }) => (
    <svg className={className} aria-hidden="true" data-testid="search-icon" />
  ),
}));

vi.mock("./Search.module.scss", () => ({
  default: {
    search: "search",
    trigger: "trigger",
    triggerIcon: "triggerIcon",
    shortcutHint: "shortcutHint",
    overlay: "overlay",
    container: "container",
    inputWrapper: "inputWrapper",
    inputIcon: "inputIcon",
    input: "input",
    resultsList: "resultsList",
    message: "message",
    resultRow: "resultRow",
    resultRowSelected: "resultRowSelected",
    badge: "badge",
    badgeTool: "badgeTool",
    badgeArticle: "badgeArticle",
    resultContent: "resultContent",
    resultTitle: "resultTitle",
    resultDescription: "resultDescription",
  },
}));

describe("SearchInput", () => {
  beforeEach(() => {
    mockRouterPush.mockReset();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("closes with Escape and restores focus to trigger", async () => {
    render(<SearchInput />);

    const trigger = screen.getByRole("button", {
      name: /search articles and tools/i,
    });
    fireEvent.click(trigger);

    const input = await screen.findByRole("combobox", {
      name: /search articles and tools/i,
    });
    await waitFor(() => {
      expect(input).toHaveFocus();
    });

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
      expect(trigger).toHaveFocus();
    });
  });

  it("keeps Tab and Shift+Tab focus inside the overlay", async () => {
    render(<SearchInput />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /search articles and tools/i,
      }),
    );

    const input = await screen.findByRole("combobox", {
      name: /search articles and tools/i,
    });
    await waitFor(() => {
      expect(input).toHaveFocus();
    });

    fireEvent.keyDown(document, { key: "Tab" });
    expect(input).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(input).toHaveFocus();
  });

  it("dismisses the overlay on backdrop click", async () => {
    render(<SearchInput />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /search articles and tools/i,
      }),
    );

    const overlay = await screen.findByRole("dialog", {
      name: /search articles and tools/i,
    });

    fireEvent.click(overlay);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });
});
