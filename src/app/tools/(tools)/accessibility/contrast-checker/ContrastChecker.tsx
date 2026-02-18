"use client";

import ToolOutput from "@/components/custom/ToolOutput";
import { getContrastRatio } from "@/utils/getContrastRatio";
import Link from "next/link";
import { useState } from "react";
import styles from "./ContrastChecker.module.scss";

const COLOR_INPUT_ERROR =
  "Use HEX (#RGB or #RRGGBB) or rgb(r, g, b) with values from 0 to 255.";

export function parseColorInput(rawValue: string): {
  isValid: boolean;
  hex: string;
  message: string;
} {
  const value = rawValue.trim();
  if (!value) {
    return { isValid: false, hex: "", message: COLOR_INPUT_ERROR };
  }

  const hexMatch = value.match(/^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/);
  if (hexMatch) {
    const hex = hexMatch[1].length === 3
      ? hexMatch[1]
          .split("")
          .map((char) => char + char)
          .join("")
      : hexMatch[1];
    return { isValid: true, hex: `#${hex.toUpperCase()}`, message: "" };
  }

  const rgbMatch = value.match(
    /^rgb\(\s*(\d{1,3})(?:\s*,\s*|\s+)(\d{1,3})(?:\s*,\s*|\s+)(\d{1,3})\s*\)$/i,
  );
  if (!rgbMatch) {
    return { isValid: false, hex: "", message: COLOR_INPUT_ERROR };
  }

  const rgbValues = rgbMatch.slice(1).map(Number);
  const hasInvalidChannel = rgbValues.some(
    (channel) => Number.isNaN(channel) || channel < 0 || channel > 255,
  );
  if (hasInvalidChannel) {
    return { isValid: false, hex: "", message: COLOR_INPUT_ERROR };
  }

  const hexValue = rgbValues
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  return { isValid: true, hex: `#${hexValue}`, message: "" };
}

