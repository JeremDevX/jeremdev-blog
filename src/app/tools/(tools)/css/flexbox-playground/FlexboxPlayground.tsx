"use client";

import ToolOutput from "@/components/custom/ToolOutput";
import { useMemo, useState, type CSSProperties } from "react";
import styles from "./FlexboxPlayground.module.scss";

export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
export type JustifyContent =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
export type AlignItems = "stretch" | "flex-start" | "flex-end" | "center" | "baseline";
export type AlignContent =
  | "stretch"
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
export type AlignSelf =
  | "auto"
  | "stretch"
  | "flex-start"
  | "flex-end"
  | "center"
  | "baseline";
export type FlexBasisMode = "auto" | "px" | "percent";
export type GapMode = "uniform" | "custom";

export type FlexContainerConfig = {
  direction: FlexDirection;
  wrap: FlexWrap;
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  alignContent: AlignContent;
  width: number;
  height: number;
  padding: number;
  gapMode: GapMode;
  gap: number;
  rowGap: number;
  columnGap: number;
};

export type FlexItemConfig = {
  id: number;
  order: number;
  grow: number;
  shrink: number;
  basisMode: FlexBasisMode;
  basisValue: number;
  alignSelf: AlignSelf;
};

const ITEM_COLORS = [
  "#0ea5e9",
  "#14b8a6",
  "#22c55e",
  "#84cc16",
  "#eab308",
  "#f97316",
  "#ef4444",
  "#ec4899",
  "#8b5cf6",
  "#6366f1",
  "#3b82f6",
  "#06b6d4",
];

const FLEX_DIRECTION_OPTIONS: Array<{ label: string; value: FlexDirection }> = [
  { label: "row", value: "row" },
  { label: "row-reverse", value: "row-reverse" },
  { label: "column", value: "column" },
  { label: "column-reverse", value: "column-reverse" },
];

const FLEX_WRAP_OPTIONS: Array<{ label: string; value: FlexWrap }> = [
  { label: "nowrap", value: "nowrap" },
  { label: "wrap", value: "wrap" },
  { label: "wrap-reverse", value: "wrap-reverse" },
];

const JUSTIFY_OPTIONS: Array<{ label: string; value: JustifyContent }> = [
  { label: "flex-start", value: "flex-start" },
  { label: "flex-end", value: "flex-end" },
  { label: "center", value: "center" },
  { label: "space-between", value: "space-between" },
  { label: "space-around", value: "space-around" },
  { label: "space-evenly", value: "space-evenly" },
];

const ALIGN_ITEMS_OPTIONS: Array<{ label: string; value: AlignItems }> = [
  { label: "stretch", value: "stretch" },
  { label: "flex-start", value: "flex-start" },
  { label: "flex-end", value: "flex-end" },
  { label: "center", value: "center" },
  { label: "baseline", value: "baseline" },
];

const ALIGN_CONTENT_OPTIONS: Array<{ label: string; value: AlignContent }> = [
  { label: "stretch", value: "stretch" },
  { label: "flex-start", value: "flex-start" },
  { label: "flex-end", value: "flex-end" },
  { label: "center", value: "center" },
  { label: "space-between", value: "space-between" },
  { label: "space-around", value: "space-around" },
  { label: "space-evenly", value: "space-evenly" },
];

const ALIGN_SELF_OPTIONS: Array<{ label: string; value: AlignSelf }> = [
  { label: "auto", value: "auto" },
  { label: "stretch", value: "stretch" },
  { label: "flex-start", value: "flex-start" },
  { label: "flex-end", value: "flex-end" },
  { label: "center", value: "center" },
  { label: "baseline", value: "baseline" },
];

const BASIS_MODE_OPTIONS: Array<{ label: string; value: FlexBasisMode }> = [
  { label: "auto", value: "auto" },
  { label: "px", value: "px" },
  { label: "%", value: "percent" },
];

const GAP_MODE_OPTIONS: Array<{ label: string; value: GapMode }> = [
  { label: "Single gap", value: "uniform" },
  { label: "Row / column gap", value: "custom" },
];

const DEFAULT_CONTAINER_CONFIG: FlexContainerConfig = {
  direction: "row",
  wrap: "wrap",
  justifyContent: "flex-start",
  alignItems: "center",
  alignContent: "stretch",
  width: 640,
  height: 320,
  padding: 14,
  gapMode: "uniform",
  gap: 12,
  rowGap: 12,
  columnGap: 20,
};

