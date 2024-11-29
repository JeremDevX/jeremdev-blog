"use client";

import { getContrastRatio } from "@/utils/getContrastRatio";
import Link from "next/link";
import { useState } from "react";

function ColorPicker({
  label,
  colorValue,
  setColorValue,
  idColor,
  idHex,
}: {
  label: string;
  colorValue: string;
  idColor: string;
  idHex: string;
  setColorValue: (value: string) => void;
}) {
  return (
    <div className="contrast-check__color-picker">
      <p>{label}</p>
      <label className="" htmlFor={idColor}>
        Select color :
        <input
          type="color"
          value={colorValue}
          id={idColor}
          onChange={(e) => setColorValue(e.target.value)}
        />
      </label>
      <span>
        <label htmlFor={idHex}>
          HEX value :
          <input
            type="text"
            value={colorValue}
            onChange={(e) => {
              const value = e.target.value;
              const sanitizedValue =
                "#" + value.replace(/[^a-fA-F0-9]/g, "").slice(0, 6);
              setColorValue(sanitizedValue);
            }}
            id={idHex}
          />
        </label>
      </span>
    </div>
  );
}

function getTag(isSuccess: boolean) {
  return isSuccess ? (
    <span className="contrast-check__success">Success</span>
  ) : (
    <span className="contrast-check__fail">Fail</span>
  );
}

export default function ContrastChecker() {
  const [firstColorValue, setFirstColorValue] = useState("#ffffff");
  const [secondColorValue, setSecondColorValue] = useState("#000000");

  const ratio = getContrastRatio(firstColorValue, secondColorValue);

  const sampleTextStyle = {
    color: firstColorValue,
    backgroundColor: secondColorValue,
  };

  return (
    <div className="tool__main">
      <h1 className="tool__main-title">Contrast Checker Tool</h1>
      <div className="contrast-check">
        <ColorPicker
          label="Foreground"
          colorValue={firstColorValue}
          setColorValue={setFirstColorValue}
          idColor="input-foreground-color"
          idHex="input-foreground-hex"
        />

        <ColorPicker
          label="Background"
          colorValue={secondColorValue}
          setColorValue={setSecondColorValue}
          idColor="input-background-color"
          idHex="input-background-hex"
        />
      </div>

      <div className="contrast-check__sample">
        <p
          style={sampleTextStyle}
          title="Sample text color testing"
          aria-label="Sample text color testing"
        >
          SAMPLE TEXT COLOR TESTING
        </p>
      </div>
      <p className="contrast-check__ratio">
        Contrast ratio :
        <span className="contrast-check__ratio--number">
          {ratio.toFixed(2)}:1
        </span>
      </p>
      <div className="contrast-check__tests">
        <div
          className={`contrast-check__wcag ${
            ratio >= 4.5
              ? "contrast-check__wcag--good"
              : "contrast-check__wcag--bad"
          }`}
        >
          <h3 className="contrast-check__wcag-norm">WCAG AA</h3>
          <p>Normal text : {getTag(ratio >= 4.5)}</p>
          <p>Large text : {getTag(ratio >= 3)}</p>
        </div>
        <div
          className={`contrast-check__wcag ${
            ratio >= 7
              ? "contrast-check__wcag--good"
              : "contrast-check__wcag--bad"
          }`}
        >
          <h3 className="contrast-check__wcag-norm">WCAG AAA</h3>
          <p>Normal text : {getTag(ratio >= 7)}</p>
          <p>Large text : {getTag(ratio >= 4.5)}</p>
        </div>
      </div>
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
