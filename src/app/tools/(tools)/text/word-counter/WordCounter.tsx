"use client";
import ToolOutput from "@/components/custom/ToolOutput";
import { useMemo, useState } from "react";
import styles from "./WordCounter.module.scss";

export function countWords(text: string): number {
  const words = text
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  return words.length;
}

export function formatCharacterCount(value: number): string {
  if (value <= 0) {
    return "0";
  }
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function WordCounter() {
  const [textValue, setTextValue] = useState("");
  const numberOfCharacters = textValue.length;
  const wordCount = useMemo(() => countWords(textValue), [textValue]);
  const formattedCharacters = useMemo(
    () => formatCharacterCount(numberOfCharacters),
    [numberOfCharacters],
  );

  const outputSummary = `Words: ${wordCount}
Characters: ${formattedCharacters}`;

  return (
    <div className="tool__main" data-testid="word-counter-tool">
      <h1 className="tool__main-title">Word Counter Tool</h1>
      <div className={styles.tool}>
        <label htmlFor="word-counter" className="semi-bold">
          Write or paste your text:
        </label>
        <div className={styles.container}>
          <textarea
            placeholder="Write or paste your text here..."
            id="word-counter"
            className={styles.input}
            maxLength={150000}
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
          />
          <span className={styles.inputCharacters}>
            {formattedCharacters}/ 150 000
          </span>
        </div>
      </div>
      <ToolOutput
        className={styles.output}
        output={outputSummary}
        valueToCopy={`Words: ${wordCount}\nCharacters: ${numberOfCharacters}`}
      />
      <div className="tool__desc">
        <h2 className="tool__desc-title">Length Recommendations</h2>
        <h3 className="tool__desc-med-title">Why this tool?</h3>
        <p className="tool__desc-text">
          This tool helps you track word and character counts to ensure your
          content meets recommended or required length guidelines, optimizing
          readability and visibility across platforms like personnal blogs,
          social media, or email.
        </p>
        <h3 className="tool__desc-med-title">Recommandations Table</h3>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <caption>
              Suggested ranges and hard limits for common content formats.
            </caption>
            <thead>
              <tr>
                <th scope="col" className={styles.tableHead}>
                  Usage
                </th>
                <th scope="col" className={styles.tableHead}>
                  Current Count / Limit
                </th>
                <th scope="col" className={styles.tableHead}>
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.tableUseCase}>
                  Blog Post Length
                </td>
                <td
                  className={`${styles.tableCount} ${
                    wordCount >= 1000 && wordCount <= 2500
                      ? styles.tableCountGreen
                      : styles.tableCountRed
                  }`}
                >
                  {wordCount} / 1,000 - 2,500 words
                </td>
                <td className={`${styles.tableType} italic`}>
                  Recommended*
                </td>
              </tr>
              <tr>
                <td className={styles.tableUseCase}>
                  Meta Description
                </td>
                <td
                  className={`${styles.tableCount} ${
                    numberOfCharacters >= 1 && numberOfCharacters <= 160
                      ? styles.tableCountGreen
                      : styles.tableCountRed
                  }`}
                >
                  {formattedCharacters} / 150 - 160 characters
                </td>
                <td className={`${styles.tableType} italic`}>Limit**</td>
              </tr>
              <tr>
                <td className={styles.tableUseCase}>Title Tag</td>
                <td
                  className={`${styles.tableCount} ${
                    numberOfCharacters >= 1 && numberOfCharacters <= 60
                      ? styles.tableCountGreen
                      : styles.tableCountRed
                  }`}
                >
                  {formattedCharacters} / 50 - 60 characters
                </td>
                <td className={`${styles.tableType} italic`}>Limit**</td>
              </tr>
              <tr>
                <td className={styles.tableUseCase}>
                  X Post (Twitter)
                </td>
                <td
                  className={`${styles.tableCount} ${
                    numberOfCharacters <= 280
                      ? styles.tableCountGreen
                      : styles.tableCountRed
                  }`}
                >
                  {formattedCharacters} / 280 characters
                </td>
                <td className={`${styles.tableType} italic`}>Limit</td>
              </tr>
              <tr>
                <td className={styles.tableUseCase}>
                  Instagram Description
                </td>
                <td
                  className={`${styles.tableCount} ${
                    numberOfCharacters <= 2200
                      ? styles.tableCountGreen
                      : styles.tableCountRed
                  }`}
                >
                  {formattedCharacters} / 2,200 characters
                </td>
                <td className={`${styles.tableType} italic`}>Limit</td>
              </tr>
              <tr>
                <td className={styles.tableUseCase}>LinkedIn Post</td>
                <td
                  className={`${styles.tableCount} ${
                    numberOfCharacters <= 3000
                      ? styles.tableCountGreen
                      : styles.tableCountRed
                  }`}
                >
                  {formattedCharacters} / 3,000 characters
                </td>
                <td className={`${styles.tableType} italic`}>Limit</td>
              </tr>
              <tr>
                <td className={styles.tableUseCase}>Facebook Post</td>
                <td
                  className={`${styles.tableCount} ${
                    numberOfCharacters <= 63206
                      ? styles.tableCountGreen
                      : styles.tableCountRed
                  }`}
                >
                  {formattedCharacters} / 63,206 characters
                </td>
                <td className={`${styles.tableType} italic`}>Limit</td>
              </tr>
              <tr>
                <td className={styles.tableUseCase}>
                  Email Subject Line
                </td>
                <td
                  className={`${styles.tableCount} ${
                    numberOfCharacters >= 1 && numberOfCharacters <= 60
                      ? styles.tableCountGreen
                      : styles.tableCountRed
                  }`}
                >
                  {formattedCharacters} / 40 - 60 characters
                </td>
                <td className={`${styles.tableType} italic`}>Limit**</td>
              </tr>
              <tr>
                <td className={styles.tableUseCase}>
                  Email Body (Promotional)
                </td>
                <td
                  className={`${styles.tableCount} ${
                    wordCount >= 50 && wordCount <= 125
                      ? styles.tableCountGreen
                      : styles.tableCountRed
                  }`}
                >
                  {wordCount} / 50 - 125 words
                </td>
                <td className={`${styles.tableType} italic`}>
                  Recommended*
                </td>
              </tr>
              <tr>
                <td className={styles.tableUseCase}>
                  Email Body (Newsletter)
                </td>
                <td
                  className={`${styles.tableCount} ${
                    wordCount >= 250 && wordCount <= 500
                      ? styles.tableCountGreen
                      : styles.tableCountRed
                  }`}
                >
                  {wordCount} / 250 - 500 words
                </td>
                <td className={`${styles.tableType} italic`}>
                  Recommended*
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="tool__desc-nb">
          * The recommendations provided are not absolute rules but general
          guidelines for achieving optimal content length across various types.
          <br />
          ** The limits for Meta descriptions, Title tags, and Email subject
          lines are set to prevent text from being truncated.
        </p>
      </div>
    </div>
  );
}
