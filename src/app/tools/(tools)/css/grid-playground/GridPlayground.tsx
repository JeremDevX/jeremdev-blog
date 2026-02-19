"use client";

import ToolOutput from "@/components/custom/ToolOutput";
import { useMemo, useState, type CSSProperties } from "react";
import styles from "./GridPlayground.module.scss";

export type GridAxisAlignment = "start" | "end" | "center" | "stretch";
export type GridContentAlignment =
  | "start"
  | "end"
  | "center"
  | "stretch"
  | "space-between"
  | "space-around"
  | "space-evenly";
export type GridAutoFlow = "row" | "column" | "row dense" | "column dense";
export type GridSelfAlignment = "auto" | "start" | "end" | "center" | "stretch";
export type GapMode = "uniform" | "custom";

export type GridContainerConfig = {
  columns: number;
  rows: number;
  minTrackSize: number;
  rowSize: number;
  autoFlow: GridAutoFlow;
  justifyItems: GridAxisAlignment;
  alignItems: GridAxisAlignment;
  justifyContent: GridContentAlignment;
  alignContent: GridContentAlignment;
  width: number;
  height: number;
  padding: number;
  gapMode: GapMode;
  gap: number;
  rowGap: number;
  columnGap: number;
};

export type GridItemConfig = {
  id: number;
  columnStart: number;
  columnSpan: number;
  rowStart: number;
  rowSpan: number;
  justifySelf: GridSelfAlignment;
  alignSelf: GridSelfAlignment;
  order: number;
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

const AUTO_FLOW_OPTIONS: Array<{ label: string; value: GridAutoFlow }> = [
  { label: "row", value: "row" },
  { label: "column", value: "column" },
  { label: "row dense", value: "row dense" },
  { label: "column dense", value: "column dense" },
];

const AXIS_ALIGNMENT_OPTIONS: Array<{
  label: string;
  value: GridAxisAlignment;
}> = [
  { label: "start", value: "start" },
  { label: "end", value: "end" },
  { label: "center", value: "center" },
  { label: "stretch", value: "stretch" },
];

const CONTENT_ALIGNMENT_OPTIONS: Array<{
  label: string;
  value: GridContentAlignment;
}> = [
  { label: "start", value: "start" },
  { label: "end", value: "end" },
  { label: "center", value: "center" },
  { label: "stretch", value: "stretch" },
  { label: "space-between", value: "space-between" },
  { label: "space-around", value: "space-around" },
  { label: "space-evenly", value: "space-evenly" },
];

const SELF_ALIGNMENT_OPTIONS: Array<{ label: string; value: GridSelfAlignment }> =
  [
    { label: "auto", value: "auto" },
    { label: "start", value: "start" },
    { label: "end", value: "end" },
    { label: "center", value: "center" },
    { label: "stretch", value: "stretch" },
  ];

const GAP_MODE_OPTIONS: Array<{ label: string; value: GapMode }> = [
  { label: "Single gap", value: "uniform" },
  { label: "Row / column gap", value: "custom" },
];

const DEFAULT_CONTAINER_CONFIG: GridContainerConfig = {
  columns: 4,
  rows: 4,
  minTrackSize: 96,
  rowSize: 88,
  autoFlow: "row",
  justifyItems: "stretch",
  alignItems: "stretch",
  justifyContent: "stretch",
  alignContent: "stretch",
  width: 680,
  height: 440,
  padding: 14,
  gapMode: "uniform",
  gap: 12,
  rowGap: 12,
  columnGap: 12,
};

const DEFAULT_ITEM_COUNT = 8;

type GridItemMutableKey = Exclude<keyof GridItemConfig, "id">;

function createDefaultItem(id: number, columns = DEFAULT_CONTAINER_CONFIG.columns): GridItemConfig {
  return {
    id,
    columnStart: ((id - 1) % columns) + 1,
    columnSpan: 1,
    rowStart: Math.floor((id - 1) / columns) + 1,
    rowSpan: 1,
    justifySelf: "auto",
    alignSelf: "auto",
    order: 0,
  };
}

function createDefaultItems(count: number, columns = DEFAULT_CONTAINER_CONFIG.columns): GridItemConfig[] {
  return Array.from({ length: count }, (_, index) =>
    createDefaultItem(index + 1, columns),
  );
}

function buildGridTemplateColumns(container: GridContainerConfig): string {
  return `repeat(${container.columns}, minmax(${container.minTrackSize}px, 1fr))`;
}

function buildGridTemplateRows(container: GridContainerConfig): string {
  return `repeat(${container.rows}, ${container.rowSize}px)`;
}

export function buildGridCssOutput(
  container: GridContainerConfig,
  items: GridItemConfig[],
): string {
  const templateColumns = buildGridTemplateColumns(container);
  const templateRows = buildGridTemplateRows(container);
  const gapLines = container.gapMode === "uniform"
    ? [`  gap: ${container.gap}px;`]
    : [
        `  row-gap: ${container.rowGap}px;`,
        `  column-gap: ${container.columnGap}px;`,
        `  gap: ${container.rowGap}px ${container.columnGap}px;`,
      ];

  const containerBlock = [
    ".container {",
    "  display: grid;",
    `  grid-template-columns: ${templateColumns};`,
    `  grid-template-rows: ${templateRows};`,
    `  grid-auto-flow: ${container.autoFlow};`,
    `  grid-auto-rows: ${container.rowSize}px;`,
    `  grid-auto-columns: minmax(${container.minTrackSize}px, 1fr);`,
    `  justify-items: ${container.justifyItems};`,
    `  align-items: ${container.alignItems};`,
    `  justify-content: ${container.justifyContent};`,
    `  align-content: ${container.alignContent};`,
    `  width: ${container.width}px;`,
    `  min-height: ${container.height}px;`,
    `  padding: ${container.padding}px;`,
    ...gapLines,
    "}",
  ];

  const itemBlocks = items.flatMap((item) => [
    "",
    `.item-${item.id} {`,
    `  grid-column: ${item.columnStart} / span ${item.columnSpan};`,
    `  grid-row: ${item.rowStart} / span ${item.rowSpan};`,
    `  justify-self: ${item.justifySelf};`,
    `  align-self: ${item.alignSelf};`,
    `  place-self: ${item.alignSelf} ${item.justifySelf};`,
    `  order: ${item.order};`,
    "}",
  ]);

  return [...containerBlock, ...itemBlocks].join("\n");
}

function buildPreviewItemStyle(item: GridItemConfig): CSSProperties {
  return {
    gridColumn: `${item.columnStart} / span ${item.columnSpan}`,
    gridRow: `${item.rowStart} / span ${item.rowSpan}`,
    justifySelf: item.justifySelf,
    alignSelf: item.alignSelf,
    order: item.order,
  };
}

export default function GridPlayground() {
  const [container, setContainer] = useState<GridContainerConfig>(
    DEFAULT_CONTAINER_CONFIG,
  );
  const [itemCount, setItemCount] = useState(DEFAULT_ITEM_COUNT);
  const [selectedItemId, setSelectedItemId] = useState(1);
  const [items, setItems] = useState<GridItemConfig[]>(() =>
    createDefaultItems(DEFAULT_ITEM_COUNT),
  );

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? items[0];
  const selectedItemIdSafe = selectedItem?.id ?? 1;
  const maxColumnStart = Math.max(1, container.columns);
  const maxRowStart = Math.max(1, container.rows);
  const maxColumnSpan = Math.max(1, container.columns);

  const previewContainerStyle = useMemo<CSSProperties>(() => {
    const style: CSSProperties = {
      display: "grid",
      gridTemplateColumns: buildGridTemplateColumns(container),
      gridTemplateRows: buildGridTemplateRows(container),
      gridAutoFlow: container.autoFlow,
      gridAutoRows: `${container.rowSize}px`,
      gridAutoColumns: `minmax(${container.minTrackSize}px, 1fr)`,
      justifyItems: container.justifyItems,
      alignItems: container.alignItems,
      justifyContent: container.justifyContent,
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
    () => buildGridCssOutput(container, items),
    [container, items],
  );

  const templateColumnsValue = buildGridTemplateColumns(container);
  const templateRowsValue = buildGridTemplateRows(container);

  const updateContainer = <K extends keyof GridContainerConfig>(
    key: K,
    value: GridContainerConfig[K],
  ) => {
    setContainer((previousValue) => ({
      ...previousValue,
      [key]: value,
    }));
  };

  const updateSelectedItem = <K extends GridItemMutableKey>(
    key: K,
    value: GridItemConfig[K],
  ) => {
    setItems((previousItems) =>
      previousItems.map((item) =>
        item.id === selectedItemIdSafe ? { ...item, [key]: value } : item,
      ),
    );
  };

  const handleColumnsChange = (nextColumns: number) => {
    setContainer((previousContainer) => ({
      ...previousContainer,
      columns: nextColumns,
    }));

    setItems((previousItems) =>
      previousItems.map((item) => ({
        ...item,
        columnStart: Math.min(item.columnStart, nextColumns),
        columnSpan: Math.min(item.columnSpan, nextColumns),
      })),
    );
  };

  const handleRowsChange = (nextRows: number) => {
    setContainer((previousContainer) => ({
      ...previousContainer,
      rows: nextRows,
    }));

    setItems((previousItems) =>
      previousItems.map((item) => ({
        ...item,
        rowStart: Math.min(item.rowStart, nextRows),
      })),
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
        appendedItems.push(createDefaultItem(id, container.columns));
      }
      return appendedItems;
    });
  };

  const handleResetContainer = () => {
    setContainer(DEFAULT_CONTAINER_CONFIG);
  };

  const handleResetSelectedItem = () => {
    setItems((previousItems) =>
      previousItems.map((item) =>
        item.id === selectedItemIdSafe
          ? createDefaultItem(item.id, container.columns)
          : item,
      ),
    );
  };

  const handleResetAllItems = () => {
    setItems((previousItems) =>
      previousItems.map((item) => createDefaultItem(item.id, container.columns)),
    );
  };

  const handleApplySelectedToAll = () => {
    if (!selectedItem) {
      return;
    }

    const {
      columnStart,
      columnSpan,
      rowStart,
      rowSpan,
      justifySelf,
      alignSelf,
      order,
    } = selectedItem;

    setItems((previousItems) =>
      previousItems.map((item) => ({
        ...item,
        columnStart,
        columnSpan,
        rowStart,
        rowSpan,
        justifySelf,
        alignSelf,
        order,
      })),
    );
  };

  return (
    <div className={styles.toolMain} data-testid="grid-playground-tool">
      <h1 className={styles.toolMainTitle}>Grid Playground Tool</h1>

      <div className={styles.toolLayout}>
        <section className={styles.previewPanel} aria-label="CSS Grid live preview">
          <div className={styles.previewHeader}>
            <p className={styles.previewMeta}>
              <code>grid-template-columns: {templateColumnsValue};</code>
            </p>
            <p className={styles.previewMeta}>
              <code>grid-template-rows: {templateRowsValue};</code>
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
                  <span className={styles.itemMeta}>
                    c{item.columnStart}/r{item.rowStart}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.controlsPanel} aria-label="CSS Grid controls">
          <div className={styles.controlSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Container properties</h2>
              <p className={styles.sectionNote}>
                Configure tracks, auto-flow, alignment, and gaps.
              </p>
            </div>

            <div className={styles.controlGrid}>
              <label htmlFor="grid-columns" className={styles.control}>
                <span className={styles.controlText}>Columns: {container.columns}</span>
                <input
                  id="grid-columns"
                  className={styles.inputRange}
                  type="range"
                  min={1}
                  max={8}
                  value={container.columns}
                  onChange={(event) => handleColumnsChange(Number(event.target.value))}
                  aria-valuetext={`${container.columns} columns`}
                />
              </label>

              <label htmlFor="grid-rows" className={styles.control}>
                <span className={styles.controlText}>Rows: {container.rows}</span>
                <input
                  id="grid-rows"
                  className={styles.inputRange}
                  type="range"
                  min={1}
                  max={8}
                  value={container.rows}
                  onChange={(event) => handleRowsChange(Number(event.target.value))}
                  aria-valuetext={`${container.rows} rows`}
                />
              </label>

              <label htmlFor="grid-track-size" className={styles.control}>
                <span className={styles.controlText}>
                  Min track width: {container.minTrackSize}px
                </span>
                <input
                  id="grid-track-size"
                  className={styles.inputRange}
                  type="range"
                  min={60}
                  max={220}
                  value={container.minTrackSize}
                  onChange={(event) =>
                    updateContainer("minTrackSize", Number(event.target.value))
                  }
                  aria-valuetext={`${container.minTrackSize} pixels`}
                />
              </label>

              <label htmlFor="grid-row-size" className={styles.control}>
                <span className={styles.controlText}>
                  Row size: {container.rowSize}px
                </span>
                <input
                  id="grid-row-size"
                  className={styles.inputRange}
                  type="range"
                  min={50}
                  max={220}
                  value={container.rowSize}
                  onChange={(event) =>
                    updateContainer("rowSize", Number(event.target.value))
                  }
                  aria-valuetext={`${container.rowSize} pixels`}
                />
              </label>

              <label htmlFor="grid-auto-flow" className={styles.control}>
                <span className={styles.controlText}>Grid auto flow</span>
                <select
                  id="grid-auto-flow"
                  className={styles.selectInput}
                  value={container.autoFlow}
                  onChange={(event) =>
                    updateContainer("autoFlow", event.target.value as GridAutoFlow)
                  }
                >
                  {AUTO_FLOW_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="grid-justify-items" className={styles.control}>
                <span className={styles.controlText}>Justify items</span>
                <select
                  id="grid-justify-items"
                  className={styles.selectInput}
                  value={container.justifyItems}
                  onChange={(event) =>
                    updateContainer(
                      "justifyItems",
                      event.target.value as GridAxisAlignment,
                    )
                  }
                >
                  {AXIS_ALIGNMENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="grid-align-items" className={styles.control}>
                <span className={styles.controlText}>Align items</span>
                <select
                  id="grid-align-items"
                  className={styles.selectInput}
                  value={container.alignItems}
                  onChange={(event) =>
                    updateContainer(
                      "alignItems",
                      event.target.value as GridAxisAlignment,
                    )
                  }
                >
                  {AXIS_ALIGNMENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="grid-justify-content" className={styles.control}>
                <span className={styles.controlText}>Justify content</span>
                <select
                  id="grid-justify-content"
                  className={styles.selectInput}
                  value={container.justifyContent}
                  onChange={(event) =>
                    updateContainer(
                      "justifyContent",
                      event.target.value as GridContentAlignment,
                    )
                  }
                >
                  {CONTENT_ALIGNMENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="grid-align-content" className={styles.control}>
                <span className={styles.controlText}>Align content</span>
                <select
                  id="grid-align-content"
                  className={styles.selectInput}
                  value={container.alignContent}
                  onChange={(event) =>
                    updateContainer(
                      "alignContent",
                      event.target.value as GridContentAlignment,
                    )
                  }
                >
                  {CONTENT_ALIGNMENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="grid-items-count" className={styles.control}>
                <span className={styles.controlText}>Items: {itemCount}</span>
                <input
                  id="grid-items-count"
                  className={styles.inputRange}
                  type="range"
                  min={3}
                  max={12}
                  value={itemCount}
                  onChange={(event) => handleItemCountChange(Number(event.target.value))}
                  aria-valuetext={`${itemCount} items`}
                />
              </label>

              <label htmlFor="grid-container-width" className={styles.control}>
                <span className={styles.controlText}>
                  Container width: {container.width}px
                </span>
                <input
                  id="grid-container-width"
                  className={styles.inputRange}
                  type="range"
                  min={240}
                  max={1000}
                  value={container.width}
                  onChange={(event) =>
                    updateContainer("width", Number(event.target.value))
                  }
                  aria-valuetext={`${container.width} pixels`}
                />
              </label>

              <label htmlFor="grid-container-height" className={styles.control}>
                <span className={styles.controlText}>
                  Container height: {container.height}px
                </span>
                <input
                  id="grid-container-height"
                  className={styles.inputRange}
                  type="range"
                  min={180}
                  max={700}
                  value={container.height}
                  onChange={(event) =>
                    updateContainer("height", Number(event.target.value))
                  }
                  aria-valuetext={`${container.height} pixels`}
                />
              </label>

              <label htmlFor="grid-container-padding" className={styles.control}>
                <span className={styles.controlText}>
                  Container padding: {container.padding}px
                </span>
                <input
                  id="grid-container-padding"
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

              <label htmlFor="grid-gap-mode" className={styles.control}>
                <span className={styles.controlText}>Gap mode</span>
                <select
                  id="grid-gap-mode"
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
                <label htmlFor="grid-gap" className={styles.control}>
                  <span className={styles.controlText}>Gap: {container.gap}px</span>
                  <input
                    id="grid-gap"
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
                  <label htmlFor="grid-row-gap" className={styles.control}>
                    <span className={styles.controlText}>
                      Row gap: {container.rowGap}px
                    </span>
                    <input
                      id="grid-row-gap"
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
                  <label htmlFor="grid-column-gap" className={styles.control}>
                    <span className={styles.controlText}>
                      Column gap: {container.columnGap}px
                    </span>
                    <input
                      id="grid-column-gap"
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
                Select an item and control placement and self-alignment.
              </p>
            </div>

            <div className={styles.itemSelector} role="group" aria-label="Select grid item">
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
              <label htmlFor="grid-column-start" className={styles.control}>
                <span className={styles.controlText}>
                  Column start: {selectedItem?.columnStart ?? 1}
                </span>
                <input
                  id="grid-column-start"
                  className={styles.inputRange}
                  type="range"
                  min={1}
                  max={maxColumnStart}
                  value={selectedItem?.columnStart ?? 1}
                  onChange={(event) =>
                    updateSelectedItem("columnStart", Number(event.target.value))
                  }
                  aria-valuetext={`${selectedItem?.columnStart ?? 1}`}
                />
              </label>

              <label htmlFor="grid-column-span" className={styles.control}>
                <span className={styles.controlText}>
                  Column span: {selectedItem?.columnSpan ?? 1}
                </span>
                <input
                  id="grid-column-span"
                  className={styles.inputRange}
                  type="range"
                  min={1}
                  max={maxColumnSpan}
                  value={selectedItem?.columnSpan ?? 1}
                  onChange={(event) =>
                    updateSelectedItem("columnSpan", Number(event.target.value))
                  }
                  aria-valuetext={`${selectedItem?.columnSpan ?? 1}`}
                />
              </label>

              <label htmlFor="grid-row-start" className={styles.control}>
                <span className={styles.controlText}>
                  Row start: {selectedItem?.rowStart ?? 1}
                </span>
                <input
                  id="grid-row-start"
                  className={styles.inputRange}
                  type="range"
                  min={1}
                  max={maxRowStart}
                  value={selectedItem?.rowStart ?? 1}
                  onChange={(event) =>
                    updateSelectedItem("rowStart", Number(event.target.value))
                  }
                  aria-valuetext={`${selectedItem?.rowStart ?? 1}`}
                />
              </label>

              <label htmlFor="grid-row-span" className={styles.control}>
                <span className={styles.controlText}>
                  Row span: {selectedItem?.rowSpan ?? 1}
                </span>
                <input
                  id="grid-row-span"
                  className={styles.inputRange}
                  type="range"
                  min={1}
                  max={6}
                  value={selectedItem?.rowSpan ?? 1}
                  onChange={(event) =>
                    updateSelectedItem("rowSpan", Number(event.target.value))
                  }
                  aria-valuetext={`${selectedItem?.rowSpan ?? 1}`}
                />
              </label>

              <label htmlFor="grid-justify-self" className={styles.control}>
                <span className={styles.controlText}>Justify self</span>
                <select
                  id="grid-justify-self"
                  className={styles.selectInput}
                  value={selectedItem?.justifySelf ?? "auto"}
                  onChange={(event) =>
                    updateSelectedItem(
                      "justifySelf",
                      event.target.value as GridSelfAlignment,
                    )
                  }
                >
                  {SELF_ALIGNMENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="grid-align-self" className={styles.control}>
                <span className={styles.controlText}>Align self</span>
                <select
                  id="grid-align-self"
                  className={styles.selectInput}
                  value={selectedItem?.alignSelf ?? "auto"}
                  onChange={(event) =>
                    updateSelectedItem(
                      "alignSelf",
                      event.target.value as GridSelfAlignment,
                    )
                  }
                >
                  {SELF_ALIGNMENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="grid-order" className={styles.control}>
                <span className={styles.controlText}>
                  Order: {selectedItem?.order ?? 0}
                </span>
                <input
                  id="grid-order"
                  className={styles.inputRange}
                  type="range"
                  min={-4}
                  max={8}
                  value={selectedItem?.order ?? 0}
                  onChange={(event) =>
                    updateSelectedItem("order", Number(event.target.value))
                  }
                  aria-valuetext={`${selectedItem?.order ?? 0}`}
                />
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
      </div>

      <ToolOutput className={styles.output} output={generatedCss} />

      <div className={styles.description}>
        <h2 className={styles.descriptionTitle}>Grid Playground</h2>
        <h3 className={styles.descriptionMedTitle}>What this tool covers</h3>
        <p className={styles.descriptionText}>
          This playground lets you configure core CSS Grid container properties:
          <code className={styles.descriptionCode}>grid-template-columns</code>,{" "}
          <code className={styles.descriptionCode}>grid-template-rows</code>,{" "}
          <code className={styles.descriptionCode}>grid-auto-flow</code>,{" "}
          <code className={styles.descriptionCode}>grid-auto-rows</code>,{" "}
          <code className={styles.descriptionCode}>grid-auto-columns</code>,{" "}
          <code className={styles.descriptionCode}>justify-items</code>,{" "}
          <code className={styles.descriptionCode}>align-items</code>,{" "}
          <code className={styles.descriptionCode}>justify-content</code>,{" "}
          <code className={styles.descriptionCode}>align-content</code>, and gap
          controls.
        </p>
        <p className={styles.descriptionText}>
          For items, it includes placement and sizing with{" "}
          <code className={styles.descriptionCode}>grid-column</code>,{" "}
          <code className={styles.descriptionCode}>grid-row</code>,{" "}
          <code className={styles.descriptionCode}>justify-self</code>,{" "}
          <code className={styles.descriptionCode}>align-self</code>, plus
          shorthand <code className={styles.descriptionCode}>place-self</code>.
        </p>
        <h3 className={styles.descriptionMedTitle}>How to use it quickly</h3>
        <ul className={styles.list}>
          <li>
            Start with columns, rows, and track sizes to define the grid
            skeleton.
          </li>
          <li>
            Adjust item start/span values to test real placement scenarios.
          </li>
          <li>
            Fine-tune content alignment and copy the generated CSS as your base
            layout.
          </li>
        </ul>
        <p className={styles.descriptionNote}>
          Use implicit tracks and auto-flow to explore responsive reflow before
          hard-coding exact breakpoints.
        </p>
      </div>
    </div>
  );
}
