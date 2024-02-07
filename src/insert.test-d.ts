import { test, describe, expectTypeOf } from "vitest";
import { GetTableName } from "./insert";

describe("GetTableName", () => {
  function getTableName<T extends string>(query: T): GetTableName<T> {
    return query as any;
  }

  test("INSERT INTO users (id, name) VALUES (?, ?)", () => {
    const result = getTableName("INSERT INTO users (id, name) VALUES (?, ?)");
    expectTypeOf(result).toEqualTypeOf<"users">();
  });

  test("INSERT HIGH_PRIORITY users", () => {
    const result = getTableName("INSERT HIGH_PRIORITY users");
    expectTypeOf(result).toEqualTypeOf<"users">();
  });
});
