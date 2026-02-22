"use client";

import ToolOutput from "@/components/custom/ToolOutput";
import { useMemo, useState } from "react";
import styles from "./AriaSemanticChecker.module.scss";

export type IssueSeverity = "error" | "warning" | "info";

export type AuditIssue = {
  id: string;
  severity: IssueSeverity;
  rule: string;
  message: string;
  recommendation: string;
  selector?: string;
};

type AnalysisStatus = "idle" | "ready" | "analyzed" | "parse-error";

type SeverityCounts = Record<IssueSeverity, number>;

const MAX_HTML_INPUT_LENGTH = 200_000;

const EXAMPLE_HTML = `<section>
  <h1>Page title</h1>
  <h3>Skipped heading level</h3>
  <img src="/hero.jpg">
  <a>Read more</a>
  <button></button>
  <input id="email" type="email">
  <input id="email" type="text">
  <div tabindex="5">Custom focus target</div>
  <div aria-hidden="true">
    <button>Focusable in hidden container</button>
  </div>
</section>`;

const VALID_ARIA_ROLES = new Set([
  "alert",
  "alertdialog",
  "application",
  "article",
  "banner",
  "blockquote",
  "button",
  "caption",
  "cell",
  "checkbox",
  "code",
  "columnheader",
  "combobox",
  "complementary",
  "contentinfo",
  "definition",
  "deletion",
  "dialog",
  "directory",
  "document",
  "emphasis",
  "feed",
  "figure",
  "form",
  "generic",
  "grid",
  "gridcell",
  "group",
  "heading",
  "img",
  "insertion",
  "link",
  "list",
  "listbox",
  "listitem",
  "log",
  "main",
  "marquee",
  "math",
  "menu",
  "menubar",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "meter",
  "navigation",
  "none",
  "note",
  "option",
  "paragraph",
  "presentation",
  "progressbar",
  "radio",
  "radiogroup",
  "region",
  "row",
  "rowgroup",
  "rowheader",
  "scrollbar",
  "search",
  "searchbox",
  "separator",
  "slider",
  "spinbutton",
  "status",
  "strong",
  "subscript",
  "superscript",
  "switch",
  "tab",
  "table",
  "tablist",
  "tabpanel",
  "term",
  "textbox",
  "time",
  "timer",
  "toolbar",
  "tooltip",
  "tree",
  "treegrid",
  "treeitem",
]);

const SEVERITY_PRIORITY: Record<IssueSeverity, number> = {
  error: 0,
  warning: 1,
  info: 2,
};

