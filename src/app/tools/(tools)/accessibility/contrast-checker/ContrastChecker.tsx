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
    <div className="flex flex-col justify-center items-center ring py-4 px-6 gap-2 rounded">
      <p>{label}</p>
      <label className="flex items-center gap-3" htmlFor={idColor}>
        Select color
        <input
          type="color"
          value={colorValue}
          id={idColor}
          onChange={(e) => setColorValue(e.target.value)}
        />
      </label>
      <span>
        <label htmlFor={idHex}>
          HEX value:
          <input
            type="text"
            value={colorValue}
            className="text-black text-center w-32 ml-2 uppercase"
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
    <span className="bg-green-700 p-2 rounded-lg ml-4">Success</span>
  ) : (
    <span className="bg-red-700 py-2 px-4 rounded-lg ml-4">Fail</span>
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
    <div className="flex flex-col h-auto gap-8 w-full items-center">
      <h1 className="font-bold text-4xl mt-8 lg:mt-0">Contrast Checker Tool</h1>
      <div className="flex flex-col md:flex-row justify-center gap-8">
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

      <div className="w-2/3 text-center">
        <p
          className="text-3xl font-bold p-4 ring rounded"
          style={sampleTextStyle}
          title="Sample text color testing"
          aria-label="Sample text color testing"
        >
          SAMPLE TEXT COLOR TESTING
        </p>
      </div>
      <p>
        Contrast ratio :
        <span className="text-3xl font-bold ml-2">{ratio.toFixed(2)}:1</span>
      </p>
      <div className="w-5/6 md:w-2/3">
        <div
          className={`flex flex-col gap-2 mb-8 ring p-4 rounded ${
            ratio >= 4.5 ? "ring-green-700" : "ring-red-700"
          }`}
        >
          <h3 className="font-bold text-3xl">WCAG AA</h3>
          <p className="mb-2">Normal text : {getTag(ratio >= 4.5)}</p>
          <p>Large text : {getTag(ratio >= 3)}</p>
        </div>
        <div
          className={`flex flex-col gap-2 ring p-4 rounded ${
            ratio >= 7 ? "ring-green-700" : "ring-red-700"
          }`}
        >
          <h3 className="font-bold text-3xl">WCAG AAA</h3>
          <p className="mb-2">Normal text : {getTag(ratio >= 7)}</p>
          <p>Large text : {getTag(ratio >= 4.5)}</p>
        </div>
      </div>
      <div className="rounded-lg p-4 border-2 border-secondary relative flex flex-col gap-4 mt-8 mx-2">
        <h2 className="text-2xl xs:text-3xl font-bold absolute -top-4 xs:left-8 bg-background px-2">
          What is Contrast Ratio?
        </h2>
        <h3 className="mt-4 text-2xl underline underline-offset-4">
          Definition:
        </h3>
        <p>
          Contrast ratio is the result of a calculation between the foreground
          color (usually text) and the background color. It&apos;s essential for
          determining whether the contrast between two colors is sufficient for
          the text to be easily legible by all users, including those with
          visual impairments.
        </p>
        <h3 className="text-2xl underline underline-offset-4 mt-2">
          How does it work?
        </h3>
        <p>
          To calculate this ratio, we first need the relative luminance of the
          two colors being compared. This involves transforming each{" "}
          <strong className="text-primary">RGB</strong> color component into a
          luminance value.
        </p>
        <p className="-mb-2 mt-2">
          We use the following formulas to achieve this:
        </p>
        <ul className="list-disc pl-8 space-y-2">
          <li>
            If <strong className="text-primary">RsRGB</strong> ≤{" "}
            <strong className="text-primary">0.03928</strong> then{" "}
            <strong className="text-primary">R</strong> ={" "}
            <strong className="text-primary">RsRGB</strong> /{" "}
            <strong className="text-primary">12.92</strong> else{" "}
            <strong className="text-primary">R</strong> = ((
            <strong className="text-primary">RsRGB</strong> +{" "}
            <strong className="text-primary">0.055</strong>) /{" "}
            <strong className="text-primary">1.055</strong>) ^{" "}
            <strong className="text-primary">2.4</strong>
          </li>
          <li>
            If <strong className="text-primary">GsRGB</strong> ≤{" "}
            <strong className="text-primary">0.03928</strong> then{" "}
            <strong className="text-primary">G</strong> ={" "}
            <strong className="text-primary">GsRGB</strong> /{" "}
            <strong className="text-primary">12.92</strong> else{" "}
            <strong className="text-primary">G</strong> = ((
            <strong className="text-primary">GsRGB</strong> +{" "}
            <strong className="text-primary">0.055</strong>) /{" "}
            <strong className="text-primary">1.055</strong>) ^{" "}
            <strong className="text-primary">2.4</strong>
          </li>
          <li>
            If <strong className="text-primary">BsRGB</strong> ≤{" "}
            <strong className="text-primary">0.03928</strong> then{" "}
            <strong className="text-primary">B</strong> ={" "}
            <strong className="text-primary">BsRGB</strong> /{" "}
            <strong className="text-primary">12.92</strong> else{" "}
            <strong className="text-primary">B</strong> = ((
            <strong className="text-primary">BsRGB</strong> +{" "}
            <strong className="text-primary">0.055</strong>) /{" "}
            <strong className="text-primary">1.055</strong>) ^{" "}
            <strong className="text-primary">2.4</strong>
          </li>
        </ul>
        <p className="-mb-2 mt-2">
          Once the relative luminance values of both colors are obtained, we
          sort them by brightness:
        </p>
        <ul className="list-disc pl-8 space-y-2">
          <li>
            <strong className="text-primary">L1</strong> = the lighter color
          </li>
          <li>
            <strong className="text-primary">L2</strong> = the darker color
          </li>
        </ul>
        <p className="-mb-2 mt-2">We then perform the following calculation:</p>
        <ul className="list-disc pl-8">
          <li>
            (<strong className="text-primary">L1</strong> +{" "}
            <strong className="text-primary">0.05</strong>) / (
            <strong className="text-primary">L2</strong> +{" "}
            <strong className="text-primary">0.05</strong>)
          </li>
        </ul>
        <p>
          Which gives us a ratio between{" "}
          <strong className="text-primary">1:1</strong> (lowest contrast) and{" "}
          <strong className="text-primary">21:1</strong> (highest contrast).
        </p>

        <h3 className="text-2xl underline underline-offset-4 mt-2">
          What is it for?
        </h3>
        <p>
          The contrast ratio is a key metric for web accessibility, ensuring
          that website text is readable by everyone, including users with visual
          limitations. Depending on the text size, weight, and contrast ratio,
          we can evaluate if a text element meets the standards for readability.
        </p>
        <p className="mt-2 -mb-2">
          According to WCAG standards, the minimum acceptable values for
          accessible text are:
        </p>
        <h4 className="text-xl font-semibold underline underline-offset-4">
          WCAG AA :
        </h4>
        <ul className="list-disc pl-8 space-y-2">
          <li>
            Normal text: <strong className="text-primary">4.5:1</strong>
          </li>
          <li>
            Large text: <strong className="text-primary">3:1</strong>
          </li>
        </ul>
        <h4 className="text-xl font-semibold underline underline-offset-4">
          WCAG AAA :
        </h4>
        <ul className="list-disc pl-8 space-y-2">
          <li>
            Normal text: <strong className="text-primary">7:1</strong>
          </li>
          <li>
            Large text: <strong className="text-primary">4.5:1</strong>
          </li>
        </ul>
        <p className="text-lg italic -mb-4">
          * Normal text = font size &lt; 18pt / 24px.
        </p>
        <p className="text-lg italic">
          ** Large text = font size ≥ 18pt / 24px or 14pt / 18px if{" "}
          <strong>bold</strong>.
        </p>
        <p className="mt-2 -mb-2">Sources:</p>
        <ul className="list-disc pl-8">
          <li>
            <Link
              href={"https://www.w3.org/WAI/GL/wiki/Relative_luminance"}
              aria-label="Learn more about relative luminance"
              rel="noopener noreferrer"
              target="_blank"
              className="hover:underline underline-offset-4 text-primary"
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
              className="hover:underline underline-offset-4 text-primary"
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
              className="hover:underline underline-offset-4 text-primary"
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
              className="hover:underline underline-offset-4 text-primary"
            >
              WCAG contrast enhanced (Level AAA)
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
