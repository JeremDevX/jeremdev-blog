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
    </div>
  );
}
