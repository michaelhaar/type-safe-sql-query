import { assertType, test, describe } from "vitest";
import type { ExtractTableName, GetTableType } from "./select";

describe("ExtractTableName", () => {
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
});

describe("GetTableType", () => {
  type Tables = {
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
    comments: {
      id: number;
      body: string;
      postId: number;
    };
  };

  function getTableType<Query extends string>(query: Query): GetTableType<Query, Tables> {
    return query as any;
  }

  test("select * from users", () => {
    const tableName = getTableType("select * from users");
    assertType<{
      id: number;
      name: string;
    }>(tableName);
  });

  test("select * from posts", () => {
    const tableName = getTableType("select * from posts");
    assertType<{
      id: number;
      title: string;
      body: string;
      userId: number;
    }>(tableName);
  });
});
