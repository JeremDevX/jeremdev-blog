import { evaluate } from "@mdx-js/mdx";
import type { MDXProps } from "mdx/types";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import type { ComponentType } from "react";
import { mdxComponents } from "@/lib/mdx-components";

export async function compileMDX(
  source: string
): Promise<ComponentType<MDXProps>> {
  try {
    const { default: MDXContent } = await evaluate(source, {
      ...runtime,
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypePrettyCode, { theme: "one-dark-pro" }]],
      useMDXComponents: () => mdxComponents,
    });
    return MDXContent;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown MDX compilation error";
    throw new Error(`Failed to compile MDX: ${message}`);
  }
}
