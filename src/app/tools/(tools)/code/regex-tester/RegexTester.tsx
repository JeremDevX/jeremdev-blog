"use client";

import ToolOutput from "@/components/custom/ToolOutput";
import { Fragment, useMemo, useState } from "react";
import styles from "./RegexTester.module.scss";

export type RegexMatchRow = {
  index: number;
  match: string;
  start: number;
  end: number;
  groups: string[];
};

type RegexTesterStatus =
  | "idle"
  | "ready"
  | "invalid-regex"
  | "valid-no-match"
  | "valid-with-match";

type RegexAnalysis = {
  state: Exclude<RegexTesterStatus, "ready">;
  compiledPattern: string;
  compileError: string;
  matches: RegexMatchRow[];
  totalMatches: number;
  isTruncated: boolean;
  replacementPreview: string;
};

type HighlightSegment = {
  key: string;
  text: string;
  isMatch: boolean;
  isEmptyMatch: boolean;
};

const MAX_SOURCE_LENGTH = 150_000;
const MAX_RENDERED_MATCHES = 200;
const FLAG_ORDER = ["g", "i", "m", "s", "u", "y"] as const;

type RegexFlag = (typeof FLAG_ORDER)[number];

const EXAMPLE_PATTERN = "(foo)-(bar)";
const EXAMPLE_FLAGS: RegexFlag[] = ["g"];
const EXAMPLE_SOURCE = `foo-bar
FOO-BAR
foo-bar baz
foo-bar`;
const EXAMPLE_REPLACEMENT = "$2:$1";

function formatFlags(flags: Iterable<string>): string {
  const flagSet = new Set(flags);
  return FLAG_ORDER.filter((flag) => flagSet.has(flag)).join("");
}

export function compileRegexPattern(pattern: string, flags: string): {
  regex: RegExp | null;
  error: string;
} {
  try {
    return { regex: new RegExp(pattern, flags), error: "" };
  } catch (error) {
    return {
      regex: null,
      error: error instanceof Error ? error.message : "Invalid regex",
    };
  }
}

function mapMatchToRow(match: RegExpMatchArray, rowIndex: number): RegexMatchRow {
  const start = match.index ?? 0;
  const fullMatch = match[0] ?? "";
  return {
    index: rowIndex,
    match: fullMatch,
    start,
    end: start + fullMatch.length,
    groups: match.slice(1).map((group) => group ?? ""),
  };
}

export function getRegexMatches(
  regex: RegExp,
  source: string,
  maxRows = MAX_RENDERED_MATCHES,
): {
  matches: RegexMatchRow[];
  totalMatches: number;
  isTruncated: boolean;
} {
  if (regex.global) {
    const rows: RegexMatchRow[] = [];
    let totalMatches = 0;

    for (const match of source.matchAll(regex)) {
      totalMatches += 1;
      if (rows.length < maxRows) {
        rows.push(mapMatchToRow(match, totalMatches));
      }
    }

    return {
      matches: rows,
      totalMatches,
      isTruncated: totalMatches > maxRows,
    };
  }

  const singleMatch = regex.exec(source);
  if (!singleMatch) {
    return { matches: [], totalMatches: 0, isTruncated: false };
  }

  return {
    matches: [mapMatchToRow(singleMatch, 1)],
    totalMatches: 1,
    isTruncated: false,
  };
}

export function runRegexAnalysis(
  pattern: string,
  flags: string,
  source: string,
  replacement: string,
): RegexAnalysis {
  if (!pattern || !source) {
    return {
      state: "idle",
      compiledPattern: pattern ? `/${pattern}/${flags}` : "",
      compileError: "",
      matches: [],
      totalMatches: 0,
      isTruncated: false,
      replacementPreview: source,
    };
  }

  const compiledPattern = `/${pattern}/${flags}`;
  const { regex, error } = compileRegexPattern(pattern, flags);

  if (!regex) {
    return {
      state: "invalid-regex",
      compiledPattern,
      compileError: error,
      matches: [],
      totalMatches: 0,
      isTruncated: false,
      replacementPreview: source,
    };
  }

  const { matches, totalMatches, isTruncated } = getRegexMatches(regex, source);
  const replacementPreview = source.replace(regex, replacement);

  return {
    state: totalMatches > 0 ? "valid-with-match" : "valid-no-match",
    compiledPattern,
    compileError: "",
    matches,
    totalMatches,
    isTruncated,
    replacementPreview,
  };
}

