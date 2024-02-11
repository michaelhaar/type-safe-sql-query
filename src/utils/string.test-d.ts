import { test, describe, expectTypeOf } from "vitest";
import * as String from "./string";

describe("SplitString", () => {
  test("a,b,c", () => {
    type Result = String.Split<"a,b,c", ",">;
    expectTypeOf<Result>().toEqualTypeOf<["a", "b", "c"]>();
  });

  test("a b c", () => {
    type Result = String.Split<"a b c", " ">;
    expectTypeOf<Result>().toEqualTypeOf<["a", "b", "c"]>();
  });
});

describe("ReplaceSubstrings", () => {
  test("a,b,c", () => {
    type Result = String.ReplaceSubstring<"a,b,c", ",", "">;
    expectTypeOf<Result>().toEqualTypeOf<"abc">();
  });

  test(" a b c ", () => {
    type Result = String.ReplaceSubstring<" a b c ", " ", "-">;
    expectTypeOf<Result>().toEqualTypeOf<"-a-b-c-">();
  });
});

describe("ReplaceMultipleSubstrings", () => {
  test("a,b;c", () => {
    type Result = String.ReplaceMultipleSubstrings<"a,b;c", [",", ";"], ["", ""]>;
    expectTypeOf<Result>().toEqualTypeOf<"abc">();
  });

  test("a,b;c", () => {
    type Result = String.ReplaceMultipleSubstrings<"a,b;c", [",", ";"], ["-", ","]>;
    expectTypeOf<Result>().toEqualTypeOf<"a-b,c">();
  });
});
