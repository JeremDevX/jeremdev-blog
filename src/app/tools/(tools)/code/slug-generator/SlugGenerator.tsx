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
      getValue: (ref) => (ref.current as HTMLInputElement).value,
      onSuccess: () => {
        setIsCopied(true);
      },
      onError: () => {
        setFailedToCopy(true);
      },
    });
  };

  return (
    <div className="flex flex-col h-auto gap-8 w-full items-center px-2 relative">
      <h1 className="font-bold text-4xl mt-8 lg:mt-0">Slug Generator Tool</h1>

      <div className="flex flex-col gap-8 w-full">
        <label
          htmlFor="input"
          className="flex flex-col items-center gap-2 font-semibold"
        >
          Write or paste your text here
          <input
            type="text"
            id="input"
            className="xs:w-96 w-full h-12 rounded-lg text-foreground indent-2 bg-background border-secondary border-2"
            autoComplete="off"
            value={inputValue}
            placeholder="Write or paste your text here..."
            onChange={(e) => setInputValue(e.target.value)}
          />
        </label>
        <label
          htmlFor="output"
          className="flex flex-col items-center gap-2 font-semibold"
        >
          Generated Slug
          <input
            type="text"
            id="output"
            disabled
            className="xs:w-96 w-full h-12 rounded-lg text-foreground indent-2 bg-background border-secondary border-2"
            value={outputValue}
            ref={outputRef}
          />
          <Button
            onClick={handleCopyInput}
            text="Copy Slug"
            className="mt-2"
            disabled={outputValue.length === 0}
          />
          <NotificationPopup
            message="Slug copied!"
            isVisible={isCopied}
            onClose={() => setIsCopied(false)}
            duration={2000}
            styles="bg-secondary text-secondary-foreground"
          />
          <NotificationPopup
            message="An error occurred."
            isVisible={failedToCopy}
            onClose={() => setFailedToCopy(false)}
            duration={2000}
            styles="bg-destructive text-destructive-foreground"
          />
        </label>
      </div>
      <div className="rounded-lg p-4 border-2 border-secondary relative flex flex-col gap-4 mt-8 mx-2">
        <h2 className="text-2xl xs:text-3xl font-bold absolute -top-4 xs:left-8 bg-background px-2">
          What is a URL Slug?
        </h2>
        <h3 className="mt-4 text-2xl underline underline-offset-4">
          Definition:
        </h3>
        <p>
          A URL <strong className="text-primary">Slug</strong> is the part of a
          URL that appears after the last slash. It&apos;s a simple, readable
          segment that identifies a specific page on a site. Typically, it
          consists of words or short phrases that describe the content of the
          page in a way that&apos;s easy to understand for both users and search
          engines.
        </p>
        <p className="mt-2">
          For example:
          <span className="block mt-1 pl-4 font-semibold">
            https://www.random-link.com/en/
            <strong className="text-primary font-semibold">
              this-is-the-slug
            </strong>
          </span>
        </p>

        <h3 className="text-2xl underline underline-offset-4 mt-2">
          What&apos;s it for?
        </h3>
        <p>
          In a way, it&apos;s the key part of a URL that acts as a “gateway” to
          a specific page on a site. It&apos;s also helpful for{" "}
          <strong className="text-primary">SEO</strong>: a URL slug containing
          important keywords directly related to the page can improve its
          ranking in search results (although this is just one factor). A good{" "}
          <strong className="text-primary">Slug</strong> also supports user
          experience by helping users quickly understand what they&apos;re
          likely to find on the page, and encourages them to click through when
          it&apos;s relevant to their search.
        </p>

        <h3 className="text-2xl underline underline-offset-4 mt-2">
          What makes a good Slug?
        </h3>
        <p>
          For a <strong className="text-primary">Slug</strong> to be effective,
          several important rules should be followed:
        </p>
        <ul className="list-disc pl-8 space-y-2 mt-2">
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
        <p className="mt-2">
          In general, a good <strong className="text-primary">Slug</strong> is
          short, descriptive, and directly related to the page content. Keeping
          it concise also reduces the risk of keyword stuffing, which can
          negatively impact <strong className="text-primary">SEO</strong>.
        </p>

        <h3 className="text-2xl underline underline-offset-4 mt-2">
          Examples:
        </h3>
        <ul className="list-disc pl-8 space-y-2">
          <li>
            <strong className="text-primary">Good usage:</strong>{" "}
            <span className="font-semibold">
              “https://www.random-link.com/en/
              <strong className="text-primary font-semibold">
                best-cpus-for-gaming
              </strong>
              ”
            </span>
            <br />
            <span className="italic">
              (Short slug targeting relevant keywords for the page)
            </span>
          </li>
          <li>
            <strong className="text-destructive">Bad usage:</strong>{" "}
            <span className="font-semibold">
              “https://www.random-link.com/en/
              <strong className="text-destructive font-semibold">
                what-are-the-best-cpus-for-your-gaming-computer
              </strong>
              ”
            </span>
            <br />
            <span className="italic">(Too long and not focused enough)</span>
          </li>
          <li>
            <strong className="text-primary">Good usage:</strong>{" "}
            <span className="font-semibold">
              “https://www.random-link.com/en/
              <strong className="text-primary font-semibold">
                screen-32-inch
              </strong>
              ”
            </span>
            <br />
            <span className="italic">
              (Includes a number that is unlikely to change)
            </span>
          </li>
          <li>
            <strong className="text-destructive">Bad usage:</strong>{" "}
            <span className="font-semibold">
              “https://www.random-link.com/en/
              <strong className="text-destructive font-semibold">
                best-movies-2024
              </strong>
              ”
            </span>
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
