"use client";

import { useRef, useState } from "react";

export default function BorderRadius() {
  const [squareSize, setSquareSize] = useState({
    width: "150",
    height: "150",
  });
  const [borderRadius, setBorderRadius] = useState({
    topLeft: "0",
    topRight: "0",
    bottomLeft: "0",
    bottomRight: "0",
  });
  const [toggleSlides, setToggleSlides] = useState(false);
  const [toggleCustomSize, setToggleCustomSize] = useState(false);
  const squareRef = useRef<HTMLDivElement | null>(null);

  const squareStyle = {
    width: `${squareSize.width}px`,
    height: `${squareSize.height}px`,
    borderTopLeftRadius: `${borderRadius.topLeft}%`,
    borderTopRightRadius: `${borderRadius.topRight}%`,
    borderBottomLeftRadius: `${borderRadius.bottomLeft}%`,
    borderBottomRightRadius: `${borderRadius.bottomRight}%`,
  };

  const squareSizeInputs = [
    {
      name: "Width",
      id: "width",
      value: squareSize.width,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setSquareSize({ ...squareSize, width: e.target.value }),
    },
    {
      name: "Height",
      id: "height",
      value: squareSize.height,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setSquareSize({ ...squareSize, height: e.target.value }),
    },
  ];

  const inputRanges = [
    {
      name: "Top-Left",
      id: "top-left",
      value: borderRadius.topLeft,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setBorderRadius({ ...borderRadius, topLeft: e.target.value }),
    },
    {
      name: "Top-Right",
      id: "top-right",
      value: borderRadius.topRight,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setBorderRadius({ ...borderRadius, topRight: e.target.value }),
    },
    {
      name: "Bottom-Right",
      id: "bottom-right",
      value: borderRadius.bottomRight,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setBorderRadius({ ...borderRadius, bottomRight: e.target.value }),
    },
    {
      name: "Bottom-Left",
      id: "bottom-left",
      value: borderRadius.bottomLeft,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setBorderRadius({ ...borderRadius, bottomLeft: e.target.value }),
    },
  ];

  const handleCopyBorderRadius = () => {
    if (squareRef.current) {
      const borderRadiusValue = squareRef.current.style.borderRadius;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(borderRadiusValue)
          .then(() => {
            alert(`Border-radius copied: ${borderRadiusValue}`);
          })
          .catch((err) => {
            console.error("Failed to copy: ", err);
          });
      } else {
        // Fallback for navigators that don't support clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = borderRadiusValue;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          alert(`Border-radius copied: ${borderRadiusValue}`);
        } catch (err) {
          console.error("Fallback: Oops, unable to copy", err);
        }
        document.body.removeChild(textArea);
      }
    }
  };
  return (
    <div className="flex flex-col h-auto gap-8 w-full items-center p-2 xl:p-0">
      <h1 className="text-3xl font-bold">Border Radius Tool</h1>
      <div
        className={`flex items-center justify-center w-full xl:ml-12 border-2 bg-card p-4 ${toggleCustomSize || toggleSlides ? "pt-72" : ""} md:pt-0 md:pb-0 pb-28 min-h-96 rounded-lg relative`}
      >
        <div style={squareStyle} className="bg-gradient" ref={squareRef} />
        {toggleCustomSize && (
          <div
            className={`absolute top-4 xs:left-4 ${toggleSlides && "left-4"} text-base xs:text-lg`}
          >
            {squareSizeInputs.map((input) => (
              <label
                htmlFor={input.id}
                key={input.id}
                className="flex flex-col items-center gap-2 mb-4"
              >
                {input.name} : {input.value}px
                <input
                  type="range"
                  min={50}
                  max={250}
                  id={input.id}
                  value={input.value}
                  onChange={input.onChange}
                  className=" w-28 xs:w-40"
                />
              </label>
            ))}
          </div>
        )}
        <button
          className="absolute bottom-4 xs:left-4 bg-secondary p-1 xs:p-2 rounded w-36 xs:w-40 border-2 border-primary font-semibold"
          onClick={() => setToggleCustomSize(!toggleCustomSize)}
        >
          {!toggleCustomSize ? "Custom size" : "Default size"}
        </button>
        {toggleSlides && (
          <div
            className={`absolute top-4 xs:right-4 ${toggleCustomSize && "right-4"} text-base xs:text-lg`}
          >
            {inputRanges.map((inputRange) => (
              <label
                htmlFor={inputRange.id}
                key={inputRange.id}
                className="flex flex-col items-center gap-2 mb-4 px-2"
              >
                {inputRange.name} : {inputRange.value}%
                <input
                  type="range"
                  min={0}
                  max={100}
                  id={inputRange.id}
                  value={inputRange.value}
                  onChange={inputRange.onChange}
                  className="w-28 xs:w-40"
                />
              </label>
            ))}
          </div>
        )}
        <button
          className="absolute bottom-16 xs:bottom-4 xs:right-4 bg-secondary p-1 xs:p-2 rounded w-36 xs:w-40 border-2 border-primary font-semibold"
          onClick={() => setToggleSlides(!toggleSlides)}
        >
          {!toggleSlides ? "Use Slides" : "Direct Control"}
        </button>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
        <span className="px-4 py-2 ml-2 bg-muted rounded border-2 border-secondary text-base xs:text-lg">{`border-radius : ${borderRadius.topRight}% ${borderRadius.topLeft}% ${borderRadius.bottomRight}% ${borderRadius.bottomLeft}%`}</span>
        <button
          className="px-4 py-2 ml-4 bg-secondary rounded border-2 border-muted active:bg-primary active:text-primary-foreground w-20 h-12"
          onClick={handleCopyBorderRadius}
        >
          Copy
        </button>
      </div>
    </div>
  );
}
