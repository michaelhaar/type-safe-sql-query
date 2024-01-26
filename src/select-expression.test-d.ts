import { test, describe, expectTypeOf } from "vitest";
import { ParseSelectExpressions, SelectExpressionToTableColumnTypeMap } from "./select-expression";

describe("ParseSelectExpressions", () => {
  function parseSelectExpressions<Query extends string>(query: Query): ParseSelectExpressions<Query> {
    return query as any;
  }

  test("*", () => {
    const selectExpressions = parseSelectExpressions("*");
    expectTypeOf(selectExpressions).toMatchTypeOf<["*"]>();
  });

  test("col1, col2", () => {
    const selectExpressions = parseSelectExpressions("col1, col2");
    expectTypeOf(selectExpressions).toMatchTypeOf<["col1", "col2"]>();
  });

  test("tbl_name.*", () => {
    const selectExpressions = parseSelectExpressions("tbl_name.*");
    expectTypeOf(selectExpressions).toMatchTypeOf<["tbl_name.*"]>();
  });

  test("tbl_name.col1, tbl_name.col2", () => {
    const selectExpressions = parseSelectExpressions("tbl_name.col1, tbl_name.col2");
    expectTypeOf(selectExpressions).toMatchTypeOf<["tbl_name.col1", "tbl_name.col2"]>();
  });
});

describe("SelectExpressionToTableColumnTypeMap", () => {
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

  function selectExpressionToTableColumnTypeMap<SE extends string>(
    se: SE
  ): SelectExpressionToTableColumnTypeMap<SE, ["users"], TestTables> {
    return se as any;
  }

  test("*", () => {
    const selectExpression = selectExpressionToTableColumnTypeMap("*");
    expectTypeOf(selectExpression).toMatchTypeOf<TestTables["users"]>();
  });

  test("id", () => {
    const selectExpression = selectExpressionToTableColumnTypeMap("id");
    expectTypeOf(selectExpression).toMatchTypeOf<{ id: number }>();
  });

  test("name", () => {
    const selectExpression = selectExpressionToTableColumnTypeMap("name");
    expectTypeOf(selectExpression).toMatchTypeOf<{ name: string }>();
  });

  test("users.*", () => {
    const selectExpression = selectExpressionToTableColumnTypeMap("users.*");
    expectTypeOf(selectExpression).toMatchTypeOf<TestTables["users"]>();
  });

  test("users.id", () => {
    const selectExpression = selectExpressionToTableColumnTypeMap("users.id");
    expectTypeOf(selectExpression).toMatchTypeOf<{ id: number }>();
  });
});
