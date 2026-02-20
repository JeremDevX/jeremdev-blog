import { describe, it, expect } from "vitest";
import {
  buildTaxonomyPath,
  buildSidebarTree,
  getDefaultOpenItems,
  hasContent,
  type SidebarItem,
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
  category: "networking-security/privacy",
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
        "accessibility/standards",
      );
    });

    it("maps CSS tools to tools/css-tools taxonomy", () => {
      const borderRadius = mockTools.find(
        (tool) => tool.slug === "/tools/css/border-radius",
      );
      const boxShadow = mockTools.find(
        (tool) => tool.slug === "/tools/css/box-shadow",
      );
      expect(borderRadius?.taxonomyPaths).toContain("tools/css-tools");
      expect(boxShadow?.taxonomyPaths).toContain("tools/css-tools");
    });
  });

  describe("buildTaxonomyPath", () => {
    it("joins ancestors and slug with /", () => {
      expect(buildTaxonomyPath(["programming"], "css")).toBe("programming/css");
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

      // Navigate to networking-security > privacy
      const networkingSecurity = tree.find((b) => b.node.slug === "networking-security");
      expect(networkingSecurity).toBeDefined();
      const privacy = networkingSecurity!.children.find((b) => b.node.slug === "privacy");
      expect(privacy).toBeDefined();
      expect(privacy!.items).toHaveLength(1);
      expect(privacy!.items[0].type).toBe("article");
      expect(privacy!.items[0].name).toBe("VPN Anonymity Explained");
      expect(privacy!.items[0].href).toBe("/blog/posts/vpn-anonymity-explained");
    });

    it("places tools in correct taxonomy branches", () => {
      const tree = buildSidebarTree(taxonomyTree, [], mockTools);

      // Navigate to tools > css-tools
      const toolsBranch = tree.find((b) => b.node.slug === "tools");
      expect(toolsBranch).toBeDefined();
      const cssTools = toolsBranch!.children.find((b) => b.node.slug === "css-tools");
      expect(cssTools).toBeDefined();
      expect(cssTools!.items).toHaveLength(4);
      expect(cssTools!.items.some((item) => item.name === "Box Shadow Generator")).toBe(true);
      expect(cssTools!.items.some((item) => item.href === "/tools/css/box-shadow")).toBe(true);
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
      expect(
        standards?.items.some(
          (item) => item.href === "/tools/accessibility/contrast-checker",
        ),
      ).toBe(true);
    });

    it("sorts merged items alphabetically within a branch", () => {
      const articleInToolBranch: ArticleMeta = {
        title: "A Box Shadow Guide",
        slug: "a-box-shadow-guide",
        date: "2024-10-16",
        resume: "An article in a shared branch",
        category: "tools/css-tools",
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

      expect(cssTools!.items.map((item) => item.name)).toEqual([
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

    it("supports strict content-type separation by input dataset", () => {
      const articleInToolBranch: ArticleMeta = {
        title: "A Box Shadow Guide",
        slug: "a-box-shadow-guide",
        date: "2024-10-16",
        resume: "An article in a tools taxonomy branch",
        category: "tools/css-tools",
        published: true,
      };

      const boxShadowTool = mockTools.find(
        (tool) => tool.slug === "/tools/css/box-shadow",
      );
      expect(boxShadowTool).toBeDefined();

      const articleOnlyTree = buildSidebarTree(
        taxonomyTree,
        [articleInToolBranch],
        [],
      );
      const toolOnlyTree = buildSidebarTree(
        taxonomyTree,
        [],
        boxShadowTool ? [boxShadowTool] : [],
      );

      const flattenTypes = (branches: typeof articleOnlyTree): SidebarItem["type"][] =>
        branches.flatMap((branch) => [
          ...branch.items.map((item) => item.type),
          ...flattenTypes(branch.children),
        ]);

      expect(flattenTypes(articleOnlyTree).every((type) => type === "article")).toBe(true);
      expect(flattenTypes(toolOnlyTree).every((type) => type === "tool")).toBe(true);
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
