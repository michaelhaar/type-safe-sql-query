import { test, describe, expectTypeOf } from "vitest";
import * as Array from "./array";

describe("GetSliceAfterFirstMatch", () => {
  test('["a", "b", "c", "d"], "a"', () => {
    type Result = Array.GetSliceAfterFirstMatch<["a", "b", "c", "d"], "a">;
    expectTypeOf<Result>().toEqualTypeOf<["b", "c", "d"]>();
  });

  test('["a", "b", "c", "d"], "b" | "c"', () => {
    type Result = Array.GetSliceAfterFirstMatch<["a", "b", "c", "d"], "b" | "c">;
    expectTypeOf<Result>().toEqualTypeOf<["c", "d"]>();
  });

  test('["a", "b", "c", "d"], "d"', () => {
    type Result = Array.GetSliceAfterFirstMatch<["a", "b", "c", "d"], "d">;
    expectTypeOf<Result>().toEqualTypeOf<[]>();
  });

  test('["a", "b", "c", "d"], "e"', () => {
    type Result = Array.GetSliceAfterFirstMatch<["a", "b", "c", "d"], "e">;
    expectTypeOf<Result>().toEqualTypeOf<[]>();
  });
});

describe("GetSliceFromFirstMatch", () => {
  test('["a", "b", "c", "d"], "b" | "c"', () => {
    type Result = Array.GetSliceFromFirstMatch<["a", "b", "c", "d"], "b" | "c">;
    expectTypeOf<Result>().toEqualTypeOf<["b", "c", "d"]>();
  });

  test('["a", "b", "c", "d"], "e"', () => {
    type Result = Array.GetSliceFromFirstMatch<["a", "b", "c", "d"], "e">;
    expectTypeOf<Result>().toEqualTypeOf<[]>();
  });
});

describe("GetSliceFromFirstNonMatch", () => {
  test('["a", "b", "c", "d"], "a"', () => {
    type Result = Array.GetSliceFromFirstNonMatch<["a", "b", "c", "d"], "a">;
    expectTypeOf<Result>().toEqualTypeOf<["b", "c", "d"]>();
  });

  test('["a", "b", "c", "d"], "a" | "b"', () => {
    type Result = Array.GetSliceFromFirstNonMatch<["a", "b", "c", "d"], "a" | "b">;
    expectTypeOf<Result>().toEqualTypeOf<["c", "d"]>();
  });
});

describe("GetSliceBeforeFirstMatch", () => {
  test('["a", "b", "c", "d"], "a"', () => {
    type Result = Array.GetSliceBeforeFirstMatch<["a", "b", "c", "d"], "a">;
    expectTypeOf<Result>().toEqualTypeOf<[]>();
  });

  test('["a", "b", "c", "d"], "c" | "d"', () => {
    type Result = Array.GetSliceBeforeFirstMatch<["a", "b", "c", "d"], "c" | "d">;
    expectTypeOf<Result>().toEqualTypeOf<["a", "b"]>();
  });

  test('["a", "b", "c", "d"], "e"', () => {
    type Result = Array.GetSliceBeforeFirstMatch<["a", "b", "c", "d"], "e">;
    expectTypeOf<Result>().toEqualTypeOf<["a", "b", "c", "d"]>();
  });
});

describe("GetSliceBetween", () => {
  test('["a", "b", "c", "d"], "b", "c"', () => {
    type Result = Array.GetSliceBetween<["a", "b", "c", "d"], "b", "c">;
    expectTypeOf<Result>().toEqualTypeOf<[]>();
  });

  test('["a", "b", "c", "d"], "b", "d"', () => {
    type Result = Array.GetSliceBetween<["a", "b", "c", "d"], "b", "d">;
    expectTypeOf<Result>().toEqualTypeOf<["c"]>();
  });

  test('["a", "b", "c", "d"], "b", "e"', () => {
    type Result = Array.GetSliceBetween<["a", "b", "c", "d"], "b", "e">;
    expectTypeOf<Result>().toEqualTypeOf<["c", "d"]>();
  });
});

describe("Shift", () => {
  test('["a", "b", "c", "d"]', () => {
    type Result = Array.Shift<["a", "b", "c", "d"]>;
    expectTypeOf<Result>().toEqualTypeOf<["b", "c", "d"]>();
  });

  test("[]", () => {
    type Result = Array.Shift<[]>;
    expectTypeOf<Result>().toEqualTypeOf<[]>();
  });
});

describe("FilterOut", () => {
  test('["a", "b", "c"], "a" | "c"', () => {
    type Result = Array.FilterOut<["a", "b", "c"], "a" | "c">;
    expectTypeOf<Result>().toEqualTypeOf<["b"]>();
  });

  test('["a", "b", "c"], string', () => {
    type Result = Array.FilterOut<["a", "b", "c"], string>;
    expectTypeOf<Result>().toEqualTypeOf<[]>();
  });
});
