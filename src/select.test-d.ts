import { test, describe, expectTypeOf } from "vitest";
import type {
  GetSelectExpressions,
  GetTableNames,
  InferParamsTypeFromSelectStatement,
  InferReturnTypeFromSelectStatement,
  ParseSelectStatement,
} from "./select";

describe("ParseSelectStatement", () => {
  test("SELECT * FROM tbl_name", () => {
    type Result = ParseSelectStatement<"SELECT * FROM tbl_name">;
    expectTypeOf<Result>().toEqualTypeOf<{ selectExpressionsString: "*"; tableReferencesString: "tbl_name" }>();
  });

  test("SELECT col1, col2 FROM tbl_name1 JOIN tbl_name2", () => {
    type Result = ParseSelectStatement<"SELECT col1, col2 FROM tbl_name1 JOIN tbl_name2">;
    expectTypeOf<Result>().toEqualTypeOf<{
      selectExpressionsString: "col1, col2";
      tableReferencesString: "tbl_name1 JOIN tbl_name2";
    }>();
  });
});

describe("GetSelectExpressions", () => {
  test("SELECT * FROM tbl_name", () => {
    type Result = GetSelectExpressions<"SELECT * FROM tbl_name">;
    expectTypeOf<Result>().toEqualTypeOf<["*"]>();
  });

  test("SELECT col1, col2 FROM tbl_name1 JOIN tbl_name2", () => {
    type Result = GetSelectExpressions<"SELECT col1, col2 FROM tbl_name1 JOIN tbl_name2">;
    expectTypeOf<Result>().toEqualTypeOf<["col1", "col2"]>();
  });
});

describe("GetTableNames", () => {
  test("SELECT * FROM tbl_name", () => {
    type Result = GetTableNames<"SELECT * FROM tbl_name">;
    expectTypeOf<Result>().toEqualTypeOf<["tbl_name"]>();
  });

  test("SELECT col1, col2 FROM tbl_name1 JOIN tbl_name2", () => {
    type Result = GetTableNames<"SELECT col1, col2 FROM tbl_name1 JOIN tbl_name2">;
    expectTypeOf<Result>().toEqualTypeOf<["tbl_name1", "tbl_name2"]>();
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

  test("SELECT * FROM users", () => {
    type Result = InferReturnTypeFromSelectStatement<"SELECT * FROM users", TestTables>;
    expectTypeOf<Result>().toEqualTypeOf<TestTables["users"][]>();
  });

  test("SELECT id, name FROM users", () => {
    type Result = InferReturnTypeFromSelectStatement<"SELECT id, name FROM users", TestTables>;
    expectTypeOf<Result>().toEqualTypeOf<{ id: number; name: string }[]>();
  });

  test("SELECT users.id, posts.title FROM users JOIN posts", () => {
    type Result = InferReturnTypeFromSelectStatement<"SELECT users.id, posts.title FROM users JOIN posts", TestTables>;
    expectTypeOf<Result>().toEqualTypeOf<{ id: number; title: string }[]>();
  });

  test("SELECT id AS id_alias FROM users", () => {
    type Result = InferReturnTypeFromSelectStatement<"SELECT id AS id_alias FROM users", TestTables>;
    expectTypeOf<Result>().toEqualTypeOf<{ id_alias: number }[]>();
  });

  test("SELECT id id_alias FROM users", () => {
    type Result = InferReturnTypeFromSelectStatement<"SELECT id id_alias FROM users", TestTables>;
    expectTypeOf<Result>().toEqualTypeOf<{ id_alias: number }[]>();
  });
});

describe("InferParamsTypeFromSelectStatement", () => {
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

  test("SELECT * FROM users", () => {
    type Result = InferParamsTypeFromSelectStatement<"SELECT * FROM users", TestTables>;
    expectTypeOf<Result>().toEqualTypeOf<[]>();
  });

  test("SELECT * FROM users WHERE id = ? AND name = ?", () => {
    type Result = InferParamsTypeFromSelectStatement<"SELECT * FROM users WHERE id = ? AND name = ?", TestTables>;
    expectTypeOf<Result>().toEqualTypeOf<[number, string]>();
  });

  test("SELECT * FROM users JOIN posts ON users.id = posts.userId WHERE users.id = ? AND posts.title = ?", () => {
    type Result = InferParamsTypeFromSelectStatement<
      "SELECT * FROM users JOIN posts ON users.id = posts.userId WHERE users.id = ? AND posts.title = ?",
      TestTables
    >;
    expectTypeOf<Result>().toEqualTypeOf<[number, string]>();
  });
});
