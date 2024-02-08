import { test, describe, expectTypeOf } from "vitest";
import { InferParamsTypeFromInsertStatement } from "./insert";

type TestTables = {
  users: {
    id: number;
    name: string;
    country: "AT" | "DE";
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

describe("InferParamsTypeFromInsertStatement", () => {
  function inferParamsType<Q extends string>(query: Q): InferParamsTypeFromInsertStatement<Q, TestTables> {
    return query as any;
  }

  test("INSERT INTO users (id, name) VALUES (?, ?)", () => {
    const result = inferParamsType("INSERT INTO users (id, name, country) VALUES (?, ?, ?)");
    expectTypeOf(result).toEqualTypeOf<[number, string, "AT" | "DE"]>();
  });
});
