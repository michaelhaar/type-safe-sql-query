import { test, describe, expectTypeOf } from "vitest";
import { InferReturnTypeFromSqlStatement } from "./index";

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

function inferReturnTypeFromSqlStatement<Query extends string>(
  query: Query,
): InferReturnTypeFromSqlStatement<Query, TestTables> {
  return query as any;
}

describe("SELECT", () => {
  test("SELECT * FROM users", () => {
    const result = inferReturnTypeFromSqlStatement("SELECT * FROM users");
    expectTypeOf(result).toMatchTypeOf<{ id: number; name: string }[]>();
  });

  test("SELECT id, name AS fullName FROM users", () => {
    const result = inferReturnTypeFromSqlStatement("SELECT id, name  AS fullName FROM users");
    expectTypeOf(result).toMatchTypeOf<{ id: number; fullName: string }[]>();
  });
});

describe("DELETE", () => {
  test("DELETE FROM users", () => {
    const result = inferReturnTypeFromSqlStatement("DELETE FROM users");
    expectTypeOf(result).toMatchTypeOf<string>();
  });
});

describe("INSERT", () => {
  test("INSERT INTO users (id, name) VALUES (1, 'Alice')", () => {
    const result = inferReturnTypeFromSqlStatement("INSERT INTO users (id, name) VALUES (1, 'Alice')");
    expectTypeOf(result).toMatchTypeOf<string>();
  });
});

describe("UPDATE", () => {
  test("UPDATE users SET name = 'Bob' WHERE id = 1", () => {
    const result = inferReturnTypeFromSqlStatement("UPDATE users SET name = 'Bob' WHERE id = 1");
    expectTypeOf(result).toMatchTypeOf<string>();
  });
});
