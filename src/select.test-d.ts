import { test, describe, expectTypeOf } from "vitest";
import type {
  GetSelectExpressions,
  GetTableNames,
  InferReturnTypeFromSelectStatement,
  ParseSelectStatement,
} from "./select";

describe("ParseSelectStatement", () => {
  function parseSelectStatement<Query extends string>(query: Query): ParseSelectStatement<Query> {
    return query as any;
  }

  test("SELECT * FROM tbl_name", () => {
    const selectStatement = parseSelectStatement("SELECT * FROM tbl_name");
    expectTypeOf(selectStatement).toMatchTypeOf<{ selectExpressionsString: "*"; tableReferencesString: "tbl_name" }>();
  });

  test("SELECT col1, col2 FROM tbl_name1 JOIN tbl_name2", () => {
    const selectStatement = parseSelectStatement("SELECT col1, col2 FROM tbl_name1 JOIN tbl_name2");
    expectTypeOf(selectStatement).toMatchTypeOf<{
      selectExpressionsString: "col1, col2";
      tableReferencesString: "tbl_name1 JOIN tbl_name2";
    }>();
  });
});

describe("GetSelectExpressions", () => {
  function getSelectExpressions<Query extends string>(query: Query): GetSelectExpressions<Query> {
    return query as any;
  }

  test("SELECT * FROM tbl_name", () => {
    const selectExpressions = getSelectExpressions("SELECT * FROM tbl_name");
    expectTypeOf(selectExpressions).toMatchTypeOf<["*"]>();
  });

  test("SELECT col1, col2 FROM tbl_name1 JOIN tbl_name2", () => {
    const selectExpressions = getSelectExpressions("SELECT col1, col2 FROM tbl_name1 JOIN tbl_name2");
    expectTypeOf(selectExpressions).toMatchTypeOf<["col1", "col2"]>();
  });
});

describe("GetTableNames", () => {
  function getTableNames<Query extends string>(query: Query): GetTableNames<Query> {
    return query as any;
  }

  test("SELECT * FROM tbl_name", () => {
    const tableNames = getTableNames("SELECT * FROM tbl_name");
    expectTypeOf(tableNames).toMatchTypeOf<["tbl_name"]>();
  });

  test("SELECT col1, col2 FROM tbl_name1 JOIN tbl_name2", () => {
    const tableNames = getTableNames("SELECT col1, col2 FROM tbl_name1 JOIN tbl_name2");
    expectTypeOf(tableNames).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
  });
});

describe("InferReturnTypeFromSelectStatement", () => {
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
    comments: {
      id: number;
      body: string;
      postId: number;
    };
  };

  function inferReturnTypeFromSelectStatement<Query extends string>(
    query: Query,
  ): InferReturnTypeFromSelectStatement<Query, TestTables> {
    return query as any;
  }

  test("SELECT * FROM users", () => {
    const result = inferReturnTypeFromSelectStatement("SELECT * FROM users");
    expectTypeOf(result).toMatchTypeOf<TestTables["users"]>();
  });

  test("SELECT id, name FROM users", () => {
    const result = inferReturnTypeFromSelectStatement("SELECT id, name FROM users");
    expectTypeOf(result).toMatchTypeOf<{ id: number; name: string }>();
  });

  test("SELECT users.id, posts.title FROM users JOIN posts", () => {
    const result = inferReturnTypeFromSelectStatement("SELECT users.id, posts.title FROM users JOIN posts");
    expectTypeOf(result).toMatchTypeOf<{ id: number; title: string }>();
  });
});
