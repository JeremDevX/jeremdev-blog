import CopyButton from "@/components/custom/CopyButton";
import styles from "./ToolOutput.module.scss";

export type ToolOutputProps = {
  output: string;
  valueToCopy?: string;
  className?: string;
};

export default function ToolOutput({
  output,
  valueToCopy,
  className,
}: ToolOutputProps) {
  const resolvedValueToCopy = valueToCopy ?? output;
  const containerClassName = [styles.container, className ?? null]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={containerClassName} aria-label="Tool output">
      <div className={styles.header}>
        <span className={styles.label}>Output</span>
        <CopyButton valueToCopy={resolvedValueToCopy} />
      </div>
      <pre className={styles.outputBlock}>
        <code>{output}</code>
      </pre>
    </section>
  );
}
