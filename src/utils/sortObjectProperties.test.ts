import { describe, it, expect } from "vitest";
import { sortObjectProperties } from "./sortObjectProperties";
describe("sortObjectProperties", () => {
  it("should sort object properties", () => {
    const obj = {
      b: 2,
      a: 1,
      c: 3,
    };
    const sorted = sortObjectProperties(obj);
    expect(sorted).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });
});
