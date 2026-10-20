import { describe, it as test } from "node:test";
import { strict as assert } from "node:assert";
import { getLemonSqueezyUrl } from "./lemonsqueezy";

describe("Lemon Squeezy checkout URLs", () => {
  test("accepts a secure product checkout", () => {
    assert.equal(getLemonSqueezyUrl("https://logicgridlab.lemonsqueezy.com/buy/product-id"), "https://logicgridlab.lemonsqueezy.com/buy/product-id");
  });
  test("missing links cannot open a checkout", () => {
    assert.equal(getLemonSqueezyUrl(null), null);
    assert.equal(getLemonSqueezyUrl(" "), null);
  });
  test("rejects unsafe protocols and lookalike destinations", () => {
    for (const url of ["javascript:alert(1)", "http://store.lemonsqueezy.com/buy/1", "https://lemonsqueezy.com.evil.example/buy/1", "https://user:password@store.lemonsqueezy.com/buy/1"]) {
      assert.equal(getLemonSqueezyUrl(url), null);
    }
  });
});