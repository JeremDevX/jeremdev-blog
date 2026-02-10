"use client";

import Button from "@/components/custom/Button";
import NotificationPopup from "@/components/custom/CopyPopup";
import { handleCopy } from "@/utils/handleCopy";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const [isCopied, setIsCopied] = useState(false);
  const [failedToCopy, setFailedToCopy] = useState(false);

  const handleMouseDown = (corner: string) => {
    setDragging(corner);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
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
    },
    [dragging],
  );

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
  }, [dragging, handleMouseMove]);

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
    handleCopy({
      ref: squareRef,
      getValue: (ref) =>
        `border-radius: ${(ref.current as HTMLElement).style.borderRadius}`,
      onSuccess: () => {
        setIsCopied(true);
      },
      onError: () => {
        setFailedToCopy(true);
      },
    });
  };

  const handleCustomSize = () => {
    setToggleCustomSize(!toggleCustomSize);
    if (toggleCustomSize) {
      setSquareSize({ width: "150", height: "150" });
    }
  };
  return (
    <div className="tool__main">
      <h1 className="tool__main-title">Border Radius Tool</h1>
      <div
        className={`border-radius__tool ${toggleCustomSize || toggleSlides ? "border-radius__tool--mobile" : ""}`}
      >
        <div
          style={squareBorder}
          className={`border-radius__square-border ${!toggleSlides && "border-radius__square-border--manual"}`}
        >
          <div
            style={squareStyle}
            className="border-radius__square"
            ref={squareRef}
          />
          {!toggleSlides && (
            <>
              <div
                className="border-radius__square-drag border-radius__square-drag--green"
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
                className="border-radius__square-drag border-radius__square-drag--red"
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
                className="border-radius__square-drag border-radius__square-drag--blue"
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
                className="border-radius__square-drag border-radius__square-drag--yellow"
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
            className={`border-radius__square-sliders border-radius__square-sliders--size ${toggleSlides && "border-radius__square-sliders--size-mobile"}`}
          >
            {squareSizeInputs.map((input) => (
              <label
                htmlFor={input.id}
                key={input.id}
                className="border-radius__label"
              >
                {input.name} : {input.value}px
                <input
                  type="range"
                  min={50}
                  max={250}
                  id={input.id}
                  value={input.value}
                  onChange={input.onChange}
                  className="border-radius__slide"
                />
              </label>
            ))}
          </div>
        )}
        <button
          className="border-radius__button border-radius__button--size semi-bold"
          onClick={handleCustomSize}
          title="Click to change the size of the square or restore the default size"
          aria-label="Click to change the size of the square or restore the default size"
        >
          {!toggleCustomSize ? "Custom size" : "Default size"}
        </button>
        {toggleSlides && (
          <div
            className={`border-radius__square-sliders border-radius__square-sliders--control ${toggleCustomSize && "border-radius__square-sliders--control-mobile"}`}
          >
            {inputRanges.map((inputRange) => (
              <label
                htmlFor={inputRange.id}
                key={inputRange.id}
                className="border-radius__label"
              >
                {inputRange.name} : {inputRange.value}%
                <input
                  type="range"
                  min={0}
                  max={100}
                  id={inputRange.id}
                  value={inputRange.value}
                  onChange={inputRange.onChange}
                  className="border-radius__slide"
                />
              </label>
            ))}
          </div>
        )}
        <button
          className="border-radius__button border-radius__button--control semi-bold"
          onClick={() => setToggleSlides(!toggleSlides)}
          title="Click to switch between using slides and direct control"
          aria-label="Click to switch between using slides and direct control"
        >
          {!toggleSlides ? "Use Sliders" : "Direct Control"}
        </button>
      </div>
      <div className="border-radius__box">
        <span className="border-radius__value">{`border-radius : ${100 - Number(borderRadius.topRight)}% ${borderRadius.topRight}% ${100 - Number(borderRadius.bottomLeft)}% ${borderRadius.bottomLeft}% / ${borderRadius.topLeft}% ${100 - Number(borderRadius.bottomRight)}% ${borderRadius.bottomRight}% ${100 - Number(borderRadius.topLeft)}%`}</span>
        <Button
          className="border-radius__copy"
          onClick={handleCopyBorderRadius}
          aria-label="Click to copy the CSS border-radius value"
        >
          Copy
        </Button>
      </div>
      <NotificationPopup
        message="Border Radius copied!"
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
      <div className="tool__desc">
        <h2 className="tool__desc-title">Border Radius Tool</h2>

        <h3 className="tool__desc-med-title">Why this tool?</h3>
        <p className="tool__desc-text">
          The <code className="tool__desc-code">border-radius</code> CSS
          property is one of the most widely used tools for giving shape to
          containers by rounding their edges. Usually, this property is applied
          in a simple way, using only one or two values, which creates classic
          rounded shapes. With this tool, however, you can take it a step
          further and create entirely customized and original shapes, adding a
          unique touch to your website&apos;s design.
        </p>

        <h3 className="tool__desc-med-title">How to use the tool</h3>
        <p className="tool__desc-text">
          By default, the central shape is a 150px by 150px square, but you can
          customize its size by clicking on
          <b className="highlight"> “Custom Size”</b> to adjust the width and
          height within a range of 50 to 250px.
        </p>
        <p className="tool__desc-text">
          To modify the radius, click on any corner of the square and drag it to
          increase or decrease the radius value, making it easy to shape each
          corner to your preference. If you prefer more precise control, press
          <b className="highlight"> “Use Sliders”</b> to adjust each corner’s
          radius value individually via a slider.
        </p>

        <p className="tool__desc-nb">
          * CSS property values are displayed below in real time, and you can
          retrieve them easily by clicking the
          <b className="highlight"> “Copy”</b> button.
        </p>
      </div>
    </div>
  );
}
