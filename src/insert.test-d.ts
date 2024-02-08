import { test, describe, expectTypeOf } from "vitest";
import { ParseInsertStatement } from "./insert";

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

describe("ParseInsertStatement", () => {
  function parseInsertStatement<Q extends string>(query: Q): ParseInsertStatement<Q, TestTables> {
    return query as any;
  }

  test("INSERT INTO users (id, name) VALUES (?, ?)", () => {
    const result = parseInsertStatement("INSERT INTO users (id, name, country) VALUES (?, ?, ?)");
    expectTypeOf(result).toEqualTypeOf<[number, string, "AT" | "DE"]>();
  });

  test("INSERT INTO users (id, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = ?", () => {
    const result = parseInsertStatement("INSERT INTO users (id, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = ?");
    expectTypeOf(result).toEqualTypeOf<[number, string, string]>();
  });
});
