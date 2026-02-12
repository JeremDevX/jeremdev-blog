import { describe, it, expect } from "vitest";
import { formatDate } from "@/lib/utils";

describe("formatDate", () => {
  it("formats ISO date string to en-US long format", () => {
    expect(formatDate("2026-02-11")).toBe("February 11, 2026");
  });

  it("formats another date correctly", () => {
    expect(formatDate("2025-12-25")).toBe("December 25, 2025");
  });

  it("handles ISO date-time strings", () => {
    expect(formatDate("2026-01-01T00:00:00Z")).toBe("January 1, 2026");
  });
});
