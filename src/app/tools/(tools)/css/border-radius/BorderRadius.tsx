"use client";

import { useEffect, useRef, useState } from "react";

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
  const [dragging, setDragging] = useState<null | string>(null);

  const handleMouseDown = (corner: string) => {
    setDragging(corner);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging && squareRef.current) {
      const rect = squareRef.current.getBoundingClientRect();
      let percentage;

      if (dragging === "topLeft") {
        percentage = ((e.clientY - rect.top) / rect.height) * 100;
      } else if (dragging === "bottomLeft") {
        percentage = ((e.clientX - rect.left) / rect.width) * 100;
      } else if (dragging === "bottomRight") {
        percentage = ((rect.bottom - e.clientY) / rect.height) * 100;
      } else {
        percentage = ((rect.right - e.clientX) / rect.width) * 100;
      }

      const clampedPercentage = Math.max(0, Math.min(100, percentage));

      setBorderRadius((prev) => ({
        ...prev,
        [dragging]: clampedPercentage.toFixed(0),
      }));
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  const squareStyle = {
    width: `${squareSize.width}px`,
    height: `${squareSize.height}px`,
    borderRadius: `${100 - Number(borderRadius.topRight)}% ${borderRadius.topRight}% ${100 - Number(borderRadius.bottomLeft)}% ${borderRadius.bottomLeft}% / ${borderRadius.topLeft}% ${100 - Number(borderRadius.bottomRight)}% ${borderRadius.bottomRight}% ${100 - Number(borderRadius.topLeft)}%`,
  };
  const squareBorder = {
    width: `${Number(squareSize.width) + 4}px`,
    height: `${Number(squareSize.height) + 4}px`,
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
      const borderRadiusValue = `border-radius: ${squareRef.current.style.borderRadius}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(borderRadiusValue)
          .then(() => {
            alert(`CSS copied: ${borderRadiusValue}`);
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
          alert(`CSS copied: ${borderRadiusValue}`);
        } catch (err) {
          console.error("Fallback: Oops, unable to copy", err);
        }
        document.body.removeChild(textArea);
      }
    }
  };
  const handleCustomSize = () => {
    setToggleCustomSize(!toggleCustomSize);
    if (toggleCustomSize) {
      setSquareSize({ width: "150", height: "150" });
    }
  };
  return (
    <div className="flex flex-col h-auto gap-8 w-full items-center p-2 xl:p-0">
      <h1 className="text-3xl font-bold">Border Radius Tool</h1>
      <div
        className={`flex items-center justify-center w-full m-auto border-2 bg-card p-4 ${toggleCustomSize || toggleSlides ? "pt-72" : ""} md:pt-0 md:pb-0 pb-28 min-h-96 rounded-lg relative`}
      >
        <div
          style={squareBorder}
          className={`relative ${!toggleSlides && "border-2 border-dashed border-gray-400"}`}
        >
          <div
            style={squareStyle}
            className={`bg-gradient ${toggleSlides && "absolute"}`}
            ref={squareRef}
          />
          {!toggleSlides && (
            <>
              <div
                className="absolute bg-green-700 w-3 h-3 cursor-pointer border-2 border-white active:w-4 active:h-4 hover:w-4 hover:h-4"
                style={{
                  top: `${borderRadius.topLeft}%`,
                  left: 0,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseDown={() => handleMouseDown("topLeft")}
                title="Drag to the bottom to increase the border radius"
                aria-label="Drag to the bottom to increase the border radius"
              />
              <div
                className="absolute bg-red-700 w-3 h-3 cursor-pointer border-2 border-white active:w-4 active:h-4 hover:w-4 hover:h-4"
                style={{
                  top: 0,
                  right: `${borderRadius.topRight}%`,
                  transform: "translate(50%, -50%)",
                }}
                onMouseDown={() => handleMouseDown("topRight")}
                title="Drag to the left to increase the border radius"
                aria-label="Drag to the left to increase the border radius"
              />
              <div
                className="absolute bg-blue-700 w-3 h-3 cursor-pointer border-2 border-white active:w-4 active:h-4 hover:w-4 hover:h-4"
                style={{
                  bottom: 0,
                  left: `${borderRadius.bottomLeft}%`,
                  transform: "translate(-50%, 50%)",
                }}
                onMouseDown={() => handleMouseDown("bottomLeft")}
                title="Drag to the right to increase the border radius"
                aria-label="Drag to the right to increase the border radius"
              />
              <div
                className="absolute bg-yellow-700 w-3 h-3 cursor-pointer border-2 border-white active:w-4 active:h-4 hover:w-4 hover:h-4"
                style={{
                  bottom: `${borderRadius.bottomRight}%`,
                  right: 0,
                  transform: "translate(50%, 50%)",
                }}
                onMouseDown={() => handleMouseDown("bottomRight")}
                title="Drag to the top to increase the border radius"
                aria-label="Drag to the top to increase the border radius"
              />
            </>
          )}
        </div>
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
                  className="w-28 xs:w-40"
                />
              </label>
            ))}
          </div>
        )}
        <button
          className="absolute bottom-4 xs:left-4 bg-secondary p-1 xs:p-2 rounded w-36 xs:w-40 border-2 border-primary font-semibold"
          onClick={handleCustomSize}
          title="Click to change the size of the square or restore the default size"
          aria-label="Click to change the size of the square or restore the default size"
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
          title="Click to switch between using slides and direct control"
          aria-label="Click to switch between using slides and direct control"
        >
          {!toggleSlides ? "Use Slides" : "Direct Control"}
        </button>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
        <span className="px-4 py-2 ml-2 bg-muted rounded border-2 border-secondary text-base xs:text-lg">{`border-radius : ${100 - Number(borderRadius.topRight)}% ${borderRadius.topRight}% ${100 - Number(borderRadius.bottomLeft)}% ${borderRadius.bottomLeft}% / ${borderRadius.topLeft}% ${100 - Number(borderRadius.bottomRight)}% ${borderRadius.bottomRight}% ${100 - Number(borderRadius.topLeft)}%`}</span>
        <button
          className="px-4 py-2 ml-4 bg-secondary rounded border-2 border-muted active:bg-primary active:text-primary-foreground w-20 h-12"
          onClick={handleCopyBorderRadius}
          title="Click to copy the CSS border-radius value"
          aria-label="Click to copy the CSS border-radius value"
        >
          Copy
        </button>
      </div>
    </div>
  );
}
