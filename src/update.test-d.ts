import { test, describe, expectTypeOf } from "vitest";
import { InferParamsTypeFromUpdateStatement } from "./update";

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
  test("UPDATE users SET name = ? WHERE id = ?", () => {
    type Result = InferParamsTypeFromUpdateStatement<"UPDATE users SET name = ? WHERE id = ?", TestTables>;
    expectTypeOf<Result>().toEqualTypeOf<[string, number]>();
  });
});
