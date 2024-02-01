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

describe("SELECT", () => {
  function inferReturnTypeFromSqlStatement<Query extends string>(
    query: Query,
  ): InferReturnTypeFromSqlStatement<Query, TestTables> {
    return query as any;
  }

  test("SELECT * FROM users", () => {
    const result = inferReturnTypeFromSqlStatement("SELECT * FROM users");
    expectTypeOf(result).toMatchTypeOf<{ id: number; name: string }[]>();
  });

  test("SELECT id, name AS fullName FROM users", () => {
    const result = inferReturnTypeFromSqlStatement("SELECT id, name  AS fullName FROM users");
    expectTypeOf(result).toMatchTypeOf<{ id: number; fullName: string }[]>();
  });
});
