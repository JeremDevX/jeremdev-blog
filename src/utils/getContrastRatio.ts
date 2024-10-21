export function getContrastRatio(hex1: string, hex2: string): number {
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    let normalizedHex = hex.replace("#", "");

    if (normalizedHex.length === 3) {
      normalizedHex = normalizedHex
        .split("")
        .map((char) => char + char)
        .join("");
    }

    const bigint = parseInt(normalizedHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
  };

  const getLuminance = (r: number, g: number, b: number): number => {
    const RsRGB = r / 255;
    const GsRGB = g / 255;
    const BsRGB = b / 255;

    const rValue =
      RsRGB <= 0.03928 ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    const gValue =
      GsRGB <= 0.03928 ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    const bValue =
      BsRGB <= 0.03928 ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * rValue + 0.7152 * gValue + 0.0722 * bValue;
  };

  const contrastRatio = (
    color1: { r: number; g: number; b: number },
    color2: { r: number; g: number; b: number }
  ): number => {
    const L1 = getLuminance(color1.r, color1.g, color1.b);
    const L2 = getLuminance(color2.r, color2.g, color2.b);

    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);

    return (lighter + 0.05) / (darker + 0.05);
  };

  const color1 = hexToRgb(hex1);
  const color2 = hexToRgb(hex2);

  return contrastRatio(color1, color2);
}
