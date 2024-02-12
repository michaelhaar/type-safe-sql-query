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
  test("INSERT INTO users (id, name, country) VALUES (?, ?, ?)", () => {
    type Result = InferParamsTypeFromInsertStatement<
      "INSERT INTO users (id, name, country) VALUES (?, ?, ?)",
      TestTables
    >;
    expectTypeOf<Result>().toEqualTypeOf<[number, string, "AT" | "DE"]>();
  });
});
