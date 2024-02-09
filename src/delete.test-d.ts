import { test, describe, expectTypeOf } from "vitest";
import { InferParamsTypeFromDeleteStatement } from "./delete";

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

describe("InferParamsTypeFromDeleteStatement", () => {
  function inferParamsType<Q extends string>(query: Q): InferParamsTypeFromDeleteStatement<Q, TestTables> {
    return query as any;
  }

  test("DELETE FROM users WHERE id = ? AND name = ?", () => {
    const result = inferParamsType("DELETE FROM users WHERE id = ? AND name = ?");
    expectTypeOf(result).toEqualTypeOf<[number, string]>();
  });
});
