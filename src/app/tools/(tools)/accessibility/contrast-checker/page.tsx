"use client";

import { getContrastRatio } from "@/utils/getContrastRatio";
import { useState } from "react";

function ColorPicker({
  label,
  colorValue,
  setColorValue,
}: {
  label: string;
  colorValue: string;
  setColorValue: (value: string) => void;
}) {
  return (
    <div className="flex flex-col justify-center items-center ring py-4 px-6 gap-2 rounded">
      <p>{label}</p>
      <label className="flex items-center gap-3">
        Select color
        <input
          type="color"
          value={colorValue}
          onChange={(e) => setColorValue(e.target.value)}
        />
      </label>
      <span>
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
        />
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
      <h2 className="font-bold text-4xl mt-8 lg:mt-0">Contrast Checker</h2>
      <div className="flex flex-col md:flex-row justify-center gap-8">
        <ColorPicker
          label="Foreground"
          colorValue={firstColorValue}
          setColorValue={setFirstColorValue}
        />

        <ColorPicker
          label="Background"
          colorValue={secondColorValue}
          setColorValue={setSecondColorValue}
        />
      </div>

      <div className="w-2/3 text-center">
        <p
          className="text-3xl font-bold p-4 ring rounded"
          style={sampleTextStyle}
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
        <div className="flex flex-col gap-4">
          <p className="mt-8">* Normal text = font size &lt; 18pt / 24px.</p>
          <p>
            ** Large text = font size ≥ 18pt / 24px or 14pt / 18px if{" "}
            <span className="font-bold">bold</span>.
          </p>
          <p className="-mb-4">*** Min ratio value : </p>
          <div className="ml-8">
            - WCAG AA :
            <ul className="list-disc ml-10">
              <li>
                Normal : <span className="font-bold text-xl">4.5:1</span>
              </li>
              <li>
                Large : <span className="font-bold text-xl">3:1</span>
              </li>
            </ul>
            - WCAG AAA :
            <ul className="list-disc ml-10">
              <li>
                Normal : <span className="font-bold text-xl">7:1</span>
              </li>
              <li>
                Large : <span className="font-bold text-xl">4.5:1</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
