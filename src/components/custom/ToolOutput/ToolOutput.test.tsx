import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ToolOutput from "./ToolOutput";

const copyButtonSpy = vi.fn();

vi.mock("@/components/custom/CopyButton", () => ({
  default: (props: { valueToCopy: string }) => {
    copyButtonSpy(props.valueToCopy);
    return (
      <button type="button" data-testid="copy-button-mock" data-value={props.valueToCopy}>
        Copy
      </button>
    );
  },
}));

vi.mock("./ToolOutput.module.scss", () => ({
  default: new Proxy(
    {},
    {
      get: (_, prop) => String(prop),
    },
  ),
}));

describe("ToolOutput", () => {
  it("renders provided output in a code block", () => {
    render(<ToolOutput output="border-radius: 12px;" />);

    expect(screen.getByText("border-radius: 12px;")).toBeTruthy();
    expect(screen.getByLabelText("Tool output")).toBeTruthy();
  });

  it("forwards explicit valueToCopy to CopyButton", () => {
    render(<ToolOutput output="display text" valueToCopy="copy-target" />);

    expect(copyButtonSpy).toHaveBeenCalledWith("copy-target");
    expect(screen.getByTestId("copy-button-mock").getAttribute("data-value")).toBe(
      "copy-target",
    );
  });

  it("uses output as fallback valueToCopy when not provided", () => {
    render(<ToolOutput output="fallback-copy-value" />);

    expect(copyButtonSpy).toHaveBeenCalledWith("fallback-copy-value");
  });
});
