import { describe, expect, test } from "bun:test";
import { getLemonSqueezyUrl } from "./lemonsqueezy";

describe("Lemon Squeezy checkout URLs", () => {
  test("accepts a secure product checkout", () => {
    expect(getLemonSqueezyUrl("https://logicgridlab.lemonsqueezy.com/buy/product-id")).toBe("https://logicgridlab.lemonsqueezy.com/buy/product-id");
  });
  test("missing links cannot open a checkout", () => {
    expect(getLemonSqueezyUrl(null)).toBeNull();
    expect(getLemonSqueezyUrl(" ")).toBeNull();
  });
  test("rejects unsafe protocols and lookalike destinations", () => {
    for (const url of ["javascript:alert(1)", "http://store.lemonsqueezy.com/buy/1", "https://lemonsqueezy.com.evil.example/buy/1", "https://user:password@store.lemonsqueezy.com/buy/1"]) {
      expect(getLemonSqueezyUrl(url)).toBeNull();
    }
  });
});