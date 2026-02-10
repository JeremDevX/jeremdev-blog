"use client";

import Button from "@/components/custom/Button";
import NotificationPopup from "@/components/custom/CopyPopup";
import { handleCopy } from "@/utils/handleCopy";
import { useRef, useState } from "react";

export default function BoxSahdow() {
  const [horizontalPosition, setHorizontalPosition] = useState("5");
  const [verticalPosition, setVerticalPosition] = useState("5");
  const [spread, setSpread] = useState("5");
  const [blur, setBlur] = useState("5");
  const [shapeColor, setShapeColor] = useState("#115097");
  const [shadowColor, setShadowColor] = useState("#FFFFFF");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [insetShadow, setInsetShadow] = useState(true);
  const shapeRef = useRef<HTMLDivElement | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [failedToCopy, setFailedToCopy] = useState(false);

  const inputRange = [
    {
      name: "Offset X",
      id: "offsetX",
      min: -25,
      max: 25,
      value: horizontalPosition,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setHorizontalPosition(e.target.value),
    },
    {
      name: "Offset Y",
      id: "offsetY",
      min: -25,
      max: 25,
      value: verticalPosition,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setVerticalPosition(e.target.value),
    },
    {
      name: "Blur",
      id: "blur",
      min: 0,
      max: 32,
      value: blur,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setBlur(e.target.value),
    },
    {
      name: "Spread",
      id: "spread",
      min: 0,
      max: 32,
      value: spread,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setSpread(e.target.value),
    },
  ];

  const inputColor = [
    {
      name: "Shape",
      id: "shapeColor",
      value: shapeColor,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setShapeColor(e.target.value),
    },
    {
      name: "Shadow",
      id: "shadowColor",
      value: shadowColor,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setShadowColor(e.target.value),
    },
    {
      name: "Background",
      id: "backgroundColor",
      value: backgroundColor,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setBackgroundColor(e.target.value),
    },
  ];

  const handleCopyBoxShadow = () => {
    handleCopy({
      ref: shapeRef,
      getValue: (ref) =>
        `box-shadow: ${(ref.current as HTMLElement).style.boxShadow};`,
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
      <h1 className="tool__main-title">Box Shadow Tool</h1>
      <div className="box-shadow">
        <div className="box-shadow__inputs">
          <div className="box-shadow__slides">
            {inputRange.map((input) => (
              <label
                key={input.id}
                htmlFor={input.id}
                className="box-shadow__label"
              >
                {input.name} : {input.value}px
                <input
                  type="range"
                  id={input.id}
                  min={input.min}
                  max={input.max}
                  value={input.value}
                  onChange={input.onChange}
                  className="box-shadow__input"
                />
              </label>
            ))}
            {inputColor.map((input) => (
              <label
                htmlFor={input.id}
                key={input.id}
                className="box-shadow__label"
              >
                {input.name} :
                <input
                  type="color"
                  id={input.id}
                  value={input.value}
                  onChange={input.onChange}
                  className="box-shadow__input"
                />
              </label>
            ))}
            <label htmlFor="inset" className="box-shadow__label">
              Inset :
              <span className="box-shadow__input">
                <input
                  type="checkbox"
                  id="inset"
                  onChange={(e) => {
                    setInsetShadow(e.target.checked);
                  }}
                  className="box-shadow__input box-shadow__input--checkbox"
                />
              </span>
            </label>
          </div>
          <div className="box-shadow__colors"></div>
        </div>
        <div
          className="box-shadow__container"
          style={{ backgroundColor: `${backgroundColor}` }}
        >
          <div
            className="box-shadow__shape"
            style={{
              boxShadow: `${horizontalPosition}px ${verticalPosition}px ${blur}px ${spread}px ${shadowColor} ${insetShadow ? "inset" : ""}`,
              backgroundColor: `${shapeColor}`,
            }}
            ref={shapeRef}
          ></div>
        </div>
      </div>
      <div className="box-shadow__values">
        <span className="box-shadow__css">
          box-shadow : {shadowColor} {horizontalPosition}px {verticalPosition}px{" "}
          {blur}px {spread}px {insetShadow ? "inset" : ""}
        </span>
        <Button onClick={handleCopyBoxShadow}>Copy</Button>
      </div>
      <NotificationPopup
        message="Box Shadow copied!"
        isVisible={isCopied}
        onClose={() => setIsCopied(false)}
        duration={2000}
        className="copy-success"
      />
      <NotificationPopup
        message="An error occured."
        isVisible={failedToCopy}
        onClose={() => setFailedToCopy(false)}
        duration={2000}
        className="copy-error"
      />
      <div className="tool__desc">
        <h2 className="tool__desc-title">box shadow</h2>
        <h3 className="tool__desc-med-title">Why this tool</h3>
        <p className="tool__desc-text">Sample text</p>
      </div>
    </div>
  );
}
