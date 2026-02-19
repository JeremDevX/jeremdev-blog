import { describe, it, expect } from "vitest";
import {
  buildTaxonomyPath,
  buildSidebarTree,
  getDefaultOpenItems,
  hasContent,
} from "@/components/custom/TaxonomySidebar/sidebar-utils";
import { findTaxonomyNode, taxonomyTree } from "@/lib/taxonomy";
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

const mockTools = getAllTools();

describe("TaxonomySidebar Utils", () => {
  describe("tool taxonomy paths", () => {
    it("contains taxonomy paths for all tools from the catalog", () => {
      for (const tool of mockTools) {
        expect(tool.taxonomyPaths.length).toBeGreaterThan(0);
      }
    });

    it("resolves every tool taxonomy path to a valid taxonomy node", () => {
      for (const tool of mockTools) {
        for (const taxonomyPath of tool.taxonomyPaths) {
          expect(findTaxonomyNode(taxonomyPath)).toBeDefined();
        }
      }
    });

    it("maps contrast checker to accessibility taxonomy", () => {
      const contrastChecker = mockTools.find(
        (tool) => tool.slug === "/tools/accessibility/contrast-checker",
      );
      expect(contrastChecker).toBeDefined();
      expect(contrastChecker?.taxonomyPaths).toContain(
        "accessibility/standards/color-contrast",
      );
    });

    it("maps CSS tools to tools/css-tools taxonomy", () => {
      const borderRadius = mockTools.find(
        (tool) => tool.slug === "/tools/css/border-radius",
      );
      const boxShadow = mockTools.find(
        (tool) => tool.slug === "/tools/css/box-shadow",
      );
      expect(borderRadius?.taxonomyPaths).toContain("tools/css-tools/border-radius");
      expect(boxShadow?.taxonomyPaths).toContain("tools/css-tools/box-shadow");
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

    it("renders a multi-mapped tool once using its most specific taxonomy path", () => {
      const tree = buildSidebarTree(taxonomyTree, [], mockTools);

      const flattenItems = (branches: typeof tree): { href: string; name: string }[] =>
        branches.flatMap((branch) => [
          ...branch.items.map((item) => ({ href: item.href, name: item.name })),
          ...flattenItems(branch.children),
        ]);

      const allItems = flattenItems(tree);
      const contrastEntries = allItems.filter(
        (item) => item.href === "/tools/accessibility/contrast-checker",
      );

      expect(contrastEntries).toHaveLength(1);

      const accessibility = tree.find((b) => b.node.slug === "accessibility");
      const standards = accessibility?.children.find((b) => b.node.slug === "standards");
      const colorContrast = standards?.children.find(
        (b) => b.node.slug === "color-contrast",
      );
      expect(colorContrast?.items.some((item) => item.href === "/tools/accessibility/contrast-checker")).toBe(true);
    });

    it("sorts merged items alphabetically within a branch", () => {
      const articleInToolBranch: ArticleMeta = {
        title: "A Box Shadow Guide",
        slug: "a-box-shadow-guide",
        date: "2024-10-16",
        resume: "An article in a shared branch",
        category: "tools/css-tools/box-shadow",
        published: true,
      };

      const boxShadowTool = mockTools.find(
        (tool) => tool.slug === "/tools/css/box-shadow",
      );
      expect(boxShadowTool).toBeDefined();

      const tree = buildSidebarTree(
        taxonomyTree,
        [articleInToolBranch],
        boxShadowTool ? [boxShadowTool] : [],
      );

      const toolsBranch = tree.find((b) => b.node.slug === "tools");
      expect(toolsBranch).toBeDefined();
      const cssTools = toolsBranch!.children.find((b) => b.node.slug === "css-tools");
      expect(cssTools).toBeDefined();
      const boxShadow = cssTools!.children.find((b) => b.node.slug === "box-shadow");
      expect(boxShadow).toBeDefined();

      expect(boxShadow!.items.map((item) => item.name)).toEqual([
        "A Box Shadow Guide",
        "Box Shadow Generator",
      ]);
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

    it("returns ancestor paths for a tool page with trailing slash", () => {
      const result = getDefaultOpenItems(
        "/tools/css/box-shadow/",
        [],
        mockTools
      );
      expect(result).toEqual([
        "tools",
        "tools/css-tools",
        "tools/css-tools/box-shadow",
      ]);
    });

    it("returns ancestor paths for an article page with trailing slash", () => {
      const result = getDefaultOpenItems(
        "/blog/posts/vpn-anonymity-explained/",
        [mockArticle],
        mockTools
      );
      expect(result).toEqual([
        "networking-security",
        "networking-security/privacy",
        "networking-security/privacy/vpn-anonymity",
      ]);
    });

    it("returns empty array for tool with unknown taxonomy paths", () => {
      const unmappedTool: ToolMeta = {
        name: "Unknown Tool",
        slug: "/tools/unknown/thing",
        description: "Unknown",
        category: "Unknown",
        icon: "Unknown",
        taxonomyPaths: ["unknown/thing"],
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