function normalizeTextContent(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function buildCounts(issues: AuditIssue[]): SeverityCounts {
  return issues.reduce<SeverityCounts>(
    (counts, issue) => {
      counts[issue.severity] += 1;
      return counts;
    },
    { error: 0, warning: 0, info: 0 },
  );
}

function getAriaLabelledbyText(
  element: Element,
  doc: Document,
): string {
  const ids = normalizeTextContent(element.getAttribute("aria-labelledby"));
  if (!ids) {
    return "";
  }

  return ids
    .split(/\s+/)
    .map((id) => normalizeTextContent(doc.getElementById(id)?.textContent))
    .filter(Boolean)
    .join(" ")
    .trim();
}

function escapeAttributeValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function isButtonLikeInput(element: Element): boolean {
  if (element.tagName.toLowerCase() !== "input") {
    return false;
  }

  const type = (element.getAttribute("type") ?? "text").toLowerCase();
  return ["button", "submit", "reset", "image", "hidden"].includes(type);
}

export function getSelector(element: Element): string {
  const parts: string[] = [];
  let cursor: Element | null = element;

  while (cursor) {
    const currentElement: Element = cursor;
    const tagName = currentElement.tagName.toLowerCase();
    if (!tagName || tagName === "html") {
      break;
    }

    if (currentElement.id) {
      parts.unshift(`${tagName}#${currentElement.id}`);
      break;
    }

    let segment = tagName;
    const parentElement: Element | null = currentElement.parentElement;
    if (parentElement) {
      const sameTagSiblings = Array.from(parentElement.children).filter(
        (child) => child.tagName === currentElement.tagName,
      );
      if (sameTagSiblings.length > 1) {
        const index = sameTagSiblings.indexOf(currentElement) + 1;
        segment += `:nth-of-type(${index})`;
      }
    }

    parts.unshift(segment);
    if (tagName === "body" || parts.length >= 5) {
      break;
    }
    cursor = parentElement;
  }

  return parts.join(" > ");
}

export function isFocusable(element: Element): boolean {
  const tagName = element.tagName.toLowerCase();
  const isDisabled = element.hasAttribute("disabled");
  const tabIndexAttr = element.getAttribute("tabindex");
  const tabIndex = tabIndexAttr === null ? null : Number.parseInt(tabIndexAttr, 10);

  if (tabIndex !== null && !Number.isNaN(tabIndex) && tabIndex >= 0) {
    return true;
  }

  if (isDisabled) {
    return false;
  }

  if (element.getAttribute("contenteditable")?.toLowerCase() === "true") {
    return true;
  }

  if (tagName === "a") {
    return Boolean(normalizeTextContent(element.getAttribute("href")));
  }

  if (["button", "select", "textarea", "summary", "iframe"].includes(tagName)) {
    return true;
  }

  if (tagName === "input") {
    const type = (element.getAttribute("type") ?? "text").toLowerCase();
    return type !== "hidden";
  }

  if (tagName === "audio" || tagName === "video") {
    return element.hasAttribute("controls");
  }

  return false;
}

export function hasAccessibleName(element: Element, doc: Document): boolean {
  const ariaLabel = normalizeTextContent(element.getAttribute("aria-label"));
  if (ariaLabel) {
    return true;
  }

  if (getAriaLabelledbyText(element, doc)) {
    return true;
  }

  const tagName = element.tagName.toLowerCase();

  if (tagName === "img") {
    return element.hasAttribute("alt");
  }

  if (tagName === "input") {
    const type = (element.getAttribute("type") ?? "text").toLowerCase();
    if (["button", "submit", "reset"].includes(type)) {
      return Boolean(normalizeTextContent(element.getAttribute("value")));
    }
    if (type === "image") {
      return Boolean(normalizeTextContent(element.getAttribute("alt")));
    }
  }

  const textContent = normalizeTextContent(element.textContent);
  if (textContent) {
    return true;
  }

  const title = normalizeTextContent(element.getAttribute("title"));
  if (title) {
    return true;
  }

  if (tagName === "button") {
    const imageWithAlt = element.querySelector("img[alt]");
    if (imageWithAlt) {
      return true;
    }
  }

  return false;
}

export function hasAssociatedLabel(control: Element, doc: Document): boolean {
  if (hasAccessibleName(control, doc)) {
    return true;
  }

  const id = normalizeTextContent(control.getAttribute("id"));
  if (id) {
    const escapedId = escapeAttributeValue(id);
    const matchingLabels = Array.from(
      doc.querySelectorAll(`label[for="${escapedId}"]`),
    );
    if (
      matchingLabels.some((label) =>
        normalizeTextContent(label.textContent) || hasAccessibleName(label, doc),
      )
    ) {
      return true;
    }
  }

  const wrappingLabel = control.closest("label");
  if (wrappingLabel) {
    return Boolean(normalizeTextContent(wrappingLabel.textContent));
  }

  return false;
}

function sortIssues(issues: AuditIssue[]): AuditIssue[] {
  return [...issues].sort((left, right) => {
    const severityDiff =
      SEVERITY_PRIORITY[left.severity] - SEVERITY_PRIORITY[right.severity];
    if (severityDiff !== 0) {
      return severityDiff;
    }

    const ruleDiff = left.rule.localeCompare(right.rule);
    if (ruleDiff !== 0) {
      return ruleDiff;
    }

    return (left.selector ?? "").localeCompare(right.selector ?? "");
  });
}

export function analyzeAriaAndSemantics(html: string): AuditIssue[] {
  const trimmedHtml = html.trim();
  if (!trimmedHtml) {
    return [];
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(trimmedHtml, "text/html");
  const issues: AuditIssue[] = [];
  let issueCounter = 0;

  const pushIssue = (partial: Omit<AuditIssue, "id">) => {
    issueCounter += 1;
    issues.push({
      id: `${partial.rule}-${issueCounter}`,
      ...partial,
    });
  };

  const idMap = new Map<string, Element[]>();
  for (const element of Array.from(doc.querySelectorAll("[id]"))) {
    const idValue = normalizeTextContent(element.getAttribute("id"));
    if (!idValue) {
      continue;
    }

    const bucket = idMap.get(idValue) ?? [];
    bucket.push(element);
    idMap.set(idValue, bucket);
  }

  for (const [idValue, elements] of idMap) {
    if (elements.length <= 1) {
      continue;
    }

    pushIssue({
      severity: "error",
      rule: "duplicate-id",
      message: `The id "${idValue}" is used ${elements.length} times.`,
      recommendation:
        "Use unique id values so labels, anchors, and ARIA references target the correct element.",
      selector: getSelector(elements[1] ?? elements[0]),
    });
  }

  if (!doc.querySelector("main, [role='main']")) {
    pushIssue({
      severity: "warning",
      rule: "missing-main-landmark",
      message: "No <main> landmark (or role=\"main\") was found in the snippet.",
      recommendation:
        "Wrap the primary page content in a single <main> element to improve navigation for assistive technologies.",
    });
  }

  const h1s = Array.from(doc.querySelectorAll("h1"));
  if (h1s.length > 1) {
    pushIssue({
      severity: "warning",
      rule: "multiple-h1",
      message: `The snippet contains ${h1s.length} <h1> elements.`,
      recommendation:
        "Prefer a single primary <h1> and use nested heading levels for subsections.",
      selector: getSelector(h1s[1] ?? h1s[0]),
    });
  }

  let previousHeadingLevel: number | null = null;
  for (const heading of Array.from(
    doc.querySelectorAll("h1, h2, h3, h4, h5, h6"),
  )) {
    const level = Number.parseInt(heading.tagName.substring(1), 10);
    if (
      previousHeadingLevel !== null &&
      Number.isFinite(level) &&
      level > previousHeadingLevel + 1
    ) {
      pushIssue({
        severity: "warning",
        rule: "heading-order-skip",
        message: `Heading order skips from h${previousHeadingLevel} to h${level}.`,
        recommendation:
          "Use headings sequentially (for example h2 -> h3) to preserve a clear document outline.",
        selector: getSelector(heading),
      });
    }

    previousHeadingLevel = level;
  }

  for (const image of Array.from(doc.querySelectorAll("img"))) {
    if (!image.hasAttribute("alt")) {
      pushIssue({
        severity: "error",
        rule: "img-missing-alt",
        message: "<img> is missing an alt attribute.",
        recommendation:
          "Add a meaningful alt attribute, or alt=\"\" for decorative images.",
        selector: getSelector(image),
      });
    }
  }

  for (const control of Array.from(doc.querySelectorAll("input, select, textarea"))) {
    if (isButtonLikeInput(control)) {
      continue;
    }

    if (!hasAssociatedLabel(control, doc)) {
      pushIssue({
        severity: "error",
        rule: "control-missing-label",
        message: `<${control.tagName.toLowerCase()}> does not have an associated label.`,
        recommendation:
          "Add a <label>, aria-label, or aria-labelledby so the control has an accessible name.",
        selector: getSelector(control),
      });
    }
  }

  for (const button of Array.from(doc.querySelectorAll("button"))) {
    if (!hasAccessibleName(button, doc)) {
      pushIssue({
        severity: "error",
        rule: "button-no-accessible-name",
        message: "<button> does not expose an accessible name.",
        recommendation:
          "Add visible text, aria-label, or aria-labelledby so assistive technologies can announce the button.",
        selector: getSelector(button),
      });
    }
  }

  for (const anchor of Array.from(doc.querySelectorAll("a"))) {
    const href = normalizeTextContent(anchor.getAttribute("href"));
    if (!href) {
      pushIssue({
        severity: "warning",
        rule: "anchor-missing-href",
        message: "<a> is missing an href attribute.",
        recommendation:
          "Add a valid href for navigation, or use a <button> element for actions.",
        selector: getSelector(anchor),
      });
    }
  }

  for (const element of Array.from(doc.querySelectorAll("[tabindex]"))) {
    const value = Number.parseInt(element.getAttribute("tabindex") ?? "", 10);
    if (!Number.isNaN(value) && value > 0) {
      pushIssue({
        severity: "warning",
        rule: "tabindex-positive",
        message: `Positive tabindex (${value}) can create a confusing focus order.`,
        recommendation:
          "Use DOM order and tabindex=\"0\" when necessary; avoid values greater than 0.",
        selector: getSelector(element),
      });
    }
  }

  for (const container of Array.from(doc.querySelectorAll("[aria-hidden='true']"))) {
    if (isFocusable(container)) {
      pushIssue({
        severity: "error",
        rule: "aria-hidden-focusable",
        message: "A focusable element is marked aria-hidden=\"true\".",
        recommendation:
          "Remove focusability or remove aria-hidden so hidden elements are not reachable by keyboard users.",
        selector: getSelector(container),
      });
      continue;
    }

    const hiddenFocusableDescendant = Array.from(container.querySelectorAll("*")).find(
      (descendant) => isFocusable(descendant),
    );

    if (hiddenFocusableDescendant) {
      pushIssue({
        severity: "error",
        rule: "aria-hidden-focusable",
        message:
          "An aria-hidden container includes a focusable descendant that can still receive focus.",
        recommendation:
          "Remove focusable descendants from aria-hidden regions, or disable/hide them properly.",
        selector: getSelector(hiddenFocusableDescendant),
      });
    }
  }

  for (const element of Array.from(doc.querySelectorAll("[role]"))) {
    const rawRoleValue = normalizeTextContent(element.getAttribute("role"));
    if (!rawRoleValue) {
      continue;
    }

    const invalidRoles = rawRoleValue
      .split(/\s+/)
      .filter((roleToken) => !VALID_ARIA_ROLES.has(roleToken.toLowerCase()));

    if (invalidRoles.length > 0) {
      pushIssue({
        severity: "warning",
        rule: "invalid-role-value",
        message: `Unknown ARIA role value(s): ${invalidRoles.join(", ")}.`,
        recommendation:
          "Use valid ARIA role names and remove typos or unsupported values.",
        selector: getSelector(element),
      });
    }
  }

  return sortIssues(issues);
}

export function formatAuditReport(issues: AuditIssue[]): string {
  const counts = buildCounts(issues);
  const header = `ARIA & Semantic Report
Errors: ${counts.error}
Warnings: ${counts.warning}
Info: ${counts.info}`;

  if (issues.length === 0) {
    return `${header}

No issues detected in the current HTML snippet.`;
  }

  const lines = issues.flatMap((issue) => [
    `[${issue.severity}] ${issue.rule} - ${issue.message}${
      issue.selector ? ` (selector: ${issue.selector})` : ""
    }`,
    `Fix: ${issue.recommendation}`,
    "",
  ]);

  return `${header}

${lines.join("\n").trimEnd()}`;
}

export default function AriaSemanticChecker() {
  const [htmlInput, setHtmlInput] = useState("");
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const counts = useMemo(() => buildCounts(issues), [issues]);

  const handleAnalyze = () => {
    if (!htmlInput.trim()) {
      setIssues([]);
      setStatus("idle");
      setErrorMessage("");
      return;
    }

    try {
      const result = analyzeAriaAndSemantics(htmlInput);
      setIssues(result);
      setStatus("analyzed");
      setErrorMessage("");
    } catch (error) {
      setIssues([]);
      setStatus("parse-error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected parsing error occurred.",
      );
    }
  };

  const handleLoadExample = () => {
    setHtmlInput(EXAMPLE_HTML);
    setIssues([]);
    setStatus("ready");
    setErrorMessage("");
  };

  const handleInputChange = (value: string) => {
    setHtmlInput(value);
    setIssues([]);
    setErrorMessage("");
    setStatus(value.trim() ? "ready" : "idle");
  };

  const statusMessage = status === "idle"
    ? "Paste HTML to start analysis."
    : status === "ready"
      ? "HTML is ready. Click Analyze to run checks."
      : status === "parse-error"
        ? `Analysis failed: ${errorMessage}`
        : issues.length === 0
          ? "Analysis complete. No issues detected."
          : `Analysis complete. ${issues.length} issue${issues.length > 1 ? "s" : ""} found.`;

  const toolOutput = status === "analyzed"
    ? formatAuditReport(issues)
    : status === "parse-error"
      ? `ARIA & Semantic Report
Analysis failed: ${errorMessage}`
      : "Paste HTML and click Analyze to generate an ARIA & semantic audit report.";

  return (
    <div className={styles.toolMain} data-testid="aria-semantic-checker-tool">
      <h1 className={styles.toolMainTitle}>ARIA &amp; Semantic Checker</h1>

      <section className={styles.panel} aria-labelledby="aria-html-input-title">
        <div className={styles.sectionHeader}>
          <h2 id="aria-html-input-title" className={styles.sectionTitle}>
            HTML Input
          </h2>
          <span className={styles.limitText}>
            {htmlInput.length.toLocaleString("en-US")} / {MAX_HTML_INPUT_LENGTH.toLocaleString("en-US")}
          </span>
        </div>

        <label htmlFor="aria-html-input" className={styles.fieldLabel}>
          Paste HTML snippet
        </label>
        <textarea
          id="aria-html-input"
          className={styles.textarea}
          value={htmlInput}
          onChange={(event) => handleInputChange(event.target.value)}
          maxLength={MAX_HTML_INPUT_LENGTH}
          placeholder="Paste your HTML snippet here..."
          spellCheck={false}
        />

        <div className={styles.buttonRow}>
          <button type="button" className={styles.primaryButton} onClick={handleAnalyze}>
            Analyze
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={handleLoadExample}
          >
            Load example
          </button>
        </div>
      </section>

      <section className={styles.summaryPanel} aria-labelledby="aria-summary-title">
        <div className={styles.sectionHeader}>
          <h2 id="aria-summary-title" className={styles.sectionTitle}>
            Analysis Summary
          </h2>
        </div>
        <p className={styles.statusMessage} role="status" aria-live="polite">
          {statusMessage}
        </p>
        <ul className={styles.summaryList} aria-label="Issue counts by severity">
          <li className={`${styles.summaryItem} ${styles.errorItem}`}>
            <span className={styles.summaryLabel}>Errors</span>
            <strong>{counts.error}</strong>
          </li>
          <li className={`${styles.summaryItem} ${styles.warningItem}`}>
            <span className={styles.summaryLabel}>Warnings</span>
            <strong>{counts.warning}</strong>
          </li>
          <li className={`${styles.summaryItem} ${styles.infoItem}`}>
            <span className={styles.summaryLabel}>Info</span>
            <strong>{counts.info}</strong>
          </li>
        </ul>
      </section>

      <section className={styles.issuesPanel} aria-labelledby="aria-issues-title">
        <div className={styles.sectionHeader}>
          <h2 id="aria-issues-title" className={styles.sectionTitle}>
            Issues
          </h2>
        </div>

        {status !== "analyzed" ? (
          <p className={styles.emptyState}>
            Run an analysis to list detected ARIA and semantic issues.
          </p>
        ) : issues.length === 0 ? (
          <p className={styles.emptyState}>No issues found in this snippet.</p>
        ) : (
          <ul className={styles.issueList}>
            {issues.map((issue) => (
              <li key={issue.id} className={styles.issueCard}>
                <div className={styles.issueHeader}>
                  <span
                    className={`${styles.severityBadge} ${
                      issue.severity === "error"
                        ? styles.severityError
                        : issue.severity === "warning"
                          ? styles.severityWarning
                          : styles.severityInfo
                    }`}
                  >
                    {issue.severity}
                  </span>
                  <span className={styles.issueRule}>{issue.rule}</span>
                </div>
                <p className={styles.issueMessage}>{issue.message}</p>
                {issue.selector ? (
                  <p className={styles.issueMeta}>
                    Selector: <code>{issue.selector}</code>
                  </p>
                ) : null}
                <p className={styles.issueRecommendation}>
                  Fix: {issue.recommendation}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ToolOutput className={styles.output} output={toolOutput} />

      <div className={styles.description}>
        <h2 className={styles.descriptionTitle}>
          What Does This Tool Check?
        </h2>
        <h3 className={styles.descriptionMedTitle}>Purpose</h3>
        <p className={styles.descriptionText}>
          The <strong className={styles.highlight}>ARIA &amp; Semantic Checker</strong>{" "}
          helps you spot common accessibility problems in an HTML snippet before
          they reach production. It focuses on frequent issues that affect screen
          reader navigation, keyboard access, and document structure.
        </p>

        <h3 className={styles.descriptionMedTitle}>How it works</h3>
        <p className={styles.descriptionText}>
          When you click <strong className={styles.highlight}>Analyze</strong>, the
          tool parses your HTML locally in the browser using{" "}
          <code className={styles.descriptionCode}>DOMParser</code>. It then runs
          a set of rules (duplicate IDs, missing labels, heading order, invalid
          roles, etc.) and returns a list of issues grouped by severity.
        </p>

        <h3 className={styles.descriptionMedTitle}>What the results mean</h3>
        <ul className={styles.list}>
          <li>
            <strong className={styles.highlight}>Errors</strong>: high-impact
            issues that usually break accessibility behavior (for example missing
            labels or focusable content inside an <code className={styles.descriptionCode}>aria-hidden</code>{" "}
            area).
          </li>
          <li>
            <strong className={styles.highlight}>Warnings</strong>: structural or
            quality issues that can confuse users or reduce accessibility (for
            example heading skips or positive <code className={styles.descriptionCode}>tabindex</code>).
          </li>
          <li>
            <strong className={styles.highlight}>Info</strong>: reserved for
            lower-priority guidance in future iterations.
          </li>
        </ul>

        <h3 className={styles.descriptionMedTitle}>Best use cases</h3>
        <ul className={styles.list}>
          <li>Reviewing a component template before integration.</li>
          <li>Quick checks during refactoring or migration.</li>
          <li>Teaching semantic HTML and ARIA basics to junior developers.</li>
          <li>Generating a copyable report for code review discussions.</li>
        </ul>

        <p className={styles.descriptionNote}>
          This is an MVP checker, not a full WCAG audit engine. It catches common
          markup-level issues, but it does not replace manual testing with a
          keyboard, screen reader, or browser accessibility tools.
        </p>
      </div>
    </div>
  );
}
