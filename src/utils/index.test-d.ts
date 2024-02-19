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
  type DB = { users: { id: number; name: string; age: number } };

  test('["users.id", "users.name"]', () => {
    type Result = InferParamsType<["users.id", "users.name"], DB>;
    expectTypeOf<Result>().toEqualTypeOf<[number, string]>();
  });

  test('["users.id", "users.age"]', () => {
    type Result = InferParamsType<["users.id", "users.age"], DB>;
    expectTypeOf<Result>().toEqualTypeOf<[number, number]>();
  });

  test('["id", "name"]', () => {
    type Result = InferParamsType<["id", "name"], DB, "users">;
    expectTypeOf<Result>().toEqualTypeOf<[number, string]>();
  });

  test('["id", "age"]', () => {
    type Result = InferParamsType<["id", "age"], DB, "users">;
    expectTypeOf<Result>().toEqualTypeOf<[number, number]>();
  });

  describe("Invalid table name", () => {
    test('["id", "age"]', () => {
      type Result = InferParamsType<["id", "age"], DB, "invalid">;
      expectTypeOf<Result>().toEqualTypeOf<[never, never]>();
    });

    test('["users.id", "age"]', () => {
      type Result = InferParamsType<["invalid.id", "age"], DB>;
      expectTypeOf<Result>().toEqualTypeOf<[never, never]>();
    });
  });
});
