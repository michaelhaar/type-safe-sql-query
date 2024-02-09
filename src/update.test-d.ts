import { test, describe, expectTypeOf } from "vitest";

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

describe("InferParamsTypeFromUpdateStatement", () => {
  function inferParamsType<Q extends string>(query: Q): InferParamsTypeFromUpdateStatement<Q, TestTables> {
    return query as any;
  }

  test("UPDATE users SET name = ? WHERE id = ?", () => {
    const result = inferParamsType("UPDATE users SET name = ? WHERE id = ?");
    expectTypeOf(result).toEqualTypeOf<[string, number]>();
  });
});
