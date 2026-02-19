import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

const getArticleBySlugMock = vi.fn();
const getToolRelatedContentMock = vi.fn();
const mockUsePathname = vi.fn(() => "/tools/css/border-radius");

vi.mock("next/link", () => ({
  default: ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
}));

vi.mock("@/lib/content", () => ({
  getArticleBySlug: getArticleBySlugMock,
  getToolRelatedContent: getToolRelatedContentMock,
}));

vi.mock("@/lib/mdx", () => ({
  compileMDX: vi.fn(async () => () => <p>Rendered article body</p>),
}));

vi.mock(
  "@/app/tools/(tools)/css/border-radius/BorderRadius",
  () => ({
    default: () => <div>Border Radius Tool</div>,
  }),
);

describe("related-section page integration", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/tools/css/border-radius");
    getArticleBySlugMock.mockReset();
    getToolRelatedContentMock.mockReset();
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as (query: string) => MediaQueryList;
  });

  it("renders RelatedSection on article pages when related content exists", async () => {
    getArticleBySlugMock.mockResolvedValue({
      title: "Test Related Article",
      slug: "test-related-article",
      date: "2024-10-15",
      resume: "Article with mixed related content.",
      category: "programming/html/semantics",
      published: true,
      content: "## Hello",
      resolvedRelatedTools: [
        {
          name: "Border Radius Generator",
          description: "Generate CSS border-radius values.",
          slug: "/tools/css/border-radius",
          category: "CSS",
          icon: "Squircle",
          taxonomyPaths: ["tools/css-tools/border-radius"],
        },
      ],
      resolvedRelatedContent: [
        {
          type: "article",
          title: "The Importance of Semantics in HTML",
          description: "Semantic tags improve accessibility and SEO.",
          href: "/blog/posts/importance-of-semantics-in-html",
          date: "2024-10-15",
          category: "programming/html/semantics",
        },
        {
          type: "tool",
          title: "Border Radius Generator",
          description: "Generate CSS border-radius values.",
          href: "/tools/css/border-radius",
          category: "CSS",
        },
      ],
    });

    const { default: ArticlePage } = await import("@/app/blog/posts/[slug]/page");
    const ui = await ArticlePage({
      params: Promise.resolve({ slug: "test-related-article" }),
    });

    render(ui);

    const heading = screen.getByRole("heading", { name: "Related" });
    const section = heading.closest("section");

    expect(heading).toBeTruthy();
    expect(section).toBeTruthy();
    expect(
      within(section as HTMLElement).getByText(
        "The Importance of Semantics in HTML",
      ),
    ).toBeTruthy();
    expect(
      within(section as HTMLElement).getAllByText("Border Radius Generator"),
    ).toHaveLength(1);
  });

  it("renders RelatedSection on tool pages when related content exists", async () => {
    getToolRelatedContentMock.mockResolvedValue([
      {
        type: "article",
        title: "Why a VPN doesn't really make you Anonymous",
        description: "A VPN improves privacy but not full anonymity.",
        href: "/blog/posts/vpn-anonymity-explained",
        date: "2024-10-15",
        category: "networking-security/privacy/vpn-anonymity",
      },
      {
        type: "article",
        title: "The Importance of Semantics in HTML",
        description: "Semantic tags improve accessibility and SEO.",
        href: "/blog/posts/importance-of-semantics-in-html",
        date: "2024-10-15",
        category: "programming/html/semantics",
      },
    ]);

    const { default: BorderRadiusPage } = await import(
      "@/app/tools/(tools)/css/border-radius/page"
    );
    const ui = await BorderRadiusPage();
    render(ui);

    expect(screen.getByRole("heading", { name: "Related" })).toBeTruthy();
    expect(screen.getByText("Why a VPN doesn't really make you Anonymous")).toBeTruthy();
    expect(screen.getByText("The Importance of Semantics in HTML")).toBeTruthy();
  });
});
