import { assertType, test } from "vitest";
import type { ExtractTableName } from "./select";

function getTableName<Query extends string>(query: Query): ExtractTableName<Query> {
  return query as any;
}

test("select * from users", () => {
  const tableName = getTableName("select * from users");
  assertType<"users">(tableName);
});

test("SELECT * FROM users", () => {
  const tableName = getTableName("SELECT * FROM users");
  assertType<"users">(tableName);
});

test("select id from users", () => {
  const tableName = getTableName("select id from users");
  assertType<"users">(tableName);
});

test("select id, name from users", () => {
  const tableName = getTableName("select id, name from users");
  assertType<"users">(tableName);
});
