import { describe, expect, it } from "vitest";
import { metadata as contrastCheckerMetadata } from "@/app/tools/(tools)/accessibility/contrast-checker/page";
import { metadata as borderRadiusMetadata } from "@/app/tools/(tools)/css/border-radius/page";
import { metadata as boxShadowMetadata } from "@/app/tools/(tools)/css/box-shadow/page";
import { metadata as flexboxPlaygroundMetadata } from "@/app/tools/(tools)/css/flexbox-playground/page";
import { metadata as gridPlaygroundMetadata } from "@/app/tools/(tools)/css/grid-playground/page";
import { metadata as slugGeneratorMetadata } from "@/app/tools/(tools)/code/slug-generator/page";
import { metadata as wordCounterMetadata } from "@/app/tools/(tools)/text/word-counter/page";

const METADATA_CASES = [
  {
    metadata: contrastCheckerMetadata,
    title: "Contrast Checker",
    canonical: "/tools/accessibility/contrast-checker",
  },
  {
    metadata: borderRadiusMetadata,
    title: "Border Radius Generator",
    canonical: "/tools/css/border-radius",
  },
  {
    metadata: boxShadowMetadata,
    title: "Box Shadow Generator",
    canonical: "/tools/css/box-shadow",
  },
  {
    metadata: flexboxPlaygroundMetadata,
    title: "Flexbox Playground",
    canonical: "/tools/css/flexbox-playground",
  },
  {
    metadata: gridPlaygroundMetadata,
    title: "Grid Playground",
    canonical: "/tools/css/grid-playground",
  },
  {
    metadata: slugGeneratorMetadata,
    title: "Slug Generator",
    canonical: "/tools/code/slug-generator",
  },
  {
    metadata: wordCounterMetadata,
    title: "Word Counter",
    canonical: "/tools/text/word-counter",
  },
];

describe("Tool pages metadata", () => {
  for (const testCase of METADATA_CASES) {
    it(`exports valid metadata for ${testCase.canonical}`, () => {
      expect(testCase.metadata.title).toBe(testCase.title);
      expect(testCase.metadata.description).toBeTruthy();
      expect(testCase.metadata.alternates?.canonical).toBe(testCase.canonical);
      expect(testCase.metadata.openGraph?.title).toBe(testCase.title);
      expect(testCase.metadata.openGraph?.description).toBeTruthy();
    });
  }
});
