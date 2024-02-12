import { test, describe, expectTypeOf } from "vitest";
import { InferParamsType, Tokenize } from ".";

describe("Tokenize", () => {
  test("should tokenize a string", () => {
    type Result = Tokenize<"INSERT INTO tab_name (col1, col2) VALUES (?, ?)">;
    expectTypeOf<Result>().toEqualTypeOf<
      ["INSERT", "INTO", "tab_name", "(", "col1", "col2", ")", "VALUES", "(", "?", "?", ")"]
    >();
  });
});

describe("InferParamsType", () => {
  type TestTables = { users: { id: number; name: string; age: number } };

  test('["users.id", "users.name"]', () => {
    type Result = InferParamsType<["users.id", "users.name"], TestTables>;
    expectTypeOf<Result>().toEqualTypeOf<[number, string]>();
  });

  test('["users.id", "users.age"]', () => {
    type Result = InferParamsType<["users.id", "users.age"], TestTables>;
    expectTypeOf<Result>().toEqualTypeOf<[number, number]>();
  });

  test('["id", "name"]', () => {
    type Result = InferParamsType<["id", "name"], TestTables, "users">;
    expectTypeOf<Result>().toEqualTypeOf<[number, string]>();
  });

  test('["id", "age"]', () => {
    type Result = InferParamsType<["id", "age"], TestTables, "users">;
    expectTypeOf<Result>().toEqualTypeOf<[number, number]>();
  });

  describe("Invalid table name", () => {
    test('["id", "age"]', () => {
      type Result = InferParamsType<["id", "age"], TestTables, "invalid">;
      expectTypeOf<Result>().toEqualTypeOf<[never, never]>();
    });

    test('["users.id", "age"]', () => {
      type Result = InferParamsType<["invalid.id", "age"], TestTables>;
      expectTypeOf<Result>().toEqualTypeOf<[never, never]>();
    });
  });
});
