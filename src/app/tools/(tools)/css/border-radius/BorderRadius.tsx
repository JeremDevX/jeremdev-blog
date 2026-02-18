"use client";

import ToolOutput from "@/components/custom/ToolOutput";
import { useState } from "react";
import styles from "./BorderRadius.module.scss";

type BorderRadiusState = {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
};

type SquareSizeState = {
  width: number;
  height: number;
};

export function buildBorderRadiusValue(borderRadius: BorderRadiusState): string {
  return `${100 - borderRadius.topRight}% ${borderRadius.topRight}% ${100 - borderRadius.bottomLeft}% ${borderRadius.bottomLeft}% / ${borderRadius.topLeft}% ${100 - borderRadius.bottomRight}% ${borderRadius.bottomRight}% ${100 - borderRadius.topLeft}%`;
}

export default function BorderRadius() {
  const [squareSize, setSquareSize] = useState<SquareSizeState>({
    width: 150,
    height: 150,
  });
  const [borderRadius, setBorderRadius] = useState<BorderRadiusState>({
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0,
  });
  const [showSizeControls, setShowSizeControls] = useState(false);

  const borderRadiusValue = buildBorderRadiusValue(borderRadius);
  const borderRadiusCssValue = `border-radius: ${borderRadiusValue};`;

  const squareStyle = {
    width: `${squareSize.width}px`,
    height: `${squareSize.height}px`,
    borderRadius: borderRadiusValue,
  };

  const squareSizeInputs: Array<{
    name: string;
    id: keyof SquareSizeState;
    value: number;
  }> = [
    {
      name: "Width",
      id: "width",
      value: squareSize.width,
    },
    {
      name: "Height",
      id: "height",
      value: squareSize.height,
    },
  ];

  const inputRanges: Array<{
    name: string;
    id: keyof BorderRadiusState;
    value: number;
  }> = [
    {
      name: "Top Left",
      id: "topLeft",
      value: borderRadius.topLeft,
    },
    {
      name: "Top Right",
      id: "topRight",
      value: borderRadius.topRight,
    },
    {
      name: "Bottom Right",
      id: "bottomRight",
      value: borderRadius.bottomRight,
    },
    {
      name: "Bottom Left",
      id: "bottomLeft",
      value: borderRadius.bottomLeft,
    },
  ];

  const handleSizeChange = (id: keyof SquareSizeState, value: number) => {
    setSquareSize((previousValue) => ({
      ...previousValue,
      [id]: value,
    }));
  };

  const handleCornerChange = (id: keyof BorderRadiusState, value: number) => {
    setBorderRadius((previousValue) => ({
      ...previousValue,
      [id]: value,
    }));
  };

  const handleCustomSizeToggle = () => {
    setShowSizeControls((previousValue) => !previousValue);
    if (showSizeControls) {
      setSquareSize({ width: 150, height: 150 });
    }
  };

  return (
    <div className="tool__main" data-testid="border-radius-tool">
      <h1 className="tool__main-title">Border Radius Tool</h1>
      <div className={styles.toolLayout}>
        <div className={styles.controls}>
          <section className={styles.controlSection}>
            <h2 className={styles.sectionTitle}>Corner controls</h2>
            {inputRanges.map((inputRange) => (
              <label
                htmlFor={`border-radius-${inputRange.id}`}
                key={inputRange.id}
                className={styles.label}
              >
                {inputRange.name}: {inputRange.value}%
                <input
                  type="range"
                  min={0}
                  max={100}
                  id={`border-radius-${inputRange.id}`}
                  value={inputRange.value}
                  onChange={(event) =>
                    handleCornerChange(inputRange.id, Number(event.target.value))
                  }
                  className={styles.slide}
                />
              </label>
            ))}
          </section>
          {showSizeControls ? (
            <section className={styles.controlSection}>
              <h2 className={styles.sectionTitle}>Square size</h2>
              {squareSizeInputs.map((input) => (
                <label
                  htmlFor={`border-radius-${input.id}`}
                  key={input.id}
                  className={styles.label}
                >
                  {input.name}: {input.value}px
                  <input
                    type="range"
                    min={50}
                    max={250}
                    id={`border-radius-${input.id}`}
                    value={input.value}
                    onChange={(event) =>
                      handleSizeChange(input.id, Number(event.target.value))
                    }
                    className={styles.slide}
                  />
                </label>
              ))}
            </section>
          ) : null}
        </div>
        <div className={styles.previewWrapper}>
          <div style={squareStyle} className={styles.preview} />
        </div>
        <button
          className={`${styles.button} semi-bold`}
          onClick={handleCustomSizeToggle}
          title="Click to change the size of the square or restore the default size"
          aria-label="Click to change the size of the square or restore the default size"
          aria-pressed={showSizeControls}
        >
          {!showSizeControls ? "Custom size" : "Default size"}
        </button>
      </div>
      <ToolOutput className={styles.output} output={borderRadiusCssValue} />
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
