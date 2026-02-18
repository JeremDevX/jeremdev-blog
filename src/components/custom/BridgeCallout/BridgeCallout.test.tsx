import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BridgeCallout from "./BridgeCallout";

vi.mock("next/link", () => ({
  default: ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("./BridgeCallout.module.scss", () => ({
  default: new Proxy(
    {},
    {
      get: (_, prop) => String(prop),
    },
  ),
}));

describe("BridgeCallout", () => {
  it("renders heading, tool content, and full-card link for valid data", () => {
    render(
      <BridgeCallout
        tool={{
          name: "Contrast Checker",
          description: "Check the contrast ratio between two colors.",
          slug: "/tools/accessibility/contrast-checker",
        }}
      />,
    );

    expect(screen.getByText("🔧 Try it yourself")).toBeTruthy();
    expect(screen.getByText("Contrast Checker")).toBeTruthy();
    expect(
      screen.getByText("Check the contrast ratio between two colors."),
    ).toBeTruthy();

    const link = screen.getByRole("link", {
      name: /try the contrast checker tool/i,
    });
    expect(link.getAttribute("href")).toBe("/tools/accessibility/contrast-checker");
  });

  it("does not render when no tool is provided", () => {
    const { container } = render(<BridgeCallout />);
    expect(container.firstChild).toBeNull();
  });

  it("does not render when tool data is invalid", () => {
    const { container } = render(
      <BridgeCallout
        tool={{
          name: "Broken Tool",
          description: "Missing target",
          slug: "",
        }}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("is keyboard focusable through the link element", () => {
    render(
      <BridgeCallout
        tool={{
          name: "Border Radius Generator",
          description: "Generate CSS border-radius values.",
          slug: "/tools/css/border-radius",
        }}
      />,
    );

    const link = screen.getByRole("link", {
      name: /try the border radius generator tool/i,
    });

    link.focus();
    expect(document.activeElement).toBe(link);
  });
});