export default function ContrastChecker() {
  const [foregroundInput, setForegroundInput] = useState("#FFFFFF");
  const [backgroundInput, setBackgroundInput] = useState("#000000");

  const foreground = parseColorInput(foregroundInput);
  const background = parseColorInput(backgroundInput);
  const hasValidColors = foreground.isValid && background.isValid;
  const ratio = hasValidColors
    ? getContrastRatio(foreground.hex, background.hex)
    : null;

  const sampleTextStyle = {
    color: foreground.isValid ? foreground.hex : "#FFFFFF",
    backgroundColor: background.isValid ? background.hex : "#000000",
  };

  const wcagChecks = ratio === null
    ? []
    : [
        {
          title: "WCAG AA",
          rows: [
            { label: "Normal text (4.5:1)", pass: ratio >= 4.5 },
            { label: "Large text (3:1)", pass: ratio >= 3 },
          ],
        },
        {
          title: "WCAG AAA",
          rows: [
            { label: "Normal text (7:1)", pass: ratio >= 7 },
            { label: "Large text (4.5:1)", pass: ratio >= 4.5 },
          ],
        },
      ];

  const toolOutput = hasValidColors && ratio !== null
    ? `Foreground: ${foreground.hex}
Background: ${background.hex}
Contrast ratio: ${ratio.toFixed(2)}:1
WCAG AA (Normal text): ${ratio >= 4.5 ? "Pass" : "Fail"}
WCAG AA (Large text): ${ratio >= 3 ? "Pass" : "Fail"}
WCAG AAA (Normal text): ${ratio >= 7 ? "Pass" : "Fail"}
WCAG AAA (Large text): ${ratio >= 4.5 ? "Pass" : "Fail"}`
    : "Provide valid foreground and background colors to generate WCAG results.";

  return (
    <div className="tool__main" data-testid="contrast-checker-tool">
      <h1 className="tool__main-title">Contrast Checker Tool</h1>
      <div className={styles.pickerGrid}>
        <fieldset className={styles.pickerCard}>
          <legend className={styles.pickerTitle}>Foreground color</legend>
          <label className={styles.controlRow} htmlFor="input-foreground-color">
            <span className={styles.controlLabel}>Select color</span>
            <input
              type="color"
              value={foreground.isValid ? foreground.hex : "#FFFFFF"}
              id="input-foreground-color"
              onChange={(event) => setForegroundInput(event.target.value)}
            />
          </label>
          <label className={styles.controlRow} htmlFor="input-foreground-value">
            <span className={styles.controlLabel}>HEX or RGB value</span>
            <input
              type="text"
              value={foregroundInput}
              onChange={(event) => setForegroundInput(event.target.value)}
              id="input-foreground-value"
              className={
                foreground.isValid
                  ? styles.colorInput
                  : `${styles.colorInput} ${styles.colorInputInvalid}`
              }
              aria-invalid={!foreground.isValid}
              aria-describedby={
                foreground.isValid
                  ? "foreground-helper"
                  : "foreground-helper foreground-error"
              }
            />
          </label>
          <p id="foreground-helper" className={styles.helperText}>
            Accepted values: `#1A2B3C`, `#ABC`, `rgb(26, 43, 60)`.
          </p>
          {!foreground.isValid ? (
            <p id="foreground-error" className={styles.errorText} role="alert">
              {foreground.message}
            </p>
          ) : null}
        </fieldset>

        <fieldset className={styles.pickerCard}>
          <legend className={styles.pickerTitle}>Background color</legend>
          <label className={styles.controlRow} htmlFor="input-background-color">
            <span className={styles.controlLabel}>Select color</span>
            <input
              type="color"
              value={background.isValid ? background.hex : "#000000"}
              id="input-background-color"
              onChange={(event) => setBackgroundInput(event.target.value)}
            />
          </label>
          <label className={styles.controlRow} htmlFor="input-background-value">
            <span className={styles.controlLabel}>HEX or RGB value</span>
            <input
              type="text"
              value={backgroundInput}
              onChange={(event) => setBackgroundInput(event.target.value)}
              id="input-background-value"
              className={
                background.isValid
                  ? styles.colorInput
                  : `${styles.colorInput} ${styles.colorInputInvalid}`
              }
              aria-invalid={!background.isValid}
              aria-describedby={
                background.isValid
                  ? "background-helper"
                  : "background-helper background-error"
              }
            />
          </label>
          <p id="background-helper" className={styles.helperText}>
            Accepted values: `#1A2B3C`, `#ABC`, `rgb(26, 43, 60)`.
          </p>
          {!background.isValid ? (
            <p id="background-error" className={styles.errorText} role="alert">
              {background.message}
            </p>
          ) : null}
        </fieldset>
      </div>

      <div className={styles.previewCard}>
        <p
          className={styles.previewText}
          style={sampleTextStyle}
          title="Sample text color testing"
          aria-label="Sample text color testing"
        >
          SAMPLE TEXT COLOR TESTING
        </p>
      </div>
      <p className={styles.ratio} role="status" aria-live="polite">
        Contrast ratio:
        <span className={styles.ratioValue}>
          {ratio === null ? " -- " : ` ${ratio.toFixed(2)}:1`}
        </span>
      </p>
      <div className={styles.resultsGrid}>
        {ratio === null ? (
          <p className={styles.statusMessage} role="status" aria-live="polite">
            Enter valid foreground and background colors to view WCAG pass/fail
            indicators.
          </p>
        ) : null}
        {wcagChecks.map((wcagLevel) => {
          const levelPass = wcagLevel.rows.every((row) => row.pass);
          return (
            <section
              key={wcagLevel.title}
              className={`${styles.wcagCard} ${levelPass ? styles.wcagPass : styles.wcagFail}`}
              aria-label={`${wcagLevel.title} results`}
            >
              <h3 className={styles.wcagTitle}>{wcagLevel.title}</h3>
              {wcagLevel.rows.map((row) => (
                <p key={row.label} className={styles.wcagRow}>
                  <span>{row.label}</span>
                  <span
                    className={`${styles.statusBadge} ${row.pass ? styles.statusPass : styles.statusFail}`}
                  >
                    {row.pass ? "Pass" : "Fail"}
                  </span>
                </p>
              ))}
            </section>
          );
        })}
      </div>
      <ToolOutput className={styles.output} output={toolOutput} />
      <div className="tool__desc">
        <h2 className="tool__desc-title">What is Contrast Ratio?</h2>
        <h3 className="tool__desc-med-title">Definition:</h3>
        <p className="tool__desc-text">
          Contrast ratio is the result of a calculation between the foreground
          color (usually text) and the background color. It&apos;s essential for
          determining whether the contrast between two colors is sufficient for
          the text to be easily legible by all users, including those with
          visual impairments.
        </p>
        <h3 className="tool__desc-med-title">How does it work?</h3>
        <p className="tool__desc-text">
          To calculate this ratio, we first need the relative luminance of the
          two colors being compared. This involves transforming each{" "}
          <b className="highlight">RGB</b> color component into a luminance
          value.
        </p>
        <br />
        <p className="tool__desc-text">
          We use the following formulas to achieve this:
        </p>
        <ul className="ul-list">
          <li>
            If <b className="highlight">RsRGB</b> ≤{" "}
            <b className="highlight">0.03928</b> then{" "}
            <b className="highlight">R</b> = <b className="highlight">RsRGB</b>{" "}
            / <b className="highlight">12.92</b> else{" "}
            <b className="highlight">R</b> = ((
            <b className="highlight">RsRGB</b> +{" "}
            <b className="highlight">0.055</b>) /{" "}
            <b className="highlight">1.055</b>) ^{" "}
            <b className="highlight">2.4</b>
          </li>
          <li>
            If <b className="highlight">GsRGB</b> ≤{" "}
            <b className="highlight">0.03928</b> then{" "}
            <b className="highlight">G</b> = <b className="highlight">GsRGB</b>{" "}
            / <b className="highlight">12.92</b> else{" "}
            <b className="highlight">G</b> = ((
            <b className="highlight">GsRGB</b> +{" "}
            <b className="highlight">0.055</b>) /{" "}
            <b className="highlight">1.055</b>) ^{" "}
            <b className="highlight">2.4</b>
          </li>
          <li>
            If <b className="highlight">BsRGB</b> ≤{" "}
            <b className="highlight">0.03928</b> then{" "}
            <b className="highlight">B</b> = <b className="highlight">BsRGB</b>{" "}
            / <b className="highlight">12.92</b> else{" "}
            <b className="highlight">B</b> = ((
            <b className="highlight">BsRGB</b> +{" "}
            <b className="highlight">0.055</b>) /{" "}
            <b className="highlight">1.055</b>) ^{" "}
            <b className="highlight">2.4</b>
          </li>
        </ul>
        <p className="tool__desc-text">
          Once the relative luminance values of both colors are obtained, we
          sort them by brightness:
        </p>
        <ul className="ul-list">
          <li>
            <b className="highlight">L1</b> = the lighter color
          </li>
          <li>
            <b className="highlight">L2</b> = the darker color
          </li>
        </ul>
        <p className="tool__desc-text">
          We then perform the following calculation:
        </p>
        <ul className="ul-list">
          <li>
            (<b className="highlight">L1</b> + <b className="highlight">0.05</b>
            ) / (<b className="highlight">L2</b> +{" "}
            <b className="highlight">0.05</b>)
          </li>
        </ul>
        <p className="tool__desc-text">
          Which gives us a ratio between <b className="highlight">1:1</b>{" "}
          (lowest contrast) and <b className="highlight">21:1</b> (highest
          contrast).
        </p>

        <h3 className="tool__desc-med-title">What is it for?</h3>
        <p className="tool__desc-text">
          The contrast ratio is a key metric for web accessibility, ensuring
          that website text is readable by everyone, including users with visual
          limitations. Depending on the text size, weight, and contrast ratio,
          we can evaluate if a text element meets the standards for readability.
        </p>
        <p className="tool__desc-text">
          According to WCAG standards, the minimum acceptable values for
          accessible text are:
        </p>
        <h4 className="tool__desc-minor-title">WCAG AA :</h4>
        <ul className="ul-list">
          <li>
            Normal text: <b className="highlight">4.5:1</b>
          </li>
          <li>
            Large text: <b className="highlight">3:1</b>
          </li>
        </ul>
        <h4 className="tool__desc-minor-title">WCAG AAA :</h4>
        <ul className="ul-list">
          <li>
            Normal text: <b className="highlight">7:1</b>
          </li>
          <li>
            Large text: <b className="highlight">4.5:1</b>
          </li>
        </ul>
        <p className="tool__desc-nb">
          * Normal text = font size &lt; 18pt / 24px. <br />
          ** Large text = font size ≥ 18pt / 24px or 14pt / 18px if <b>bold</b>.
        </p>
        <p className="tool__desc-text">Sources:</p>
        <ul className="ul-list">
          <li>
            <Link
              href={"https://www.w3.org/WAI/GL/wiki/Relative_luminance"}
              aria-label="Learn more about relative luminance"
              rel="noopener noreferrer"
              target="_blank"
              className="tool__desc-link"
            >
              Relative luminance
            </Link>
          </li>
          <li>
            <Link
              href={"https://www.w3.org/WAI/GL/wiki/Contrast_ratio"}
              aria-label="Learn more about contrast ratio"
              rel="noopener noreferrer"
              target="_blank"
              className="tool__desc-link"
            >
              Contrast ratio
            </Link>
          </li>
          <li>
            <Link
              href={
                "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html"
              }
              aria-label="Learn more about WCAG contrast minimum"
              rel="noopener noreferrer"
              target="_blank"
              className="tool__desc-link"
            >
              WCAG contrast minimum (Level AA)
            </Link>
          </li>
          <li>
            <Link
              href={
                "https://www.w3.org/WAI/WCAG21/Understanding/contrast-enhanced.html"
              }
              aria-label="Learn more about WCAG contrast enhanced"
              rel="noopener noreferrer"
              target="_blank"
              className="tool__desc-link"
            >
              WCAG contrast enhanced (Level AAA)
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
