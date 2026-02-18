"use client";

import ToolOutput from "@/components/custom/ToolOutput";
import { useEffect, useState } from "react";
import styles from "./SlugGenerator.module.scss";

export function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s']/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function SlugGenerator() {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");

  useEffect(() => {
    setOutputValue(normalizeSlug(inputValue));
  }, [inputValue]);

  return (
    <div className={styles.toolMain} data-testid="slug-generator-tool">
      <h1 className={styles.toolMainTitle}>Slug Generator Tool</h1>

      <div className={styles.container}>
        <label htmlFor="slug-input" className={`${styles.input} ${styles.semiBold}`}>
          Write or paste your text here
          <input
            type="text"
            id="slug-input"
            autoComplete="off"
            value={inputValue}
            placeholder="Write or paste your text here..."
            onChange={(e) => setInputValue(e.target.value)}
            className={styles.inputField}
          />
        </label>
        <ToolOutput
          className={styles.output}
          output={outputValue || "-"}
          valueToCopy={outputValue}
        />
      </div>
      <div className={styles.description}>
        <h2 className={styles.descriptionTitle}>What is a URL Slug?</h2>
        <h3 className={styles.descriptionMedTitle}>Definition:</h3>
        <p className={styles.descriptionText}>
          A URL <strong className={styles.highlight}>Slug</strong> is the part of a URL
          that appears after the last slash. It&apos;s a simple, readable
          segment that identifies a specific page on a site. Typically, it
          consists of words or short phrases that describe the content of the
          page in a way that&apos;s easy to understand for both users and search
          engines.
        </p>
        <p className={styles.descriptionText}>
          For example: &quot;
          <span className={`${styles.underline} ${styles.semiBold}`}>
            https://www.random-link.com/en/
            <b className={styles.highlight}>this-is-the-slug</b>
          </span>
          &quot;
        </p>

        <h3 className={styles.descriptionMedTitle}>What&apos;s it for?</h3>
        <p className={styles.descriptionText}>
          In a way, it&apos;s the key part of a URL that acts as a “gateway” to
          a specific page on a site. It&apos;s also helpful for{" "}
          <strong className={styles.highlight}>SEO</strong>: a URL slug containing
          important keywords directly related to the page can improve its
          ranking in search results (although this is just one factor). A good{" "}
          <strong className={styles.highlight}>Slug</strong> also supports user
          experience by helping users quickly understand what they&apos;re
          likely to find on the page, and encourages them to click through when
          it&apos;s relevant to their search.
        </p>

        <h3 className={styles.descriptionMedTitle}>What makes a good Slug?</h3>
        <p className={styles.descriptionText}>
          For a <strong className={styles.highlight}>Slug</strong> to be effective,
          several important rules should be followed:
        </p>
        <ul className={styles.list}>
          <li>
            It should be standardized, meaning it should not contain capital
            letters, non-alphanumeric characters, spaces, or letters with
            accents.
          </li>
          <li>
            Words should be separated by hyphens; you can apply this rule to
            apostrophes as well. Avoid using unnecessary words like “the” or
            “of” to keep it concise.
          </li>
          <li>
            Although numbers are accepted, it&apos;s best to avoid adding any
            that might need to be updated in the future.
          </li>
          <li>
            Avoid long slugs, and focus on including only important keywords.
          </li>
        </ul>
        <p className={styles.descriptionText}>
          In general, a good <strong className={styles.highlight}>Slug</strong> is
          short, descriptive, and directly related to the page content. Keeping
          it concise also reduces the risk of keyword stuffing, which can
          negatively impact <strong className={styles.highlight}>SEO</strong>.
        </p>

        <h3 className={styles.descriptionMedTitle}>Examples:</h3>
        <ul className={styles.list}>
          <li>
            <strong className={styles.highlight}>Good usage:</strong> &quot;
            <span className={`${styles.underline} ${styles.semiBold}`}>
              https://www.random-link.com/en/
              <b className={styles.highlight}>best-cpus-for-gaming</b>
            </span>
            &quot;
            <br />
            <span className={styles.italic}>
              (Short slug targeting relevant keywords for the page)
            </span>
          </li>
          <li>
            <strong className={styles.destructive}>Bad usage:</strong> &quot;
            <span className={`${styles.underline} ${styles.semiBold}`}>
              https://www.random-link.com/en/
              <b className={styles.destructive}>
                what-are-the-best-cpus-for-your-gaming-computer
              </b>
            </span>
            &quot;
            <br />
            <span className={styles.italic}>(Too long and not focused enough)</span>
          </li>
          <li>
            <strong className={styles.highlight}>Good usage:</strong> &quot;
            <span className={`${styles.underline} ${styles.semiBold}`}>
              https://www.random-link.com/en/
              <b className={`${styles.highlight} ${styles.semiBold}`}>screen-32-inch</b>
            </span>
            &quot;
            <br />
            <span className={styles.italic}>
              (Includes a number that is unlikely to change)
            </span>
          </li>
          <li>
            <strong className={styles.destructive}>Bad usage:</strong> &quot;
            <span className={`${styles.underline} ${styles.semiBold}`}>
              https://www.random-link.com/en/
              <b className={styles.destructive}>best-movies-2024</b>
            </span>
            &quot;
            <br />
            <span className={styles.italic}>
              (Can look outdated as soon as the year changes)
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
