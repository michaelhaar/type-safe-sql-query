import { test, describe, expectTypeOf } from "vitest";
import { InferParamsTypeFromUpdateStatement, IsUpdateStatement } from "./update";

type TestTables = {
  users: {
    id: number;
    name: string;
  };
  posts: {
    id: number;
    title: string;
    body: string;
    userId: number;
  };
};

describe("IsUpdateStatement", () => {
  test("UPDATE users SET name = ? WHERE id = ?", () => {
    type Result = IsUpdateStatement<"UPDATE users SET name = ? WHERE id = ?">;
    expectTypeOf<Result>().toEqualTypeOf<true>();
  });

  test("SELECT * FROM users", () => {
    type Result = IsUpdateStatement<"SELECT * FROM users">;
    expectTypeOf<Result>().toEqualTypeOf<false>();
  });

  describe("should support lowercase", () => {
    test("update users set name = ? where id = ?", () => {
      type Result = IsUpdateStatement<"update users set name = ? where id = ?">;
      expectTypeOf<Result>().toEqualTypeOf<true>();
    });
  });
});

describe("InferParamsTypeFromUpdateStatement", () => {
  test("UPDATE users SET name = ? WHERE id = ?", () => {
    type Result = InferParamsTypeFromUpdateStatement<"UPDATE users SET name = ? WHERE id = ?", TestTables>;
    expectTypeOf<Result>().toEqualTypeOf<[string, number]>();
  });

  describe("should support lowercase", () => {
    test("update users set name = ? where id = ?", () => {
      type Result = InferParamsTypeFromUpdateStatement<"update users set name = ? where id = ?", TestTables>;
      expectTypeOf<Result>().toEqualTypeOf<[string, number]>();
    });
  });
});
