import { test, describe, expectTypeOf } from "vitest";
import {
  ParseSelectExpressions,
  PickWithSanitizedSelectExpressions,
  SanitizeSelectExpressions,
} from "./select-expression";

describe("ParseSelectExpressions", () => {
  function parseSelectExpressions<Query extends string>(query: Query): ParseSelectExpressions<Query> {
    return query as any;
  }

  test("*", () => {
    const selectExpressions = parseSelectExpressions("*");
    expectTypeOf(selectExpressions).toEqualTypeOf<["*"]>();
  });

  test("col1, col2", () => {
    const selectExpressions = parseSelectExpressions("col1, col2");
    expectTypeOf(selectExpressions).toEqualTypeOf<["col1", "col2"]>();
  });

  test("tbl_name.*", () => {
    const selectExpressions = parseSelectExpressions("tbl_name.*");
    expectTypeOf(selectExpressions).toEqualTypeOf<["tbl_name.*"]>();
  });

  test("tbl_name.col1, tbl_name.col2", () => {
    const selectExpressions = parseSelectExpressions("tbl_name.col1, tbl_name.col2");
    expectTypeOf(selectExpressions).toEqualTypeOf<["tbl_name.col1", "tbl_name.col2"]>();
  });

  test("tbl_name.col1 AS col1_alias, tbl_name.col2 AS col2_alias", () => {
    const selectExpressions = parseSelectExpressions("tbl_name.col1 AS col1_alias, tbl_name.col2 AS col2_alias");
    expectTypeOf(selectExpressions).toEqualTypeOf<["tbl_name.col1 AS col1_alias", "tbl_name.col2 AS col2_alias"]>();
  });

  test("tbl_name.col1 col1_alias, tbl_name.col2 col2_alias", () => {
    const selectExpressions = parseSelectExpressions("tbl_name.col1 col1_alias, tbl_name.col2 col2_alias");
    expectTypeOf(selectExpressions).toEqualTypeOf<["tbl_name.col1 col1_alias", "tbl_name.col2 col2_alias"]>();
  });
});

describe("SanitizeSelectExpressions", () => {
  function sanitizeSelectExpressions<S extends string[]>(s: S): SanitizeSelectExpressions<S, "tbl_name"> {
    return s as any;
  }

  test("*", () => {
    const selectExpressions = sanitizeSelectExpressions(["*"] as const);
    expectTypeOf(selectExpressions).toEqualTypeOf<["tbl_name.*"]>();
  });

  test("col1, col2", () => {
    const selectExpressions = sanitizeSelectExpressions(["col1", "col2"] as const);
    expectTypeOf(selectExpressions).toEqualTypeOf<["tbl_name.col1", "tbl_name.col2"]>();
  });

  test("col1 as col1_alias, col2 as col2_alias", () => {
    const selectExpressions = sanitizeSelectExpressions(["col1 as col1_alias", "col2 as col2_alias"] as const);
    expectTypeOf(selectExpressions).toEqualTypeOf<["tbl_name.col1 as col1_alias", "tbl_name.col2 as col2_alias"]>();
  });

  test("col1 col1_alias, col2 col2_alias", () => {
    const selectExpressions = sanitizeSelectExpressions(["col1 col1_alias", "col2 col2_alias"] as const);
    expectTypeOf(selectExpressions).toEqualTypeOf<["tbl_name.col1 col1_alias", "tbl_name.col2 col2_alias"]>();
  });
});

describe("PickWithSanitizedSelectExpressions", () => {
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

  function pickWithSanitizedSelectExpressions<S extends string[]>(
    s: S,
  ): PickWithSanitizedSelectExpressions<S, TestTables> {
    return s as any;
  }

  test("users.*", () => {
    const selectExpression = pickWithSanitizedSelectExpressions(["users.*"] as const);
    expectTypeOf(selectExpression).toEqualTypeOf<TestTables["users"]>();
  });

  test("users.id", () => {
    const selectExpression = pickWithSanitizedSelectExpressions(["users.id"] as const);
    expectTypeOf(selectExpression).toEqualTypeOf<{ id: number }>();
  });

  test("users.id, users.name", () => {
    const selectExpression = pickWithSanitizedSelectExpressions(["users.id", "users.name"] as const);
    expectTypeOf(selectExpression).toEqualTypeOf<{
      id: number;
      name: string;
    }>();
  });

  test("users.id, posts.title", () => {
    const selectExpression = pickWithSanitizedSelectExpressions(["users.id", "posts.title"] as const);
    expectTypeOf(selectExpression).toEqualTypeOf<{
      id: number;
      title: string;
    }>();
  });

  test("users.id AS id_alias", () => {
    const selectExpression = pickWithSanitizedSelectExpressions(["users.id AS id_alias"] as const);
    expectTypeOf(selectExpression).toEqualTypeOf<{
      id_alias: number;
    }>();
  });
});
