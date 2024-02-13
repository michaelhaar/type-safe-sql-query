import { test, describe, expectTypeOf } from "vitest";
import { ParseParamsFromWhereClauseTokens } from "./where-condition";

describe("ParseParamsFromWhereClauseTokens", () => {
  test("ParseParamsFromWhereClauseTokens<['id', '=', '?']", () => {
    type Result = ParseParamsFromWhereClauseTokens<["id", "=", "?"]>;
    expectTypeOf<Result>().toEqualTypeOf<["id"]>();
  });

  test("ParseParamsFromWhereClauseTokens<['id', '=', '?', 'AND', 'name', '=', '?', 'OR', 'age', '=', '?']", () => {
    type Result = ParseParamsFromWhereClauseTokens<
      ["id", "=", "?", "AND", "name", "=", "?", "OR", "age", "=", "?"],
      null
    >;
    expectTypeOf<Result>().toEqualTypeOf<["id", "name", "age"]>();
  });
});