const DEFAULT_ITEM_TEMPLATE: Omit<FlexItemConfig, "id"> = {
  order: 0,
  grow: 1,
  shrink: 1,
  basisMode: "px",
  basisValue: 88,
  alignSelf: "auto",
};

const DEFAULT_ITEM_COUNT = 6;

type FlexItemMutableKey = Exclude<keyof FlexItemConfig, "id">;

function createDefaultItem(id: number): FlexItemConfig {
  return { id, ...DEFAULT_ITEM_TEMPLATE };
}

function createDefaultItems(count: number): FlexItemConfig[] {
  return Array.from({ length: count }, (_, index) => createDefaultItem(index + 1));
}

export function resolveFlexBasisValue(mode: FlexBasisMode, value: number): string {
  if (mode === "auto") {
    return "auto";
  }
  if (mode === "percent") {
    return `${value}%`;
  }
  return `${value}px`;
}

export function buildFlexboxCssOutput(
  container: FlexContainerConfig,
  items: FlexItemConfig[],
): string {
  const gapLines = container.gapMode === "uniform"
    ? [`  gap: ${container.gap}px;`]
    : [
        `  row-gap: ${container.rowGap}px;`,
        `  column-gap: ${container.columnGap}px;`,
        `  gap: ${container.rowGap}px ${container.columnGap}px;`,
      ];

  const containerBlock = [
    ".container {",
    "  display: flex;",
    `  flex-direction: ${container.direction};`,
    `  flex-wrap: ${container.wrap};`,
    `  flex-flow: ${container.direction} ${container.wrap};`,
    `  justify-content: ${container.justifyContent};`,
    `  align-items: ${container.alignItems};`,
    `  align-content: ${container.alignContent};`,
    `  width: ${container.width}px;`,
    `  min-height: ${container.height}px;`,
    `  padding: ${container.padding}px;`,
    ...gapLines,
    "}",
  ];

  const itemBlocks = items.flatMap((item) => {
    const basisValue = resolveFlexBasisValue(item.basisMode, item.basisValue);
    const flexShorthand = `${item.grow} ${item.shrink} ${basisValue}`;

    return [
      "",
      `.item-${item.id} {`,
      `  order: ${item.order};`,
      `  flex-grow: ${item.grow};`,
      `  flex-shrink: ${item.shrink};`,
      `  flex-basis: ${basisValue};`,
      `  flex: ${flexShorthand};`,
      `  align-self: ${item.alignSelf};`,
      "}",
    ];
  });

  return [...containerBlock, ...itemBlocks].join("\n");
}

function buildPreviewItemStyle(item: FlexItemConfig): CSSProperties {
  return {
    order: item.order,
    flexGrow: item.grow,
    flexShrink: item.shrink,
    flexBasis: resolveFlexBasisValue(item.basisMode, item.basisValue),
    alignSelf: item.alignSelf,
  };
}

