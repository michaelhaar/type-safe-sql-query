import { test, describe, expectTypeOf } from "vitest";
import { InferParamsTypeFromSqlStatement, InferReturnTypeFromSqlStatement } from "./index";

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
  comments: {
    id: number;
    body: string;
    postId: number;
  };
};

describe("SELECT", () => {
  test("SELECT * FROM users", () => {
    type Result = InferReturnTypeFromSqlStatement<"SELECT * FROM users", TestTables>;
    expectTypeOf<Result>().toEqualTypeOf<{ id: number; name: string }[]>();
  });

  // TODO: uncomment when alias is supported.
  // test("SELECT id, name AS fullName FROM users", () => {
  //   type Result = InferReturnTypeFromSqlStatement<"SELECT id, name AS fullName FROM users", TestTables>;
  //   expectTypeOf<Result>().toEqualTypeOf<{ id: number; fullName: string }[]>();
  // });

  // test("SELECT id, name AS fullName FROM users WHERE id = 1 ORDER BY name", () => {
  //   type Result = InferReturnTypeFromSqlStatement<
  //     "SELECT id, name AS fullName FROM users WHERE id = 1 ORDER BY name",
  //     TestTables
  //   >;
  //   expectTypeOf<Result>().toEqualTypeOf<{ id: number; fullName: string }[]>();
  // });

  test("SELECT id, name, posts.title FROM users JOIN posts ON users.id = posts.userId", () => {
    type Result = InferReturnTypeFromSqlStatement<
      "SELECT id, name, posts.title FROM users JOIN posts ON users.id = posts.userId",
      TestTables
    >;
    expectTypeOf<Result>().toEqualTypeOf<{ id: number; name: string; title: string }[]>();
  });

  // TODO: add `describe` block for `inferParamsType` on next vitest release
  test("SELECT id, name, posts.title FROM users JOIN posts ON users.id = posts.userId WHERE users.id = ? AND posts.title = ?", () => {
    type Result = InferParamsTypeFromSqlStatement<
      "SELECT id, name, posts.title FROM users JOIN posts ON users.id = posts.userId WHERE users.id = ? AND posts.title = ?",
      TestTables
    >;
    expectTypeOf<Result>().toEqualTypeOf<[number, string]>();
  });
});

describe("DELETE", () => {
  // TODO: add `describe` block for `inferReturnType` on next vitest release
  test("DELETE FROM users", () => {
    type Result = InferReturnTypeFromSqlStatement<"DELETE FROM users", TestTables>;
    expectTypeOf<Result>().toEqualTypeOf<string>();
  });

  // TODO: add `describe` block for `inferParamsType` on next vitest release
  test("DELETE FROM users WHERE id = ? AND name = ?", () => {
    type Result = InferParamsTypeFromSqlStatement<"DELETE FROM users WHERE id = ? AND name = ?", TestTables>;
    expectTypeOf<Result>().toEqualTypeOf<[number, string]>();
  });
});

describe("INSERT", () => {
  describe("inferReturnType", () => {
    test("INSERT INTO users (id, name) VALUES (1, 'Alice')", () => {
      type Result = InferReturnTypeFromSqlStatement<"INSERT INTO users (id, name) VALUES (1, 'Alice')", TestTables>;
      expectTypeOf<Result>().toEqualTypeOf<string>();
    });
  });

  // TODO: add `describe` block for `inferParamsType` on next vitest release
  test("INSERT INTO users (id, name) VALUES (?, ?)", () => {
    type Result = InferParamsTypeFromSqlStatement<"INSERT INTO users (id, name) VALUES (?, ?)", TestTables>;
    expectTypeOf<Result>().toEqualTypeOf<[number, string]>();
  });
});

describe("UPDATE", () => {
  // TODO: add `describe` block for `inferReturnType` on next vitest release
  test("UPDATE users SET name = 'Bob' WHERE id = 1", () => {
    type Result = InferReturnTypeFromSqlStatement<"UPDATE users SET name = 'Bob' WHERE id = 1", TestTables>;
    expectTypeOf<Result>().toEqualTypeOf<string>();
  });

  // TODO: add `describe` block for `inferParamsType` on next vitest release
  test("UPDATE users SET name = ? WHERE id = ?", () => {
    type Result = InferParamsTypeFromSqlStatement<"UPDATE users SET name = ? WHERE id = ?", TestTables>;
    expectTypeOf<Result>().toEqualTypeOf<[string, number]>();
  });
});
