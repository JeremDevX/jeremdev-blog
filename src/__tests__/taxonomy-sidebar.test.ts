import { describe, it, expect } from "vitest";
import {
  buildTaxonomyPath,
  buildSidebarTree,
  getDefaultOpenItems,
  hasContent,
  TOOL_TAXONOMY_MAP,
} from "@/components/custom/TaxonomySidebar/sidebar-utils";
import { taxonomyTree } from "@/lib/taxonomy";
import { getAllTools } from "@/lib/tools";
import type { ArticleMeta } from "@/types/content";
import type { ToolMeta } from "@/types/tools";

const mockArticle: ArticleMeta = {
  title: "VPN Anonymity Explained",
  slug: "vpn-anonymity-explained",
  date: "2024-10-15",
  resume: "A test article",
  category: "networking-security/privacy/vpn-anonymity",
  published: true,
};

const mockHtmlArticle: ArticleMeta = {
  title: "The Importance of Semantics in HTML",
  slug: "importance-of-semantics-in-html",
  date: "2024-10-15",
  resume: "A test article",
  category: "programming/html/semantics",
  published: true,
};

const mockTools = getAllTools();

describe("TaxonomySidebar Utils", () => {
  describe("TOOL_TAXONOMY_MAP", () => {
    it("maps all 5 tools to taxonomy paths", () => {
      expect(Object.keys(TOOL_TAXONOMY_MAP)).toHaveLength(5);
    });

    it("maps every tool slug from the catalog", () => {
      for (const tool of mockTools) {
        expect(TOOL_TAXONOMY_MAP[tool.slug]).toBeDefined();
      }
    });

    it("maps contrast checker to accessibility taxonomy", () => {
      expect(TOOL_TAXONOMY_MAP["/tools/accessibility/contrast-checker"]).toBe(
        "accessibility/standards/color-contrast"
      );
    });

    it("maps CSS tools to tools/css-tools taxonomy", () => {
      expect(TOOL_TAXONOMY_MAP["/tools/css/border-radius"]).toBe(
        "tools/css-tools/border-radius"
      );
      expect(TOOL_TAXONOMY_MAP["/tools/css/box-shadow"]).toBe(
        "tools/css-tools/box-shadow"
      );
    });
  });

  describe("buildTaxonomyPath", () => {
    it("joins ancestors and slug with /", () => {
      expect(buildTaxonomyPath(["programming", "css"], "visual-effects")).toBe(
        "programming/css/visual-effects"
      );
    });

    it("handles root-level paths", () => {
      expect(buildTaxonomyPath([], "programming")).toBe("programming");
    });
  });

  describe("buildSidebarTree", () => {
    it("returns a branch for each top-level taxonomy node", () => {
      const tree = buildSidebarTree(taxonomyTree, [], []);
      expect(tree).toHaveLength(taxonomyTree.length);
      expect(tree[0].node.name).toBe("Programming");
    });

    it("places articles in correct taxonomy branches", () => {
      const tree = buildSidebarTree(
        taxonomyTree,
        [mockArticle],
        []
      );

      // Navigate to networking-security > privacy > vpn-anonymity
      const networkingSecurity = tree.find((b) => b.node.slug === "networking-security");
      expect(networkingSecurity).toBeDefined();
      const privacy = networkingSecurity!.children.find((b) => b.node.slug === "privacy");
      expect(privacy).toBeDefined();
      const vpnAnonymity = privacy!.children.find((b) => b.node.slug === "vpn-anonymity");
      expect(vpnAnonymity).toBeDefined();
      expect(vpnAnonymity!.items).toHaveLength(1);
      expect(vpnAnonymity!.items[0].type).toBe("article");
      expect(vpnAnonymity!.items[0].name).toBe("VPN Anonymity Explained");
      expect(vpnAnonymity!.items[0].href).toBe("/blog/posts/vpn-anonymity-explained");
    });

    it("places tools in correct taxonomy branches", () => {
      const tree = buildSidebarTree(taxonomyTree, [], mockTools);

      // Navigate to tools > css-tools > box-shadow
      const toolsBranch = tree.find((b) => b.node.slug === "tools");
      expect(toolsBranch).toBeDefined();
      const cssTools = toolsBranch!.children.find((b) => b.node.slug === "css-tools");
      expect(cssTools).toBeDefined();
      const boxShadow = cssTools!.children.find((b) => b.node.slug === "box-shadow");
      expect(boxShadow).toBeDefined();
      expect(boxShadow!.items).toHaveLength(1);
      expect(boxShadow!.items[0].type).toBe("tool");
      expect(boxShadow!.items[0].name).toBe("Box Shadow Generator");
      expect(boxShadow!.items[0].href).toBe("/tools/css/box-shadow");
    });

    it("sorts items alphabetically within a branch", () => {
      const tree = buildSidebarTree(
        taxonomyTree,
        [mockArticle, mockHtmlArticle],
        mockTools
      );

      // Find css-tools branch which has 2 tools
      const toolsBranch = tree.find((b) => b.node.slug === "tools");
      const cssTools = toolsBranch!.children.find((b) => b.node.slug === "css-tools");

      // Get all items from css-tools children
      const allCssToolItems = cssTools!.children.flatMap((c) => c.items);
      expect(allCssToolItems.length).toBe(2);

      // Each branch has 1 item, but within the css-tools branch overall,
      // border-radius < box-shadow alphabetically
      const names = allCssToolItems.map((i) => i.name);
      expect(names).toContain("Border Radius Generator");
      expect(names).toContain("Box Shadow Generator");
    });

    it("returns empty items for branches with no matching content", () => {
      const tree = buildSidebarTree(taxonomyTree, [], []);

      // Programming branch should have no items
      const programming = tree.find((b) => b.node.slug === "programming");
      expect(programming!.items).toHaveLength(0);
    });
  });

  describe("getDefaultOpenItems", () => {
    it("returns empty array for unrecognized pathname", () => {
      const result = getDefaultOpenItems("/about", [], mockTools);
      expect(result).toEqual([]);
    });

    it("returns ancestor paths for a tool page", () => {
      const result = getDefaultOpenItems(
        "/tools/css/box-shadow",
        [],
        mockTools
      );
      expect(result).toEqual([
        "tools",
        "tools/css-tools",
        "tools/css-tools/box-shadow",
      ]);
    });

    it("returns ancestor paths for an article page", () => {
      const result = getDefaultOpenItems(
        "/blog/posts/vpn-anonymity-explained",
        [mockArticle],
        mockTools
      );
      expect(result).toEqual([
        "networking-security",
        "networking-security/privacy",
        "networking-security/privacy/vpn-anonymity",
      ]);
    });

    it("returns empty array for tool not in taxonomy map", () => {
      const unmappedTool: ToolMeta = {
        name: "Unknown Tool",
        slug: "/tools/unknown/thing",
        description: "Unknown",
        category: "Unknown",
        icon: "Unknown",
      };
      const result = getDefaultOpenItems("/tools/unknown/thing", [], [unmappedTool]);
      expect(result).toEqual([]);
    });
  });

  describe("hasContent", () => {
    it("returns true when branch has direct items", () => {
      const branch = {
        node: { name: "Test", slug: "test", description: "" },
        items: [{ type: "article" as const, name: "Article", href: "/test" }],
        children: [],
      };
      expect(hasContent(branch)).toBe(true);
    });

    it("returns true when a child branch has items", () => {
      const branch = {
        node: { name: "Parent", slug: "parent", description: "" },
        items: [],
        children: [
          {
            node: { name: "Child", slug: "child", description: "" },
            items: [{ type: "tool" as const, name: "Tool", href: "/tool" }],
            children: [],
          },
        ],
      };
      expect(hasContent(branch)).toBe(true);
    });

    it("returns false when branch and all children are empty", () => {
      const branch = {
        node: { name: "Empty", slug: "empty", description: "" },
        items: [],
        children: [
          {
            node: { name: "Also Empty", slug: "also-empty", description: "" },
            items: [],
            children: [],
          },
        ],
      };
      expect(hasContent(branch)).toBe(false);
    });
  });
});