export default function FlexboxPlayground() {
  const [container, setContainer] = useState<FlexContainerConfig>(
    DEFAULT_CONTAINER_CONFIG,
  );
  const [itemCount, setItemCount] = useState(DEFAULT_ITEM_COUNT);
  const [selectedItemId, setSelectedItemId] = useState(1);
  const [items, setItems] = useState<FlexItemConfig[]>(() =>
    createDefaultItems(DEFAULT_ITEM_COUNT),
  );

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? items[0];
  const selectedItemIdSafe = selectedItem?.id ?? 1;

  const previewContainerStyle = useMemo<CSSProperties>(() => {
    const style: CSSProperties = {
      display: "flex",
      flexDirection: container.direction,
      flexWrap: container.wrap,
      justifyContent: container.justifyContent,
      alignItems: container.alignItems,
      alignContent: container.alignContent,
      width: `min(100%, ${container.width}px)`,
      minHeight: `${container.height}px`,
      padding: `${container.padding}px`,
      boxSizing: "border-box",
    };

    if (container.gapMode === "uniform") {
      style.gap = `${container.gap}px`;
    } else {
      style.rowGap = `${container.rowGap}px`;
      style.columnGap = `${container.columnGap}px`;
    }

    return style;
  }, [container]);

  const generatedCss = useMemo(
    () => buildFlexboxCssOutput(container, items),
    [container, items],
  );

  const flexFlowValue = `${container.direction} ${container.wrap}`;
  const selectedItemFlexValue = selectedItem
    ? `${selectedItem.grow} ${selectedItem.shrink} ${resolveFlexBasisValue(
        selectedItem.basisMode,
        selectedItem.basisValue,
      )}`
    : "";

  const basisSliderConfig = selectedItem?.basisMode === "percent"
    ? { min: 10, max: 100, unit: "%" }
    : { min: 40, max: 280, unit: "px" };

  const updateContainer = <K extends keyof FlexContainerConfig>(
    key: K,
    value: FlexContainerConfig[K],
  ) => {
    setContainer((previousValue) => ({
      ...previousValue,
      [key]: value,
    }));
  };

  const updateSelectedItem = <K extends FlexItemMutableKey>(
    key: K,
    value: FlexItemConfig[K],
  ) => {
    setItems((previousItems) =>
      previousItems.map((item) =>
        item.id === selectedItemIdSafe ? { ...item, [key]: value } : item,
      ),
    );
  };

  const handleItemCountChange = (nextCount: number) => {
    setItemCount(nextCount);
    setSelectedItemId((previousValue) => Math.min(previousValue, nextCount));
    setItems((previousItems) => {
      if (nextCount === previousItems.length) {
        return previousItems;
      }

      if (nextCount < previousItems.length) {
        return previousItems.slice(0, nextCount);
      }

      const appendedItems = [...previousItems];
      for (let id = previousItems.length + 1; id <= nextCount; id += 1) {
        appendedItems.push(createDefaultItem(id));
      }
      return appendedItems;
    });
  };

  const handleBasisModeChange = (nextMode: FlexBasisMode) => {
    setItems((previousItems) =>
      previousItems.map((item) => {
        if (item.id !== selectedItemIdSafe) {
          return item;
        }

        if (nextMode === "auto") {
          return { ...item, basisMode: nextMode };
        }

        const max = nextMode === "percent" ? 100 : 280;
        const min = nextMode === "percent" ? 10 : 40;
        const nextBasisValue = Math.min(Math.max(item.basisValue, min), max);

        return {
          ...item,
          basisMode: nextMode,
          basisValue: nextBasisValue,
        };
      }),
    );
  };

  const handleResetContainer = () => {
    setContainer(DEFAULT_CONTAINER_CONFIG);
  };

  const handleResetSelectedItem = () => {
    setItems((previousItems) =>
      previousItems.map((item) =>
        item.id === selectedItemIdSafe ? createDefaultItem(item.id) : item,
      ),
    );
  };

  const handleResetAllItems = () => {
    setItems((previousItems) =>
      previousItems.map((item) => createDefaultItem(item.id)),
    );
  };

  const handleApplySelectedToAll = () => {
    if (!selectedItem) {
      return;
    }

    const { order, grow, shrink, basisMode, basisValue, alignSelf } = selectedItem;

    setItems((previousItems) =>
      previousItems.map((item) => ({
        ...item,
        order,
        grow,
        shrink,
        basisMode,
        basisValue,
        alignSelf,
      })),
    );
  };

  return (
    <div className={styles.toolMain} data-testid="flexbox-playground-tool">
      <h1 className={styles.toolMainTitle}>Flexbox Playground Tool</h1>

      <div className={styles.toolLayout}>
        <section className={styles.controlsPanel} aria-label="Flexbox controls">
          <div className={styles.controlSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Container properties</h2>
              <p className={styles.sectionNote}>
                Control <code>flex-flow</code>, alignment, and spacing.
              </p>
            </div>
            <div className={styles.controlGrid}>
              <label htmlFor="flex-direction" className={styles.control}>
                <span className={styles.controlText}>Flex direction</span>
                <select
                  id="flex-direction"
                  className={styles.selectInput}
                  value={container.direction}
                  onChange={(event) =>
                    updateContainer("direction", event.target.value as FlexDirection)
                  }
                >
                  {FLEX_DIRECTION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="flex-wrap" className={styles.control}>
                <span className={styles.controlText}>Flex wrap</span>
                <select
                  id="flex-wrap"
                  className={styles.selectInput}
                  value={container.wrap}
                  onChange={(event) =>
                    updateContainer("wrap", event.target.value as FlexWrap)
                  }
                >
                  {FLEX_WRAP_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="justify-content" className={styles.control}>
                <span className={styles.controlText}>Justify content</span>
                <select
                  id="justify-content"
                  className={styles.selectInput}
                  value={container.justifyContent}
                  onChange={(event) =>
                    updateContainer(
                      "justifyContent",
                      event.target.value as JustifyContent,
                    )
                  }
                >
                  {JUSTIFY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="align-items" className={styles.control}>
                <span className={styles.controlText}>Align items</span>
                <select
                  id="align-items"
                  className={styles.selectInput}
                  value={container.alignItems}
                  onChange={(event) =>
                    updateContainer("alignItems", event.target.value as AlignItems)
                  }
                >
                  {ALIGN_ITEMS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="align-content" className={styles.control}>
                <span className={styles.controlText}>Align content</span>
                <select
                  id="align-content"
                  className={styles.selectInput}
                  value={container.alignContent}
                  onChange={(event) =>
                    updateContainer(
                      "alignContent",
                      event.target.value as AlignContent,
                    )
                  }
                >
                  {ALIGN_CONTENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="item-count" className={styles.control}>
                <span className={styles.controlText}>Items: {itemCount}</span>
                <input
                  id="item-count"
                  className={styles.inputRange}
                  type="range"
                  min={3}
                  max={12}
                  value={itemCount}
                  onChange={(event) => handleItemCountChange(Number(event.target.value))}
                  aria-valuetext={`${itemCount} items`}
                />
              </label>

              <label htmlFor="container-width" className={styles.control}>
                <span className={styles.controlText}>Container width: {container.width}px</span>
                <input
                  id="container-width"
                  className={styles.inputRange}
                  type="range"
                  min={220}
                  max={900}
                  value={container.width}
                  onChange={(event) =>
                    updateContainer("width", Number(event.target.value))
                  }
                  aria-valuetext={`${container.width} pixels`}
                />
              </label>

              <label htmlFor="container-height" className={styles.control}>
                <span className={styles.controlText}>
                  Container height: {container.height}px
                </span>
                <input
                  id="container-height"
                  className={styles.inputRange}
                  type="range"
                  min={180}
                  max={560}
                  value={container.height}
                  onChange={(event) =>
                    updateContainer("height", Number(event.target.value))
                  }
                  aria-valuetext={`${container.height} pixels`}
                />
              </label>

              <label htmlFor="container-padding" className={styles.control}>
                <span className={styles.controlText}>
                  Container padding: {container.padding}px
                </span>
                <input
                  id="container-padding"
                  className={styles.inputRange}
                  type="range"
                  min={0}
                  max={40}
                  value={container.padding}
                  onChange={(event) =>
                    updateContainer("padding", Number(event.target.value))
                  }
                  aria-valuetext={`${container.padding} pixels`}
                />
              </label>

              <label htmlFor="gap-mode" className={styles.control}>
                <span className={styles.controlText}>Gap mode</span>
                <select
                  id="gap-mode"
                  className={styles.selectInput}
                  value={container.gapMode}
                  onChange={(event) =>
                    updateContainer("gapMode", event.target.value as GapMode)
                  }
                >
                  {GAP_MODE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {container.gapMode === "uniform" ? (
                <label htmlFor="gap" className={styles.control}>
                  <span className={styles.controlText}>Gap: {container.gap}px</span>
                  <input
                    id="gap"
                    className={styles.inputRange}
                    type="range"
                    min={0}
                    max={48}
                    value={container.gap}
                    onChange={(event) =>
                      updateContainer("gap", Number(event.target.value))
                    }
                    aria-valuetext={`${container.gap} pixels`}
                  />
                </label>
              ) : (
                <>
                  <label htmlFor="row-gap" className={styles.control}>
                    <span className={styles.controlText}>Row gap: {container.rowGap}px</span>
                    <input
                      id="row-gap"
                      className={styles.inputRange}
                      type="range"
                      min={0}
                      max={48}
                      value={container.rowGap}
                      onChange={(event) =>
                        updateContainer("rowGap", Number(event.target.value))
                      }
                      aria-valuetext={`${container.rowGap} pixels`}
                    />
                  </label>
                  <label htmlFor="column-gap" className={styles.control}>
                    <span className={styles.controlText}>
                      Column gap: {container.columnGap}px
                    </span>
                    <input
                      id="column-gap"
                      className={styles.inputRange}
                      type="range"
                      min={0}
                      max={48}
                      value={container.columnGap}
                      onChange={(event) =>
                        updateContainer("columnGap", Number(event.target.value))
                      }
                      aria-valuetext={`${container.columnGap} pixels`}
                    />
                  </label>
                </>
              )}
            </div>

            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.button}
                onClick={handleResetContainer}
              >
                Reset container
              </button>
            </div>
          </div>

          <div className={styles.controlSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Item properties</h2>
              <p className={styles.sectionNote}>
                Select an item and configure <code>order</code>, <code>flex</code>, and{" "}
                <code>align-self</code>.
              </p>
            </div>

            <div className={styles.itemSelector} role="group" aria-label="Select flex item">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    item.id === selectedItemIdSafe
                      ? `${styles.itemButton} ${styles.itemButtonActive}`
                      : styles.itemButton
                  }
                  onClick={() => setSelectedItemId(item.id)}
                  aria-pressed={item.id === selectedItemIdSafe}
                >
                  Item {item.id}
                </button>
              ))}
            </div>

            <div className={styles.controlGrid}>
              <label htmlFor="item-order" className={styles.control}>
                <span className={styles.controlText}>
                  Order: {selectedItem?.order ?? DEFAULT_ITEM_TEMPLATE.order}
                </span>
                <input
                  id="item-order"
                  className={styles.inputRange}
                  type="range"
                  min={-4}
                  max={12}
                  value={selectedItem?.order ?? DEFAULT_ITEM_TEMPLATE.order}
                  onChange={(event) =>
                    updateSelectedItem("order", Number(event.target.value))
                  }
                  aria-valuetext={`Order ${selectedItem?.order ?? DEFAULT_ITEM_TEMPLATE.order}`}
                />
              </label>

              <label htmlFor="item-grow" className={styles.control}>
                <span className={styles.controlText}>
                  Flex grow: {selectedItem?.grow ?? DEFAULT_ITEM_TEMPLATE.grow}
                </span>
                <input
                  id="item-grow"
                  className={styles.inputRange}
                  type="range"
                  min={0}
                  max={6}
                  value={selectedItem?.grow ?? DEFAULT_ITEM_TEMPLATE.grow}
                  onChange={(event) =>
                    updateSelectedItem("grow", Number(event.target.value))
                  }
                  aria-valuetext={`${selectedItem?.grow ?? DEFAULT_ITEM_TEMPLATE.grow}`}
                />
              </label>

              <label htmlFor="item-shrink" className={styles.control}>
                <span className={styles.controlText}>
                  Flex shrink: {selectedItem?.shrink ?? DEFAULT_ITEM_TEMPLATE.shrink}
                </span>
                <input
                  id="item-shrink"
                  className={styles.inputRange}
                  type="range"
                  min={0}
                  max={6}
                  value={selectedItem?.shrink ?? DEFAULT_ITEM_TEMPLATE.shrink}
                  onChange={(event) =>
                    updateSelectedItem("shrink", Number(event.target.value))
                  }
                  aria-valuetext={`${selectedItem?.shrink ?? DEFAULT_ITEM_TEMPLATE.shrink}`}
                />
              </label>

              <label htmlFor="item-basis-mode" className={styles.control}>
                <span className={styles.controlText}>Flex basis mode</span>
                <select
                  id="item-basis-mode"
                  className={styles.selectInput}
                  value={selectedItem?.basisMode ?? DEFAULT_ITEM_TEMPLATE.basisMode}
                  onChange={(event) =>
                    handleBasisModeChange(event.target.value as FlexBasisMode)
                  }
                >
                  {BASIS_MODE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {selectedItem?.basisMode !== "auto" ? (
                <label htmlFor="item-basis-value" className={styles.control}>
                  <span className={styles.controlText}>
                    Flex basis: {selectedItem?.basisValue ?? DEFAULT_ITEM_TEMPLATE.basisValue}
                    {basisSliderConfig.unit}
                  </span>
                  <input
                    id="item-basis-value"
                    className={styles.inputRange}
                    type="range"
                    min={basisSliderConfig.min}
                    max={basisSliderConfig.max}
                    value={selectedItem?.basisValue ?? DEFAULT_ITEM_TEMPLATE.basisValue}
                    onChange={(event) =>
                      updateSelectedItem("basisValue", Number(event.target.value))
                    }
                    aria-valuetext={`${selectedItem?.basisValue ?? DEFAULT_ITEM_TEMPLATE.basisValue}${basisSliderConfig.unit}`}
                  />
                </label>
              ) : null}

              <label htmlFor="item-align-self" className={styles.control}>
                <span className={styles.controlText}>Align self</span>
                <select
                  id="item-align-self"
                  className={styles.selectInput}
                  value={selectedItem?.alignSelf ?? DEFAULT_ITEM_TEMPLATE.alignSelf}
                  onChange={(event) =>
                    updateSelectedItem("alignSelf", event.target.value as AlignSelf)
                  }
                >
                  {ALIGN_SELF_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.button}
                onClick={handleApplySelectedToAll}
              >
                Apply selected item to all
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonGhost}`}
                onClick={handleResetSelectedItem}
              >
                Reset selected item
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonGhost}`}
                onClick={handleResetAllItems}
              >
                Reset all items
              </button>
            </div>
          </div>
        </section>

        <section className={styles.previewPanel} aria-label="Flexbox live preview">
          <div className={styles.previewHeader}>
            <p className={styles.previewMeta}>
              <code>flex-flow: {flexFlowValue};</code>
            </p>
            <p className={styles.previewMeta}>
              <code>
                item {selectedItemIdSafe} flex: {selectedItemFlexValue};
              </code>
            </p>
          </div>

          <div className={styles.previewStage}>
            <div className={styles.previewFrame} style={previewContainerStyle}>
              {items.map((item) => (
                <div
                  key={item.id}
                  className={
                    item.id === selectedItemIdSafe
                      ? `${styles.previewItem} ${styles.previewItemSelected}`
                      : styles.previewItem
                  }
                  style={{
                    ...buildPreviewItemStyle(item),
                    backgroundColor: ITEM_COLORS[(item.id - 1) % ITEM_COLORS.length],
                  }}
                >
                  <span className={styles.itemLabel}>#{item.id}</span>
                  <span className={styles.itemMeta}>o:{item.order}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <ToolOutput className={styles.output} output={generatedCss} />

      <div className={styles.description}>
        <h2 className={styles.descriptionTitle}>Flexbox Playground</h2>
        <h3 className={styles.descriptionMedTitle}>What this tool covers</h3>
        <p className={styles.descriptionText}>
          This simulator lets you explore the complete Flexbox workflow:
          container properties (<code className={styles.descriptionCode}>flex-direction</code>,{" "}
          <code className={styles.descriptionCode}>flex-wrap</code>,{" "}
          <code className={styles.descriptionCode}>justify-content</code>,{" "}
          <code className={styles.descriptionCode}>align-items</code>,{" "}
          <code className={styles.descriptionCode}>align-content</code>,{" "}
          <code className={styles.descriptionCode}>gap</code>,{" "}
          <code className={styles.descriptionCode}>row-gap</code>,{" "}
          <code className={styles.descriptionCode}>column-gap</code>) and item
          properties (<code className={styles.descriptionCode}>order</code>,{" "}
          <code className={styles.descriptionCode}>flex-grow</code>,{" "}
          <code className={styles.descriptionCode}>flex-shrink</code>,{" "}
          <code className={styles.descriptionCode}>flex-basis</code>,{" "}
          <code className={styles.descriptionCode}>align-self</code>).
        </p>
        <p className={styles.descriptionText}>
          The output also includes the shorthand forms{" "}
          <code className={styles.descriptionCode}>flex-flow</code> and{" "}
          <code className={styles.descriptionCode}>flex</code> so you can copy
          production-ready CSS directly.
        </p>
        <h3 className={styles.descriptionMedTitle}>How to use it quickly</h3>
        <ul className={styles.list}>
          <li>
            Start with direction + wrap, then adjust{" "}
            <code className={styles.descriptionCode}>justify-content</code> to
            compare spacing patterns like <b>space-between</b> and{" "}
            <b>space-evenly</b>.
          </li>
          <li>
            Select a specific item, tweak its flex settings, then apply it to
            all items if you want a consistent pattern.
          </li>
          <li>
            Increase item count and container size to observe multi-line
            behavior and cross-axis distribution.
          </li>
        </ul>
        <p className={styles.descriptionNote}>
          Flexbox behavior depends on available space. Use width, height, item
          count, and basis values together for realistic testing.
        </p>
      </div>
    </div>
  );
}
