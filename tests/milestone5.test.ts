import { describe, it, expect } from "vitest";
import { crisisResources, EMERGENCY_NOTE } from "../lib/safety/crisis-resources";

describe("Milestone 5 - Safety route (crisis resources)", () => {
  it("provides a non-empty list of resources", () => {
    expect(crisisResources.length).toBeGreaterThan(0);
  });

  it("every resource has a region, name, and contact", () => {
    for (const r of crisisResources) {
      expect(r.region.trim()).not.toBe("");
      expect(r.name.trim()).not.toBe("");
      expect(r.contact.trim()).not.toBe("");
    }
  });

  it("every href is a tel: or https:// link", () => {
    for (const r of crisisResources) {
      if (r.href) {
        expect(/^(tel:|https:\/\/)/.test(r.href)).toBe(true);
      }
    }
  });

  it("includes an authoritative global directory and an emergency instruction", () => {
    expect(EMERGENCY_NOTE).toMatch(/emergency/i);
    expect(crisisResources.some((r) => /findahelpline/i.test(r.href ?? ""))).toBe(true);
  });
});
