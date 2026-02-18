import Link from "next/link";
import type { ToolMeta } from "@/types/tools";
import styles from "./BridgeCallout.module.scss";

export type BridgeCalloutTool = Pick<ToolMeta, "name" | "description" | "slug">;

export interface BridgeCalloutProps {
  tool?: BridgeCalloutTool | null;
}

function isValidTool(tool: BridgeCalloutProps["tool"]): tool is BridgeCalloutTool {
  return Boolean(
    tool &&
      typeof tool.name === "string" &&
      tool.name.trim().length > 0 &&
      typeof tool.description === "string" &&
      tool.description.trim().length > 0 &&
      typeof tool.slug === "string" &&
      tool.slug.trim().length > 0,
  );
}

export default function BridgeCallout({ tool }: BridgeCalloutProps) {
  if (!isValidTool(tool)) {
    return null;
  }

  return (
    <aside className={styles.wrapper} aria-label="Related tool suggestion">
      <Link
        href={tool.slug}
        className={styles.link}
        aria-label={`Try the ${tool.name} tool: ${tool.description}`}
      >
        <h2 className={styles.heading}>🔧 Try it yourself</h2>
        <p className={styles.toolName}>{tool.name}</p>
        <p className={styles.description}>{tool.description}</p>
        <span className={styles.cta} aria-hidden="true">
          Open tool
        </span>
      </Link>
    </aside>
  );
}
