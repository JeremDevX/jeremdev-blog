"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CopyButton.module.scss";

const COPY_SUCCESS_TIMEOUT_MS = 1500;

type CopyState = "idle" | "success";

export type CopyButtonProps = {
  valueToCopy: string;
  className?: string;
};

export default function CopyButton({ valueToCopy, className }: CopyButtonProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [assistiveMessage, setAssistiveMessage] = useState("");
  const [visibleErrorMessage, setVisibleErrorMessage] = useState("");
  const resetTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    },
    [],
  );

  const clearResetTimer = () => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  };

  const startResetTimer = () => {
    clearResetTimer();
    resetTimerRef.current = window.setTimeout(() => {
      setCopyState("idle");
      setAssistiveMessage("");
      setVisibleErrorMessage("");
      resetTimerRef.current = null;
    }, COPY_SUCCESS_TIMEOUT_MS);
  };

  const handleCopy = async () => {
    clearResetTimer();
    setCopyState("success");
    setAssistiveMessage("Copied to clipboard.");
    setVisibleErrorMessage("");
    startResetTimer();

    try {
      await navigator.clipboard.writeText(valueToCopy);
    } catch {
      clearResetTimer();
      setCopyState("idle");
      setAssistiveMessage("Copy failed. Please copy manually.");
      setVisibleErrorMessage("Copy failed. Please copy manually.");
    }
  };

  const buttonText = copyState === "success" ? "Copied!" : "Copy";
  const buttonClassName = [
    styles.button,
    styles["button--fixed"],
    copyState === "success" ? styles["button--success"] : null,
    className ?? null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={buttonClassName}
        data-state={copyState}
        onClick={handleCopy}
      >
        {buttonText}
      </button>
      <span className={styles.srOnly} role="status" aria-live="polite">
        {assistiveMessage}
      </span>
      {visibleErrorMessage ? (
        <span className={styles.errorFeedback} role="alert">
          {visibleErrorMessage}
        </span>
      ) : null}
    </div>
  );
}
