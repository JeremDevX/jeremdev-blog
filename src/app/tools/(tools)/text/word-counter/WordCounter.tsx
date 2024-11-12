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
    <div className="flex flex-col h-auto gap-8 w-full items-center px-2 relative">
      <h1 className="font-bold text-4xl mt-8 lg:mt-0">Word Counter Tool</h1>
      <div className="flex flex-col w-full justify-center items-center">
        <label htmlFor="word-counter" className="font-semibold">
          Write or paste your text:
        </label>
        <div className="w-11/12 lg:w-2/3 relative">
          <textarea
            placeholder="Write or paste your text here..."
            id="word-counter"
            className="w-full h-96 rounded-lg text-foreground bg-background border-secondary border-2 p-4 my-4 resize-none"
            maxLength={150000}
            onChange={(e) => {
              setTextValue(e.target.value);
              setNumberOfCharacters(e.target.value.length);
            }}
          />
          <span className="absolute bottom-7 right-2 text-base opacity-50">
            {formatedCharacters}/ 150 000
          </span>
        </div>
      </div>
      <div className="w-full rounded-lg p-4 border-2 border-secondary relative flex flex-col gap-4 mt-8 mx-2">
        <h2 className="text-2xl xs:text-3xl font-bold absolute -top-4 xs:left-8 bg-background px-2">
          Length Recommendations
        </h2>
        <h3 className="mt-4 text-2xl underline underline-offset-4">
          Why this tool?
        </h3>
        <p>
          This tool helps you track word and character counts to ensure your
          content meets recommended or required length guidelines, optimizing
          readability and visibility across platforms like personnal blogs,
          social media, or email.
        </p>
        <h3 className="mt-4 text-2xl underline underline-offset-4">
          Recommandations Table
        </h3>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-xl xs:text-xs">
                  Usage
                </th>
                <th className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-xl xs:text-xs">
                  Current Count / Limit
                </th>
                <th className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-xl xs:text-xs">
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  Blog Post Length
                </td>
                <td
                  className={`px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs ${
                    wordCount >= 1000 && wordCount <= 2500
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {wordCount} / 1,000 - 2,500 words
                </td>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  Recommended*
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  Meta Description
                </td>
                <td
                  className={`px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs ${
                    numberOfCharacters >= 150 && numberOfCharacters <= 160
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatedCharacters} / 150 - 160 characters
                </td>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  Limit**
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  Title Tag
                </td>
                <td
                  className={`px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs ${
                    numberOfCharacters >= 50 && numberOfCharacters <= 60
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatedCharacters} / 50 - 60 characters
                </td>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  Limit**
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  X Post (Twitter)
                </td>
                <td
                  className={`px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs ${
                    numberOfCharacters <= 280
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatedCharacters} / 280 characters
                </td>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  Limit
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  Instagram Description
                </td>
                <td
                  className={`px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs ${
                    numberOfCharacters <= 2200
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatedCharacters} / 2,200 characters
                </td>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  Limit
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  LinkedIn Post
                </td>
                <td
                  className={`px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs ${
                    numberOfCharacters <= 3000
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatedCharacters} / 3,000 characters
                </td>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  Limit
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  Facebook Post
                </td>
                <td
                  className={`px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs ${
                    numberOfCharacters <= 63206
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatedCharacters} / 63,206 characters
                </td>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  Limit
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  Email Subject Line
                </td>
                <td
                  className={`px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs ${
                    numberOfCharacters >= 40 && numberOfCharacters <= 60
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatedCharacters} / 40 - 60 characters
                </td>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  Limit**
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  Email Body (Promotional)
                </td>
                <td
                  className={`px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs ${
                    wordCount >= 50 && wordCount <= 125
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {wordCount} / 50 - 125 words
                </td>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  Recommended*
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  Email Body (Newsletter)
                </td>
                <td
                  className={`px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs ${
                    wordCount >= 250 && wordCount <= 500
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {wordCount} / 250 - 500 words
                </td>
                <td className="px-2 py-1 md:px-4 md:py-2 border-b border-gray-300 text-center text-base md:text-lg xs:text-xs">
                  Recommended*
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mt-4 text-lg">
            * The recommendations provided are not absolute rules but general
            guidelines for achieving optimal content length across various
            types.
          </p>
          <p className="text-lg">
            ** The limits for Meta descriptions, Title tags, and Email subject
            lines are set to prevent text from being truncated.
          </p>
        </div>
      </div>
    </div>
  );
}