export function buildHighlightSegments(
  source: string,
  matches: RegexMatchRow[],
): HighlightSegment[] {
  if (!source) {
    return [];
  }

  if (matches.length === 0) {
    return [{ key: "text-0", text: source, isMatch: false, isEmptyMatch: false }];
  }

  const segments: HighlightSegment[] = [];
  let cursor = 0;
  let markerIndex = 0;

  for (const match of matches) {
    const start = Math.max(0, Math.min(match.start, source.length));
    const end = Math.max(start, Math.min(match.end, source.length));

    if (start > cursor) {
      segments.push({
        key: `text-${markerIndex}`,
        text: source.slice(cursor, start),
        isMatch: false,
        isEmptyMatch: false,
      });
      markerIndex += 1;
    }

    const text = source.slice(start, end);
    segments.push({
      key: `match-${match.index}-${start}-${end}-${markerIndex}`,
      text,
      isMatch: true,
      isEmptyMatch: text.length === 0,
    });
    markerIndex += 1;
    cursor = Math.max(cursor, end);
  }

  if (cursor < source.length) {
    segments.push({
      key: `text-${markerIndex}`,
      text: source.slice(cursor),
      isMatch: false,
      isEmptyMatch: false,
    });
  }

  return segments;
}

export function formatRegexReport(
  pattern: string,
  flags: string,
  source: string,
  replacement: string,
  analysis: RegexAnalysis | null,
): string {
  if (!pattern || !source) {
    return "Enter a regex pattern and source text, then click Run to generate a report.";
  }

  if (!analysis) {
    return "Regex configuration is ready. Click Run to generate matches and replacement preview.";
  }

  if (analysis.state === "invalid-regex") {
    return `Regex Tester Report
Pattern: /${pattern}/${flags}
Status: Invalid regex
Error: ${analysis.compileError}`;
  }

  const matchLines = analysis.matches.flatMap((match) => [
    `#${match.index} "${match.match}" [${match.start}-${match.end}]`,
    `Groups: ${match.groups.length > 0 ? match.groups.join(" | ") : "(none)"}`,
  ]);

  return `Regex Tester Report
Pattern: /${pattern}/${flags}
Status: ${analysis.totalMatches > 0 ? "Valid - matches found" : "Valid - no match"}
Matches: ${analysis.totalMatches}${analysis.isTruncated ? ` (showing first ${analysis.matches.length})` : ""}
Replacement input: ${replacement || "(empty)"}

${matchLines.length > 0 ? `${matchLines.join("\n")}\n\n` : ""}Replacement preview:
${analysis.replacementPreview}`;
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [enabledFlags, setEnabledFlags] = useState<RegexFlag[]>(["g"]);
  const [sourceText, setSourceText] = useState("");
  const [replacementText, setReplacementText] = useState("");
  const [analysis, setAnalysis] = useState<RegexAnalysis | null>(null);

  const flags = formatFlags(enabledFlags);
  const uiState: RegexTesterStatus = analysis
    ? analysis.state
    : pattern && sourceText
      ? "ready"
      : "idle";

  const highlightSegments = useMemo(
    () =>
      buildHighlightSegments(
        sourceText,
        analysis?.state === "valid-with-match" ? analysis.matches : [],
      ),
    [sourceText, analysis],
  );

  const toolOutput = useMemo(
    () => formatRegexReport(pattern, flags, sourceText, replacementText, analysis),
    [pattern, flags, sourceText, replacementText, analysis],
  );

  const toggleFlag = (flag: RegexFlag) => {
    setEnabledFlags((currentFlags) => {
      const next = currentFlags.includes(flag)
        ? currentFlags.filter((value) => value !== flag)
        : [...currentFlags, flag];
      return FLAG_ORDER.filter((orderedFlag) => next.includes(orderedFlag));
    });
    setAnalysis(null);
  };

  const handleRun = () => {
    setAnalysis(runRegexAnalysis(pattern, flags, sourceText, replacementText));
  };

  const handleLoadExample = () => {
    setPattern(EXAMPLE_PATTERN);
    setEnabledFlags(EXAMPLE_FLAGS);
    setSourceText(EXAMPLE_SOURCE);
    setReplacementText(EXAMPLE_REPLACEMENT);
    setAnalysis(null);
  };

  const statusMessage = uiState === "idle"
    ? "Enter a pattern and source text to begin."
    : uiState === "ready"
      ? "Configuration ready. Click Run to test the regex."
      : uiState === "invalid-regex"
        ? `Regex error: ${analysis?.compileError ?? "Invalid regex"}`
        : uiState === "valid-no-match"
          ? "Regex compiled successfully, but no matches were found."
          : `Regex compiled successfully. ${analysis?.totalMatches ?? 0} match${
              (analysis?.totalMatches ?? 0) > 1 ? "es" : ""
            } found.`;

  return (
    <div className={styles.toolMain} data-testid="regex-tester-tool">
      <h1 className={styles.toolMainTitle}>Regex Tester</h1>

      <div className={styles.layout}>
        <section className={styles.controlsCard} aria-labelledby="regex-config-title">
          <div className={styles.sectionHeader}>
            <h2 id="regex-config-title" className={styles.sectionTitle}>
              Regex Configuration
            </h2>
          </div>

          <label htmlFor="regex-pattern" className={styles.fieldLabel}>
            Pattern
          </label>
          <input
            id="regex-pattern"
            type="text"
            className={styles.input}
            value={pattern}
            onChange={(event) => {
              setPattern(event.target.value);
              setAnalysis(null);
            }}
            placeholder="e.g. (foo)-(bar)"
            autoComplete="off"
            spellCheck={false}
          />

          <fieldset className={styles.flagsFieldset}>
            <legend className={styles.flagsLegend}>Flags</legend>
            <div className={styles.flagsGrid}>
              {FLAG_ORDER.map((flag) => (
                <label key={flag} className={styles.flagLabel}>
                  <input
                    type="checkbox"
                    checked={enabledFlags.includes(flag)}
                    onChange={() => toggleFlag(flag)}
                  />
                  <span>{flag}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label htmlFor="regex-source" className={styles.fieldLabel}>
            Source text
          </label>
          <div className={styles.textareaWrap}>
            <textarea
              id="regex-source"
              className={styles.textarea}
              value={sourceText}
              onChange={(event) => {
                setSourceText(event.target.value);
                setAnalysis(null);
              }}
              maxLength={MAX_SOURCE_LENGTH}
              placeholder="Paste text to test against your regex..."
              spellCheck={false}
            />
            <span className={styles.limitText}>
              {sourceText.length.toLocaleString("en-US")} / {MAX_SOURCE_LENGTH.toLocaleString("en-US")}
            </span>
          </div>

          <label htmlFor="regex-replacement" className={styles.fieldLabel}>
            Replacement text (optional)
          </label>
          <textarea
            id="regex-replacement"
            className={`${styles.textarea} ${styles.replacementTextarea}`}
            value={replacementText}
            onChange={(event) => {
              setReplacementText(event.target.value);
              setAnalysis(null);
            }}
            placeholder="Use $1, $2... for captured groups"
            spellCheck={false}
          />

          <div className={styles.buttonRow}>
            <button type="button" className={styles.primaryButton} onClick={handleRun}>
              Run
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

        <section className={styles.resultsCard} aria-labelledby="regex-results-title">
          <div className={styles.sectionHeader}>
            <h2 id="regex-results-title" className={styles.sectionTitle}>
              Results
            </h2>
          </div>

          <p className={styles.statusMessage} role="status" aria-live="polite">
            {statusMessage}
          </p>

          <div className={styles.statusGrid}>
            <div className={styles.statusBlock}>
              <span className={styles.statusLabel}>Compiled</span>
              <code className={styles.statusCode}>
                {analysis?.compiledPattern || (pattern ? `/${pattern}/${flags}` : "—")}
              </code>
            </div>
            <div className={styles.statusBlock}>
              <span className={styles.statusLabel}>Matches</span>
              <strong>{analysis?.totalMatches ?? 0}</strong>
            </div>
          </div>

          {analysis?.state === "invalid-regex" ? (
            <p className={styles.errorMessage} role="alert">
              {analysis.compileError}
            </p>
          ) : null}

          <section className={styles.panelSection} aria-labelledby="regex-highlight-title">
            <h3 id="regex-highlight-title" className={styles.panelTitle}>
              Highlight preview
            </h3>
            <div className={styles.previewBox}>
              {sourceText ? (
                <p className={styles.highlightText}>
                  {highlightSegments.map((segment) =>
                    segment.isMatch ? (
                      <mark key={segment.key} className={styles.matchMark}>
                        {segment.isEmptyMatch ? (
                          <span className={styles.emptyMatchIndicator}>∅</span>
                        ) : (
                          segment.text
                        )}
                      </mark>
                    ) : (
                      <Fragment key={segment.key}>{segment.text}</Fragment>
                    ),
                  )}
                </p>
              ) : (
                <p className={styles.mutedText}>Source text preview will appear here.</p>
              )}
            </div>
          </section>

          <section className={styles.panelSection} aria-labelledby="regex-matches-title">
            <h3 id="regex-matches-title" className={styles.panelTitle}>
              Matches
            </h3>
            {analysis && analysis.isTruncated ? (
              <p className={styles.truncationNote}>
                Showing the first {analysis.matches.length} matches to keep the UI responsive.
              </p>
            ) : null}
            {analysis?.matches.length ? (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <caption className={styles.visuallyHidden}>
                    Regex match results
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Match</th>
                      <th scope="col">Start</th>
                      <th scope="col">End</th>
                      <th scope="col">Groups</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.matches.map((match) => (
                      <tr key={`${match.index}-${match.start}-${match.end}`}>
                        <td>{match.index}</td>
                        <td>
                          <code>{match.match || '""'}</code>
                        </td>
                        <td>{match.start}</td>
                        <td>{match.end}</td>
                        <td>
                          {match.groups.length > 0 ? (
                            <ul className={styles.groupList}>
                              {match.groups.map((group, groupIndex) => (
                                <li key={`${match.index}-g${groupIndex + 1}`}>
                                  <span className={styles.groupBadge}>
                                    ${groupIndex + 1}
                                  </span>
                                  <code>{group || '""'}</code>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className={styles.mutedText}>(none)</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={styles.mutedText}>No match rows to display.</p>
            )}
          </section>

          <section className={styles.panelSection} aria-labelledby="regex-replacement-preview-title">
            <h3 id="regex-replacement-preview-title" className={styles.panelTitle}>
              Replacement preview
            </h3>
            <pre className={styles.previewPre}>
              <code>
                {analysis?.state === "invalid-regex"
                  ? "Fix the regex pattern to preview replacements."
                  : analysis
                    ? analysis.replacementPreview
                    : "Run the regex to preview replacements."}
              </code>
            </pre>
          </section>
        </section>
      </div>

      <ToolOutput className={styles.output} output={toolOutput} />

      <div className={styles.description}>
        <h2 className={styles.descriptionTitle}>What Is This Tool For?</h2>
        <h3 className={styles.descriptionMedTitle}>Purpose</h3>
        <p className={styles.descriptionText}>
          The <strong className={styles.highlight}>Regex Tester</strong> helps you
          validate a JavaScript regular expression before using it in code. It is
          useful for checking matching behavior, reviewing capture groups, and
          previewing replacements on real text samples.
        </p>

        <h3 className={styles.descriptionMedTitle}>How it works</h3>
        <p className={styles.descriptionText}>
          Enter a pattern, choose flags, and paste a source text. When you click{" "}
          <strong className={styles.highlight}>Run</strong>, the tool compiles the
          regex with <code className={styles.descriptionCode}>new RegExp()</code>{" "}
          inside a safe <code className={styles.descriptionCode}>try/catch</code>.
          It then computes matches (including start/end positions and capture
          groups) and builds a replacement preview using{" "}
          <code className={styles.descriptionCode}>String.replace()</code>.
        </p>

        <h3 className={styles.descriptionMedTitle}>What you can inspect</h3>
        <ul className={styles.list}>
          <li>
            <strong className={styles.highlight}>Compilation status</strong>:
            quickly see whether the pattern is valid.
          </li>
          <li>
            <strong className={styles.highlight}>Matches table</strong>: review
            exact matched values, indexes, and captured groups.
          </li>
          <li>
            <strong className={styles.highlight}>Highlight preview</strong>: view
            matches directly in the source text without injecting raw HTML.
          </li>
          <li>
            <strong className={styles.highlight}>Replacement preview</strong>:
            test substitutions like <code className={styles.descriptionCode}>$1</code>,{" "}
            <code className={styles.descriptionCode}>$2</code>, etc.
          </li>
        </ul>

        <h3 className={styles.descriptionMedTitle}>Flags reminder</h3>
        <ul className={styles.list}>
          <li><code className={styles.descriptionCode}>g</code>: global search (all matches)</li>
          <li><code className={styles.descriptionCode}>i</code>: case-insensitive</li>
          <li><code className={styles.descriptionCode}>m</code>: multiline anchors</li>
          <li><code className={styles.descriptionCode}>s</code>: dot matches newlines</li>
          <li><code className={styles.descriptionCode}>u</code>: Unicode-aware mode</li>
          <li><code className={styles.descriptionCode}>y</code>: sticky matching</li>
        </ul>

        <p className={styles.descriptionNote}>
          JavaScript regex engines can still become slow with catastrophic
          backtracking patterns. This tool limits displayed results and source
          size for responsiveness, but very expensive patterns may still feel
          slow in the browser.
        </p>
      </div>
    </div>
  );
}
