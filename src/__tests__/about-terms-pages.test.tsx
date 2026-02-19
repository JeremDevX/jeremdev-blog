import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import About, { metadata as aboutMetadata } from "@/app/about/page";
import TermsOfUse, { metadata as termsMetadata } from "@/app/termsofuse/page";

vi.mock("next/link", () => ({
  default: ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

describe("About and Terms pages", () => {
  it("exports accurate metadata for About and Terms pages", () => {
    expect(aboutMetadata.title).toBe("About TechHowlerX");
    expect(typeof aboutMetadata.description).toBe("string");
    expect((aboutMetadata.description as string).length).toBeGreaterThan(40);

    expect(termsMetadata.title).toBe("TechHowlerX Terms of Use");
    expect(typeof termsMetadata.description).toBe("string");
    expect((termsMetadata.description as string).length).toBeGreaterThan(40);
  });

  it("renders About page sections with creator, mission, voice, and wolf-brand narrative", () => {
    render(<About />);

    const main = screen.getByRole("main");
    expect(
      within(main).getByRole("heading", {
        level: 1,
        name: /about techhowlerx/i,
      }),
    ).toBeInTheDocument();
    expect(
      within(main).getByRole("heading", {
        level: 2,
        name: /who i am/i,
      }),
    ).toBeInTheDocument();
    expect(
      within(main).getByRole("heading", {
        level: 2,
        name: /mission and vision/i,
      }),
    ).toBeInTheDocument();
    expect(
      within(main).getByRole("heading", {
        level: 2,
        name: /why a human voice matters/i,
      }),
    ).toBeInTheDocument();
    expect(
      within(main).getByRole("heading", {
        level: 2,
        name: /the wolf behind the brand/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders plain-language Terms content for licensing, affiliate policy, privacy, and GDPR scope", () => {
    render(<TermsOfUse />);

    const main = screen.getByRole("main");
    expect(
      within(main).getByRole("heading", { level: 1, name: /terms of use/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/creative commons attribution 4\.0/i)).toBeInTheDocument();
    expect(screen.getByText(/affiliate disclosure/i)).toBeInTheDocument();
    expect(screen.getByText(/vercel analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/no cookies/i)).toBeInTheDocument();
    expect(screen.getByText(/no personal data/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /gdpr and jurisdiction/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/france and the european union/i)).toBeInTheDocument();
  });
});
