import { test, describe, expectTypeOf } from "vitest";
import { ParseInsertStatement } from "./insert";

describe("ParseInsertStatement", () => {
  function parseInsertStatement<T extends string>(query: T): ParseInsertStatement<T> {
    return query as any;
  }

  test("INSERT INTO users (id, name) VALUES (?, ?)", () => {
    const result = parseInsertStatement("INSERT INTO users (id, name) VALUES (?, ?)");
    expectTypeOf(result).toEqualTypeOf<{
      into: "users";
      columns: ["id", "name"];
      values: ["?", "?"];
    }>();
  });

  test("INSERT HIGH_PRIORITY users", () => {
    const result = parseInsertStatement("INSERT HIGH_PRIORITY users");
    expectTypeOf(result).toEqualTypeOf<{
      into: "users";
      columns: [];
      values: [];
    }>();
  });
});
