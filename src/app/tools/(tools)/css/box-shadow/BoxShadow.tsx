"use client";

import ToolOutput from "@/components/custom/ToolOutput";
import { useState } from "react";
import styles from "./BoxShadow.module.scss";

type BoxShadowState = {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
};

export function buildBoxShadowValue({
  offsetX,
  offsetY,
  blur,
  spread,
  color,
  inset,
}: BoxShadowState): string {
  return `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}${inset ? " inset" : ""}`;
}

export default function BoxShadow() {
  const [offsetX, setOffsetX] = useState(5);
  const [offsetY, setOffsetY] = useState(5);
  const [spread, setSpread] = useState(5);
  const [blur, setBlur] = useState(5);
  const [shapeColor, setShapeColor] = useState("#115097");
  const [shadowColor, setShadowColor] = useState("#FFFFFF");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [insetShadow, setInsetShadow] = useState(true);
  const boxShadowValue = buildBoxShadowValue({
    offsetX,
    offsetY,
    blur,
    spread,
    color: shadowColor,
    inset: insetShadow,
  });

  const inputRange = [
    {
      name: "Offset X",
      id: "offsetX",
      min: -25,
      max: 25,
      value: offsetX,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setOffsetX(Number(e.target.value)),
    },
    {
      name: "Offset Y",
      id: "offsetY",
      min: -25,
      max: 25,
      value: offsetY,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setOffsetY(Number(e.target.value)),
    },
    {
      name: "Blur",
      id: "blur",
      min: 0,
      max: 32,
      value: blur,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setBlur(Number(e.target.value)),
    },
    {
      name: "Spread",
      id: "spread",
      min: 0,
      max: 32,
      value: spread,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setSpread(Number(e.target.value)),
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

  return (
    <div className={styles.toolMain} data-testid="box-shadow-tool">
      <h1 className={styles.toolMainTitle}>Box Shadow Tool</h1>
      <div className={styles.container}>
        <div className={styles.inputs}>
          <div className={styles.slides}>
            {inputRange.map((input) => (
              <label key={input.id} htmlFor={input.id} className={styles.label}>
                {input.name} : {input.value}px
                <input
                  type="range"
                  id={input.id}
                  min={input.min}
                  max={input.max}
                  value={input.value}
                  onChange={input.onChange}
                  className={styles.input}
                  aria-valuetext={`${input.name} ${input.value} pixels`}
                />
              </label>
            ))}
            {inputColor.map((input) => (
              <label htmlFor={input.id} key={input.id} className={styles.label}>
                {input.name} :
                <input
                  type="color"
                  id={input.id}
                  value={input.value}
                  onChange={input.onChange}
                  className={styles.input}
                />
              </label>
            ))}
            <label htmlFor="inset" className={styles.label}>
              Inset :
              <span className={styles.input}>
                <input
                  type="checkbox"
                  id="inset"
                  checked={insetShadow}
                  onChange={(e) => {
                    setInsetShadow(e.target.checked);
                  }}
                  className={`${styles.input} ${styles.checkbox}`}
                />
              </span>
            </label>
          </div>
        </div>
        <div
          className={styles.previewContainer}
          style={{ backgroundColor: `${backgroundColor}` }}
        >
          <div
            className={styles.previewShape}
            style={{
              boxShadow: boxShadowValue,
              backgroundColor: `${shapeColor}`,
            }}
          />
        </div>
      </div>
      <ToolOutput
        className={styles.output}
        output={`box-shadow: ${boxShadowValue};`}
      />
      <div className={styles.description}>
        <h2 className={styles.descriptionTitle}>Box Shadow Tool</h2>
        <h3 className={styles.descriptionMedTitle}>Why this tool?</h3>
        <p className={styles.descriptionText}>
          This generator helps you craft a CSS{" "}
          <code className={styles.descriptionCode}>box-shadow</code> value
          visually. You can test depth and readability quickly, then copy
          production-ready CSS in one click.
        </p>
        <h3 className={styles.descriptionMedTitle}>How to use it</h3>
        <p className={styles.descriptionText}>
          Start with geometry controls ({`Offset X`}, {`Offset Y`},{" "}
          {`Blur`}, and {`Spread`}), then choose shape, shadow, and background
          colors. Toggle <code className={styles.descriptionCode}>Inset</code>{" "}
          to switch between an external shadow and an inner shadow. The preview
          updates instantly as you adjust values.
        </p>
        <h3 className={styles.descriptionMedTitle}>Quick tips</h3>
        <ul className={styles.list}>
          <li>
            <code className={styles.descriptionCode}>Blur</code> controls edge
            softness.
          </li>
          <li>
            <code className={styles.descriptionCode}>Spread</code> controls how
            large the shadow grows before blur.
          </li>
          <li>
            Negative offsets move the shadow up/left, positive offsets move it
            down/right.
          </li>
          <li>
            Use <code className={styles.descriptionCode}>Inset</code> for
            pressed or carved effects.
          </li>
        </ul>
        <p className={styles.descriptionNote}>
          No perfect shadow exists in isolation: always validate with your real
          background and nearby UI elements.
        </p>
      </div>
    </div>
  );
}
