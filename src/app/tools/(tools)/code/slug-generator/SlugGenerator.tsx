"use client";

import Button from "@/components/custom/Button";
import NotificationPopup from "@/components/custom/CopyPopup";
import { handleCopy } from "@/utils/handleCopy";
import { useEffect, useRef, useState } from "react";

export default function SlugGenerator() {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const outputRef = useRef<HTMLInputElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [failedToCopy, setFailedToCopy] = useState(false);

  useEffect(() => {
    const slug = inputValue
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\s']/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    setOutputValue(slug);
  }, [inputValue]);

  const handleCopyInput = () => {
    handleCopy({
      ref: outputRef,
      getValue: (ref) => ref.current?.value ?? "",
      onSuccess: () => {
        setIsCopied(true);
      },
      onError: () => {
        setFailedToCopy(true);
      },
    });
  };

  return (
    <div className="tool__main">
      <h1 className="tool__main-title">Slug Generator Tool</h1>

      <div className="slug-gen">
        <label htmlFor="input" className="slug-gen__input semi-bold">
          Write or paste your text here
          <input
            type="text"
            id="input"
            autoComplete="off"
            value={inputValue}
            placeholder="Write or paste your text here..."
            onChange={(e) => setInputValue(e.target.value)}
          />
        </label>
        <label htmlFor="output" className="slug-gen__input semi-bold">
          Generated Slug
          <input
            type="text"
            id="output"
            disabled
            className="slug-gen__input--disabled"
            value={outputValue}
            ref={outputRef}
          />
        </label>
        <Button onClick={handleCopyInput} disabled={outputValue.length === 0}>
          Copy Slug
        </Button>
        <NotificationPopup
          message="Slug copied!"
          isVisible={isCopied}
          onClose={() => setIsCopied(false)}
          duration={2000}
          className="copy-success"
        />
        <NotificationPopup
          message="An error occurred."
          isVisible={failedToCopy}
          onClose={() => setFailedToCopy(false)}
          duration={2000}
          className="copy-error"
        />
      </div>
      <div className="tool__desc">
        <h2 className="tool__desc-title">What is a URL Slug?</h2>
        <h3 className="tool__desc-med-title">Definition:</h3>
        <p className="tool__desc-text">
          A URL <strong className="highlight">Slug</strong> is the part of a URL
          that appears after the last slash. It&apos;s a simple, readable
          segment that identifies a specific page on a site. Typically, it
          consists of words or short phrases that describe the content of the
          page in a way that&apos;s easy to understand for both users and search
          engines.
        </p>
        <p className="tool__desc-text">
          For example: &quot;
          <span className="underline semi-bold">
            https://www.random-link.com/en/
            <b className="highlight">this-is-the-slug</b>
          </span>
          &quot;
        </p>

        <h3 className="tool__desc-med-title">What&apos;s it for?</h3>
        <p className="tool__desc-text">
          In a way, it&apos;s the key part of a URL that acts as a “gateway” to
          a specific page on a site. It&apos;s also helpful for{" "}
          <strong className="highlight">SEO</strong>: a URL slug containing
          important keywords directly related to the page can improve its
          ranking in search results (although this is just one factor). A good{" "}
          <strong className="highlight">Slug</strong> also supports user
          experience by helping users quickly understand what they&apos;re
          likely to find on the page, and encourages them to click through when
          it&apos;s relevant to their search.
        </p>

        <h3 className="tool__desc-med-title">What makes a good Slug?</h3>
        <p className="tool__desc-text">
          For a <strong className="highlight">Slug</strong> to be effective,
          several important rules should be followed:
        </p>
        <ul className="ul-list">
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
        <p className="tool__desc-text">
          In general, a good <strong className="highlight">Slug</strong> is
          short, descriptive, and directly related to the page content. Keeping
          it concise also reduces the risk of keyword stuffing, which can
          negatively impact <strong className="highlight">SEO</strong>.
        </p>

        <h3 className="tool__desc-med-title">Examples:</h3>
        <ul className="ul-list">
          <li>
            <strong className="highlight">Good usage:</strong> &quot;
            <span className="underline semi-bold">
              https://www.random-link.com/en/
              <b className="highlight">best-cpus-for-gaming</b>
            </span>
            &quot;
            <br />
            <span className="italic">
              (Short slug targeting relevant keywords for the page)
            </span>
          </li>
          <li>
            <strong className="destructive">Bad usage:</strong> &quot;
            <span className="underline semi-bold">
              https://www.random-link.com/en/
              <b className="destructive">
                what-are-the-best-cpus-for-your-gaming-computer
              </b>
            </span>
            &quot;
            <br />
            <span className="italic">(Too long and not focused enough)</span>
          </li>
          <li>
            <strong className="highlight">Good usage:</strong> &quot;
            <span className="underline semi-bold">
              https://www.random-link.com/en/
              <b className="highlight font-semibold">screen-32-inch</b>
            </span>
            &quot;
            <br />
            <span className="italic">
              (Includes a number that is unlikely to change)
            </span>
          </li>
          <li>
            <strong className="destructive">Bad usage:</strong> &quot;
            <span className="underline semi-bold">
              https://www.random-link.com/en/
              <b className="destructive">best-movies-2024</b>
            </span>
            &quot;
            <br />
            <span className="italic">
              (Users may think the page content is outdated if they see this in
              2025)
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
