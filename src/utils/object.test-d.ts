import { test, describe, expectTypeOf } from "vitest";
import * as Object from "./object";

describe("Overwrite", () => {
  test("should overwrite object keys", () => {
    type Result = Object.Overwrite<{ a: string; b: number; c: boolean }, { a: number; c: string }>;
    expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: number; c: string }>();
  });
});

describe("ExpandRecursively", () => {
  test("should not change the type", () => {
    type Result = Object.ExpandRecursively<{ a: { b: { c: string } } }>;
    expectTypeOf<Result>().toEqualTypeOf<{ a: { b: { c: string } } }>();
  });
});
