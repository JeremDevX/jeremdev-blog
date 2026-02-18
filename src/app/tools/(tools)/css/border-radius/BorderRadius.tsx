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
    <div className={styles.toolMain} data-testid="border-radius-tool">
      <h1 className={styles.toolMainTitle}>Border Radius Tool</h1>
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
          className={`${styles.button} ${styles.semiBold}`}
          onClick={handleCustomSizeToggle}
          title="Click to change the size of the square or restore the default size"
          aria-label="Click to change the size of the square or restore the default size"
          aria-pressed={showSizeControls}
        >
          {!showSizeControls ? "Custom size" : "Default size"}
        </button>
      </div>
      <ToolOutput className={styles.output} output={borderRadiusCssValue} />
      <div className={styles.description}>
        <h2 className={styles.descriptionTitle}>Border Radius Tool</h2>

        <h3 className={styles.descriptionMedTitle}>Why this tool?</h3>
        <p className={styles.descriptionText}>
          The <code className={styles.descriptionCode}>border-radius</code> CSS
          property is one of the most widely used tools for giving shape to
          containers by rounding their edges. Usually, this property is applied
          in a simple way, using only one or two values, which creates classic
          rounded shapes. With this tool, however, you can take it a step
          further and create entirely customized and original shapes, adding a
          unique touch to your website&apos;s design.
        </p>

        <h3 className={styles.descriptionMedTitle}>How to use the tool</h3>
        <p className={styles.descriptionText}>
          By default, the preview shape is a 150px by 150px square. Click{" "}
          <b className={styles.highlight}>“Custom size”</b> to reveal width and
          height sliders and adapt the preview between 50px and 250px.
        </p>
        <p className={styles.descriptionText}>
          Use the four corner sliders to control each corner independently from
          0% to 100%. The preview and generated CSS update in real time, so you
          can iterate fast and copy the exact value when the shape matches your
          design.
        </p>

        <p className={styles.descriptionNote}>
          * Generated values use full{" "}
          <code className={styles.descriptionCode}>border-radius</code>{" "}
          shorthand, useful for organic shapes beyond simple rounded corners.
        </p>
      </div>
    </div>
  );
}
