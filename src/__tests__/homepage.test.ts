import { describe, it, expect, vi } from "vitest";

// Mock Next.js modules
vi.mock("next/link", () => ({
  default: vi.fn(),
}));
vi.mock("next/image", () => ({
  default: vi.fn(),
}));

// Mock SCSS modules
vi.mock("../app/HomePage.module.scss", () => ({
  default: {},
}));
vi.mock(
  "../components/custom/ContentCard/ContentCard.module.scss",
  () => ({
    default: {},
  })
);
vi.mock(
  "../components/custom/HeroSection/HeroSection.module.scss",
  () => ({
    default: {},
  })
);

// Mock content library
vi.mock("../lib/content", () => ({
  getLatestArticles: vi.fn().mockResolvedValue([
    {
      title: "Test Article",
      slug: "test-article",
      date: "2026-01-15",
      resume: "A test article description",
      category: "programming/javascript",
      coverImage: "/images/test.png",
      published: true,
    },
  ]),
}));

describe("Homepage structure", () => {
  it("exports metadata with Open Graph tags", async () => {
    const { metadata } = await import("@/app/page");

    expect(metadata).toBeDefined();
    expect(metadata.title).toBe("TechHowlerX - Tech Blog & Dev Tools");
    expect(metadata.description).toBeDefined();
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph!.title).toBe(
      "TechHowlerX - Tech Blog & Dev Tools"
    );
    expect(metadata.openGraph!.type).toBe("website");
    expect(metadata.openGraph!.siteName).toBe("TechHowlerX");
  });

  it("exports default async function as page component", async () => {
    const pageModule = await import("@/app/page");
    expect(typeof pageModule.default).toBe("function");
  });
});

describe("ContentCard component", () => {
  it("exports default function and ContentCardProps type", async () => {
    const module = await import(
      "@/components/custom/ContentCard/ContentCard"
    );
    expect(typeof module.default).toBe("function");
  });

  it("re-exports from index", async () => {
    const module = await import("@/components/custom/ContentCard");
    expect(typeof module.default).toBe("function");
  });
});

describe("HeroSection component", () => {
  it("exports default function", async () => {
    const module = await import(
      "@/components/custom/HeroSection/HeroSection"
    );
    expect(typeof module.default).toBe("function");
  });

  it("re-exports from index", async () => {
    const module = await import("@/components/custom/HeroSection");
    expect(typeof module.default).toBe("function");
  });
});

describe("Homepage tools data", () => {
  it("page module can be imported without errors", async () => {
    const pageModule = await import("@/app/page");
    expect(pageModule).toBeDefined();
    expect(pageModule.metadata).toBeDefined();
  });
});
