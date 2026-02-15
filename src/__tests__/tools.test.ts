import { describe, it, expect } from "vitest";
import { getAllTools, getToolsByCategory, getToolBySlug } from "@/lib/tools";

describe("Tools Catalog", () => {
  describe("getAllTools", () => {
    it("returns all 5 tools", () => {
      const tools = getAllTools();
      expect(tools).toHaveLength(5);
    });

    it("every tool has required fields", () => {
      for (const tool of getAllTools()) {
        expect(tool.name).toBeTruthy();
        expect(tool.slug).toMatch(/^\/tools\//);
        expect(tool.description).toBeTruthy();
        expect(tool.category).toBeTruthy();
        expect(tool.icon).toBeTruthy();
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
      expect(css?.tools).toHaveLength(2);

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
});
