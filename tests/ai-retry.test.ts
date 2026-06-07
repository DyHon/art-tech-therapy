import { describe, it, expect } from "vitest";
import { errorStatus, isRetryableStatus, backoffMs } from "../lib/ai/retry";

describe("AI retry helpers", () => {
  it("extracts a numeric HTTP status from an error-like object", () => {
    expect(errorStatus({ status: 503 })).toBe(503);
    expect(errorStatus({ status: "503" })).toBeUndefined();
    expect(errorStatus(new Error("boom"))).toBeUndefined();
    expect(errorStatus(null)).toBeUndefined();
    expect(errorStatus(undefined)).toBeUndefined();
  });

  it("treats 429/500/503 as retryable and everything else as not", () => {
    expect(isRetryableStatus(429)).toBe(true);
    expect(isRetryableStatus(500)).toBe(true);
    expect(isRetryableStatus(503)).toBe(true);
    expect(isRetryableStatus(404)).toBe(false); // retired model — don't retry
    expect(isRetryableStatus(400)).toBe(false);
    expect(isRetryableStatus(undefined)).toBe(false);
  });

  it("computes exponential backoff", () => {
    expect(backoffMs(1)).toBe(500);
    expect(backoffMs(2)).toBe(1000);
    expect(backoffMs(3)).toBe(2000);
  });
});
