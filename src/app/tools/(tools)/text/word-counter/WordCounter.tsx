"use client";
import { useEffect, useState } from "react";

export default function WordCounter() {
  const [textValue, setTextValue] = useState("");
  const [numberOfCharacters, setNumberOfCharacters] = useState(0);
  const [formatedCharacters, setFormatedCharacters] = useState("0");
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (textValue.length === 0) {
      setWordCount(0);
    }
    if (textValue.length > 0) {
      const words = textValue
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      setWordCount(words.length);
    }
  }, [textValue]);

  useEffect(() => {
    if (numberOfCharacters > 0) {
      setFormatedCharacters(
        numberOfCharacters.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      );
    } else {
      setFormatedCharacters("0");
    }
  }, [numberOfCharacters]);

  return (
    <div className="tool__main">
      <h1 className="tool__main-title">Word Counter Tool</h1>
      <div className="word-counter__tool">
        <label htmlFor="word-counter" className="semi-bold">
          Write or paste your text:
        </label>
        <div className="word-counter__container">
          <textarea
            placeholder="Write or paste your text here..."
            id="word-counter"
            className="word-counter__input"
            maxLength={150000}
            onChange={(e) => {
              setTextValue(e.target.value);
              setNumberOfCharacters(e.target.value.length);
            }}
          />
          <span className="word-counter__input-charac">
            {formatedCharacters}/ 150 000
          </span>
        </div>
      </div>
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
        <div className="word-counter__table-container">
          <table className="word-counter__table">
            <thead>
              <tr>
                <th className="word-counter__table-head">Usage</th>
                <th className="word-counter__table-head">
                  Current Count / Limit
                </th>
                <th className="word-counter__table-head">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="word-counter__table-use-case">
                  Blog Post Length
                </td>
                <td
                  className={`word-counter__table-count ${
                    wordCount >= 1000 && wordCount <= 2500
                      ? "word-counter__table-count--green"
                      : "word-counter__table-count--red"
                  }`}
                >
                  {wordCount} / 1,000 - 2,500 words
                </td>
                <td className="word-counter__table-type italic">
                  Recommended*
                </td>
              </tr>
              <tr>
                <td className="word-counter__table-use-case">
                  Meta Description
                </td>
                <td
                  className={`word-counter__table-count ${
                    numberOfCharacters >= 150 && numberOfCharacters <= 160
                      ? "word-counter__table-count--green"
                      : "word-counter__table-count--red"
                  }`}
                >
                  {formatedCharacters} / 150 - 160 characters
                </td>
                <td className="word-counter__table-type italic">Limit**</td>
              </tr>
              <tr>
                <td className="word-counter__table-use-case">Title Tag</td>
                <td
                  className={`word-counter__table-count ${
                    numberOfCharacters >= 50 && numberOfCharacters <= 60
                      ? "word-counter__table-count--green"
                      : "word-counter__table-count--red"
                  }`}
                >
                  {formatedCharacters} / 50 - 60 characters
                </td>
                <td className="word-counter__table-type italic">Limit**</td>
              </tr>
              <tr>
                <td className="word-counter__table-use-case">
                  X Post (Twitter)
                </td>
                <td
                  className={`word-counter__table-count ${
                    numberOfCharacters <= 280
                      ? "word-counter__table-count--green"
                      : "word-counter__table-count--red"
                  }`}
                >
                  {formatedCharacters} / 280 characters
                </td>
                <td className="word-counter__table-type italic">Limit</td>
              </tr>
              <tr>
                <td className="word-counter__table-use-case">
                  Instagram Description
                </td>
                <td
                  className={`word-counter__table-count ${
                    numberOfCharacters <= 2200
                      ? "word-counter__table-count--green"
                      : "word-counter__table-count--red"
                  }`}
                >
                  {formatedCharacters} / 2,200 characters
                </td>
                <td className="word-counter__table-type italic">Limit</td>
              </tr>
              <tr>
                <td className="word-counter__table-use-case">LinkedIn Post</td>
                <td
                  className={`word-counter__table-count ${
                    numberOfCharacters <= 3000
                      ? "word-counter__table-count--green"
                      : "word-counter__table-count--red"
                  }`}
                >
                  {formatedCharacters} / 3,000 characters
                </td>
                <td className="word-counter__table-type italic">Limit</td>
              </tr>
              <tr>
                <td className="word-counter__table-use-case">Facebook Post</td>
                <td
                  className={`word-counter__table-count ${
                    numberOfCharacters <= 63206
                      ? "word-counter__table-count--green"
                      : "word-counter__table-count--red"
                  }`}
                >
                  {formatedCharacters} / 63,206 characters
                </td>
                <td className="word-counter__table-type italic">Limit</td>
              </tr>
              <tr>
                <td className="word-counter__table-use-case">
                  Email Subject Line
                </td>
                <td
                  className={`word-counter__table-count ${
                    numberOfCharacters >= 40 && numberOfCharacters <= 60
                      ? "word-counter__table-count--green"
                      : "word-counter__table-count--red"
                  }`}
                >
                  {formatedCharacters} / 40 - 60 characters
                </td>
                <td className="word-counter__table-type italic">Limit**</td>
              </tr>
              <tr>
                <td className="word-counter__table-use-case">
                  Email Body (Promotional)
                </td>
                <td
                  className={`word-counter__table-count ${
                    wordCount >= 50 && wordCount <= 125
                      ? "word-counter__table-count--green"
                      : "word-counter__table-count--red"
                  }`}
                >
                  {wordCount} / 50 - 125 words
                </td>
                <td className="word-counter__table-type italic">
                  Recommended*
                </td>
              </tr>
              <tr>
                <td className="word-counter__table-use-case">
                  Email Body (Newsletter)
                </td>
                <td
                  className={`word-counter__table-count ${
                    wordCount >= 250 && wordCount <= 500
                      ? "word-counter__table-count--green"
                      : "word-counter__table-count--red"
                  }`}
                >
                  {wordCount} / 250 - 500 words
                </td>
                <td className="word-counter__table-type italic">
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
