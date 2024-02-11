import { test, describe, expectTypeOf } from "vitest";
import { ReplaceMultipleSubstrings, ReplaceSubstring, SplitString } from "./string";

describe("SplitString", () => {
  function splitString<I extends string, D extends string>(_input: I, _delimiter: D): SplitString<I, D> {
    return null as any;
  }

  test("a,b,c", () => {
    const result = splitString("a,b,c", ",");
    expectTypeOf(result).toEqualTypeOf<["a", "b", "c"]>();
  });

  test("a b c", () => {
    const result = splitString("a b c", " ");
    expectTypeOf(result).toEqualTypeOf<["a", "b", "c"]>();
  });
});

describe("ReplaceSubstrings", () => {
  function replaceSubstrings<I extends string, S extends string, R extends string>(
    _input: I,
    _search: S,
    _replacement: R,
  ): ReplaceSubstring<I, S, R> {
    return null as any;
  }

  test("a,b,c", () => {
    const result = replaceSubstrings("a,b,c", ",", "");
    expectTypeOf(result).toEqualTypeOf<"abc">();
  });

  test(" a b c ", () => {
    const result = replaceSubstrings(" a b c ", " ", "-");
    expectTypeOf(result).toEqualTypeOf<"-a-b-c-">();
  });
});

describe("ReplaceMultipleSubstrings", () => {
  function replaceMultipleSubstrings<I extends string, S extends string[], R extends string[]>(
    _input: I,
    _search: S,
    _replacements: R,
  ): ReplaceMultipleSubstrings<I, S, R> {
    return null as any;
  }

  test("a,b;c", () => {
    const result = replaceMultipleSubstrings("a,b;c", [",", ";"] as const, ["", ""] as const);
    expectTypeOf(result).toEqualTypeOf<"abc">();
  });

  test("a,b;c", () => {
    const result = replaceMultipleSubstrings("a,b;c", [",", ";"] as const, ["-", ","] as const);
    expectTypeOf(result).toEqualTypeOf<"a-b,c">();
  });
});
