import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ContrastChecker, {
  parseColorInput,
} from "@/app/tools/(tools)/accessibility/contrast-checker/ContrastChecker";
import BorderRadius from "@/app/tools/(tools)/css/border-radius/BorderRadius";
import BoxShadow from "@/app/tools/(tools)/css/box-shadow/BoxShadow";
import SlugGenerator, {
  normalizeSlug,
} from "@/app/tools/(tools)/code/slug-generator/SlugGenerator";
import WordCounter, {
  countWords,
} from "@/app/tools/(tools)/text/word-counter/WordCounter";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Tool migrations", () => {
  describe("ContrastChecker", () => {
    it("accepts HEX and rgb() formats", () => {
      expect(parseColorInput("#abc")).toEqual({
        isValid: true,
        hex: "#AABBCC",
        message: "",
      });
      expect(parseColorInput("rgb(17, 34, 51)")).toEqual({
        isValid: true,
        hex: "#112233",
        message: "",
      });
      expect(parseColorInput("rgb(260, 0, 0)").isValid).toBe(false);
    });

    it("shows and clears inline validation errors immediately", () => {
      render(<ContrastChecker />);

      const foregroundInput = screen.getByLabelText(/HEX or RGB value/i, {
        selector: "#input-foreground-value",
      });

      fireEvent.change(foregroundInput, { target: { value: "rgb(999,0,0)" } });
      expect(screen.getByText(/Use HEX/)).toBeTruthy();
      expect(foregroundInput).toHaveAttribute("aria-invalid", "true");

      fireEvent.change(foregroundInput, {
        target: { value: "rgb(255,255,255)" },
      });
      expect(screen.queryByText(/Use HEX/)).toBeNull();
      expect(foregroundInput).toHaveAttribute("aria-invalid", "false");
      const ratioText = screen.getByText(/Contrast ratio:/, { selector: "p" });
      expect(ratioText.textContent).toContain("21.00:1");
    });
  });

  describe("BorderRadius", () => {
    it("updates generated CSS output when a corner slider changes", () => {
      render(<BorderRadius />);

      const topLeftSlider = screen.getByLabelText(/Top Left:/i);
      fireEvent.change(topLeftSlider, { target: { value: "40" } });

      expect(
        screen.getByText(
          "border-radius: 100% 0% 100% 0% / 40% 100% 0% 60%;",
        ),
      ).toBeTruthy();
    });
  });

  describe("BoxShadow", () => {
    it("keeps live preview output and supports inset toggle", () => {
      render(<BoxShadow />);

      expect(
        screen.getByText("box-shadow: 5px 5px 5px 5px #FFFFFF inset;"),
      ).toBeTruthy();

      const blurSlider = screen.getByLabelText(/Blur/i);
      fireEvent.change(blurSlider, { target: { value: "12" } });
      expect(
        screen.getByText("box-shadow: 5px 5px 12px 5px #FFFFFF inset;"),
      ).toBeTruthy();

      const insetCheckbox = screen.getByRole("checkbox", { name: /Inset/i });
      fireEvent.click(insetCheckbox);
      expect(
        screen.getByText("box-shadow: 5px 5px 12px 5px #FFFFFF;"),
      ).toBeTruthy();
    });
  });

  describe("SlugGenerator", () => {
    it("normalizes accented and punctuated input", () => {
      expect(normalizeSlug("Déjà vu!!!  2026")).toBe("deja-vu-2026");
    });

    it("updates output in real time", () => {
      render(<SlugGenerator />);

      const input = screen.getByLabelText(/Write or paste your text here/i);
      fireEvent.change(input, { target: { value: "Déjà vu!!!  2026" } });

      expect(screen.getByText("deja-vu-2026")).toBeTruthy();
    });
  });

  describe("WordCounter", () => {
    it("counts unicode words correctly", () => {
      expect(countWords("café déjà vu")).toBe(3);
    });

    it("keeps real-time count updates and recommendation highlighting", () => {
      render(<WordCounter />);

      const textarea = screen.getByLabelText(/Write or paste your text/i);
      fireEvent.change(textarea, { target: { value: "hello world" } });

      expect(screen.getByText(/Words: 2/)).toBeTruthy();

      const blogPostCountCell = screen.getByText("2 / 1,000 - 2,500 words");
      expect(blogPostCountCell.className).toContain("tableCountRed");

      const xPostCountCell = screen.getByText("11 / 280 characters");
      expect(xPostCountCell.className).toContain("tableCountGreen");

      expect(screen.getByRole("table")).toBeTruthy();
    });
  });

  describe("Migration invariants", () => {
    it("does not rely on legacy tool global class names", () => {
      const filesToCheck = [
        "src/app/tools/(tools)/accessibility/contrast-checker/ContrastChecker.tsx",
        "src/app/tools/(tools)/css/border-radius/BorderRadius.tsx",
        "src/app/tools/(tools)/css/box-shadow/BoxShadow.tsx",
        "src/app/tools/(tools)/code/slug-generator/SlugGenerator.tsx",
        "src/app/tools/(tools)/text/word-counter/WordCounter.tsx",
      ];

      for (const filePath of filesToCheck) {
        const content = readFileSync(path.resolve(process.cwd(), filePath), "utf8");
        expect(content).not.toContain('className="tool__');
        expect(content).not.toContain('className="ul-list"');
      }
    });

    it("removes legacy tool page global stylesheet import", () => {
      const mainScss = readFileSync(
        path.resolve(process.cwd(), "src/styles/main.scss"),
        "utf8",
      );
      expect(mainScss).not.toContain('@use "./pages/toolPage";');
    });
  });
});
