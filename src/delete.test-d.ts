import { test, describe, expectTypeOf } from "vitest";
import { InferParamsTypeFromDeleteStatement, IsDeleteStatement } from "./delete";

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

describe("IsDeleteStatement", () => {
  test("DELETE FROM users WHERE id = ? AND name = ?", () => {
    type Result = IsDeleteStatement<"DELETE FROM users WHERE id = ? AND name = ?">;
    expectTypeOf<Result>().toEqualTypeOf<true>();
  });

  test("SELECT * FROM users", () => {
    type Result = IsDeleteStatement<"SELECT * FROM users">;
    expectTypeOf<Result>().toEqualTypeOf<false>();
  });

  describe("should support lowercase", () => {
    test("delete from users where id = ? and name = ?", () => {
      type Result = IsDeleteStatement<"delete from users where id = ? and name = ?">;
      expectTypeOf<Result>().toEqualTypeOf<true>();
    });
  });
});

describe("InferParamsTypeFromDeleteStatement", () => {
  test("DELETE FROM users WHERE id = ? AND name = ?", () => {
    type Result = InferParamsTypeFromDeleteStatement<"DELETE FROM users WHERE id = ? AND name = ?", TestTables>;
    expectTypeOf<Result>().toEqualTypeOf<[number, string]>();
  });

  describe("should support lowercase", () => {
    test("delete from users where id = ? and name = ?", () => {
      type Result = InferParamsTypeFromDeleteStatement<"delete from users where id = ? and name = ?", TestTables>;
      expectTypeOf<Result>().toEqualTypeOf<[number, string]>();
    });
  });
});
