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
  test("DELETE FROM users WHERE id = ? AND name = ?", () => {
    type Result = InferParamsTypeFromDeleteStatement<"DELETE FROM users WHERE id = ? AND name = ?", TestTables>;
    expectTypeOf<Result>().toEqualTypeOf<[number, string]>();
  });
});
