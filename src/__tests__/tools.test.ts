import { describe, it, expect } from "vitest";
import {
  getAllTools,
  getToolsByCategory,
  getToolBySlug,
  getToolsByTaxonomyPath,
} from "@/lib/tools";

describe("Tools Catalog", () => {
  describe("getAllTools", () => {
    it("returns all 7 tools", () => {
      const tools = getAllTools();
      expect(tools).toHaveLength(7);
    });

    it("every tool has required fields", () => {
      for (const tool of getAllTools()) {
        expect(tool.name).toBeTruthy();
        expect(tool.slug).toMatch(/^\/tools\//);
        expect(tool.description).toBeTruthy();
        expect(tool.category).toBeTruthy();
        expect(tool.icon).toBeTruthy();
        expect(tool.taxonomyPaths.length).toBeGreaterThan(0);
      }
    });
  });

  describe("getToolsByCategory", () => {
    it("returns categories in correct order", () => {
      const categories = getToolsByCategory();
      const names = categories.map((c) => c.name);
      expect(names).toEqual(["Accessibility", "CSS", "Development", "Content"]);
    });

    it("groups tools correctly", () => {
      const categories = getToolsByCategory();
      const css = categories.find((c) => c.name === "CSS");
      expect(css?.tools).toHaveLength(4);

      const accessibility = categories.find((c) => c.name === "Accessibility");
      expect(accessibility?.tools).toHaveLength(1);
    });

    it("total tools across categories equals getAllTools count", () => {
      const categories = getToolsByCategory();
      const total = categories.reduce((sum, cat) => sum + cat.tools.length, 0);
      expect(total).toBe(getAllTools().length);
    });
  });

  describe("getToolBySlug", () => {
    it("finds a tool by its slug", () => {
      const tool = getToolBySlug("/tools/css/border-radius");
      expect(tool).toBeDefined();
      expect(tool!.name).toBe("Border Radius Generator");
    });

    it("returns undefined for non-existent slug", () => {
      const tool = getToolBySlug("/tools/nonexistent");
      expect(tool).toBeUndefined();
    });
  });

  describe("getToolsByTaxonomyPath", () => {
    it("returns exact tools for a topic taxonomy path", () => {
      const tools = getToolsByTaxonomyPath("tools/code-tools");
      expect(tools).toHaveLength(1);
      expect(tools[0].name).toBe("Slug Generator");
    });

    it("returns descendant tools for a parent taxonomy path", () => {
      const tools = getToolsByTaxonomyPath("tools/css-tools");
      expect(tools).toHaveLength(4);
      expect(tools.map((tool) => tool.name)).toContain("Border Radius Generator");
      expect(tools.map((tool) => tool.name)).toContain("Box Shadow Generator");
      expect(tools.map((tool) => tool.name)).toContain("Flexbox Playground");
      expect(tools.map((tool) => tool.name)).toContain("Grid Playground");
    });

    it("returns all tools for the Tools big topic", () => {
      const tools = getToolsByTaxonomyPath("tools");
      expect(tools).toHaveLength(7);
    });

    it("returns accessibility tool for the accessibility branch", () => {
      const tools = getToolsByTaxonomyPath("accessibility");
      expect(tools).toHaveLength(1);
      expect(tools[0].name).toBe("Contrast Checker");
    });

    it("returns empty for invalid paths", () => {
      const tools = getToolsByTaxonomyPath("nonexistent/path");
      expect(tools).toEqual([]);
    });
  });
});
