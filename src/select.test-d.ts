import { test, describe, expectTypeOf } from "vitest";
import type { InferParamsTypeFromSelectStatement, InferReturnTypeFromSelectStatement } from "./select";

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

  // TODO: uncomment when alias is supported.
  // test("SELECT id AS id_alias FROM users", () => {
  //   type Result = InferReturnTypeFromSelectStatement<"SELECT id AS id_alias FROM users", TestTables>;
  //   expectTypeOf<Result>().toEqualTypeOf<{ id_alias: number }[]>();
  // });

  // test("SELECT id id_alias FROM users", () => {
  //   type Result = InferReturnTypeFromSelectStatement<"SELECT id id_alias FROM users", TestTables>;
  //   expectTypeOf<Result>().toEqualTypeOf<{ id_alias: number }[]>();
  // });
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
