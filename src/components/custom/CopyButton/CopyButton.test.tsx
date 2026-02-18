import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import CopyButton from "./CopyButton";

vi.mock("./CopyButton.module.scss", () => ({
  default: new Proxy(
    {},
    {
      get: (_, prop) => String(prop),
    },
  ),
}));

describe("CopyButton", () => {
  const writeTextMock = vi.fn();

  beforeEach(() => {
    vi.useRealTimers();
    writeTextMock.mockReset();
    Object.defineProperty(globalThis.navigator, "clipboard", {
      value: {
        writeText: writeTextMock,
      },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders default Copy label", () => {
    writeTextMock.mockResolvedValue(undefined);
    render(<CopyButton valueToCopy="border-radius: 8px;" />);

    expect(screen.getByRole("button", { name: "Copy" })).toBeTruthy();
  });

  it("calls navigator.clipboard.writeText with provided value", async () => {
    writeTextMock.mockResolvedValue(undefined);
    render(<CopyButton valueToCopy="box-shadow: 0 0 0 black;" />);

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith("box-shadow: 0 0 0 black;");
    });
  });

  it("shows Copied! feedback immediately after click", () => {
    let resolveCopy: (() => void) | undefined;
    writeTextMock.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveCopy = resolve;
        }),
    );

    render(<CopyButton valueToCopy="instant-feedback" />);

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));

    expect(screen.getByRole("button", { name: "Copied!" })).toBeTruthy();
    resolveCopy?.();
  });

  it("switches to Copied! and resets after 1.5 seconds", async () => {
    vi.useFakeTimers();
    writeTextMock.mockResolvedValue(undefined);
    render(<CopyButton valueToCopy="slug-value" />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy" }));
      await Promise.resolve();
    });

    expect(screen.getByRole("button", { name: "Copied!" })).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByRole("button", { name: "Copy" })).toBeTruthy();
  });

  it("keeps stable layout class and deterministic state contract", async () => {
    writeTextMock.mockResolvedValue(undefined);
    render(<CopyButton valueToCopy="stable-width" />);

    const button = screen.getByRole("button", { name: "Copy" });
    expect(button.className).toContain("button--fixed");
    expect(button.getAttribute("data-state")).toBe("idle");

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Copied!" }).className).toContain(
        "button--fixed",
      );
      expect(screen.getByRole("button", { name: "Copied!" }).getAttribute("data-state")).toBe(
        "success",
      );
    });
  });

  it("handles clipboard failure without breaking the button state", async () => {
    writeTextMock.mockRejectedValue(new Error("NotAllowedError"));
    render(<CopyButton valueToCopy="failure-case" />);

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Copy" })).toBeTruthy();
    });

    expect(screen.getByRole("button", { name: "Copy" }).getAttribute("data-state")).toBe(
      "idle",
    );
    expect(screen.getByRole("status").textContent).toContain("Copy failed");
    expect(screen.getByRole("alert").textContent).toContain("Copy failed");
  });

  it("is keyboard focusable", () => {
    writeTextMock.mockResolvedValue(undefined);
    render(<CopyButton valueToCopy="focusable-value" />);

    const button = screen.getByRole("button", { name: "Copy" });
    button.focus();
    expect(document.activeElement).toBe(button);
  });
});
