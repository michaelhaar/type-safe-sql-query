import { test, describe, expectTypeOf } from "vitest";
import type {
  InferParamsTypeFromSelectStatement,
  InferReturnTypeFromSelectStatement,
  IsSelectStatement,
  InferReturnType,
  SanitizeColumnNames,
} from "./select";
import { Object } from "./utils";

describe("IsSelectStatement", () => {
  test("SELECT * FROM users", () => {
    type Result = IsSelectStatement<"SELECT * FROM users">;
    expectTypeOf<Result>().toEqualTypeOf<true>();
  });

  test("Insert into users (name) values (?)", () => {
    type Result = IsSelectStatement<"Insert into users (name) values (?)">;
    expectTypeOf<Result>().toEqualTypeOf<false>();
  });

  // describe("should support lowercase", () => {
  test("select * from users", () => {
    type Result = IsSelectStatement<"select * from users">;
    expectTypeOf<Result>().toEqualTypeOf<true>();
  });
  // });
});

describe("InferReturnTypeFromSelectStatement", () => {
  type DB = {
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
    type Result = InferReturnTypeFromSelectStatement<"SELECT * FROM users", DB>;
    expectTypeOf<Result>().toEqualTypeOf<DB["users"][]>();
  });

  test("SELECT id, name FROM users", () => {
    type Result = InferReturnTypeFromSelectStatement<"SELECT id, name FROM users", DB>;
    expectTypeOf<Result>().toEqualTypeOf<{ id: number; name: string }[]>();
  });

  test("SELECT users.id, posts.title FROM users JOIN posts", () => {
    type Result = InferReturnTypeFromSelectStatement<"SELECT users.id, posts.title FROM users JOIN posts", DB>;
    expectTypeOf<Result>().toEqualTypeOf<{ id: number; title: string }[]>();
  });

  // TODO: uncomment when alias is supported.
  // test("SELECT id AS id_alias FROM users", () => {
  //   type Result = InferReturnTypeFromSelectStatement<"SELECT id AS id_alias FROM users", DB>;
  //   expectTypeOf<Result>().toEqualTypeOf<{ id_alias: number }[]>();
  // });

  // test("SELECT id id_alias FROM users", () => {
  //   type Result = InferReturnTypeFromSelectStatement<"SELECT id id_alias FROM users", DB>;
  //   expectTypeOf<Result>().toEqualTypeOf<{ id_alias: number }[]>();
  // });

  // describe("should support lowercase", () => {
  test("select * from users", () => {
    type Result = InferReturnTypeFromSelectStatement<"select * from users", DB>;
    expectTypeOf<Result>().toEqualTypeOf<DB["users"][]>();
  });
  // });
});

describe("InferParamsTypeFromSelectStatement", () => {
  type DB = {
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
    type Result = InferParamsTypeFromSelectStatement<"SELECT * FROM users", DB>;
    expectTypeOf<Result>().toEqualTypeOf<[]>();
  });

  test("SELECT * FROM users WHERE id = ? AND name = ?", () => {
    type Result = InferParamsTypeFromSelectStatement<"SELECT * FROM users WHERE id = ? AND name = ?", DB>;
    expectTypeOf<Result>().toEqualTypeOf<[number, string]>();
  });

  test("SELECT * FROM users JOIN posts ON users.id = posts.userId WHERE users.id = ? AND posts.title = ?", () => {
    type Result = InferParamsTypeFromSelectStatement<
      "SELECT * FROM users JOIN posts ON users.id = posts.userId WHERE users.id = ? AND posts.title = ?",
      DB
    >;
    expectTypeOf<Result>().toEqualTypeOf<[number, string]>();
  });

  // describe("should support lowercase", () => {
  test("SELECT * FROM users WHERE id = ? AND name = ?", () => {
    type Result = InferParamsTypeFromSelectStatement<"SELECT * FROM users WHERE id = ? AND name = ?", DB>;
    expectTypeOf<Result>().toEqualTypeOf<[number, string]>();
  });
  // });
});

describe("InferReturnType", () => {
  type DB = { users: { id: number; name: string; age: number } };

  test('["users.id", "users.name"]', () => {
    type Result = Object.ExpandRecursively<InferReturnType<["users.id", "users.name"], DB>>;
    expectTypeOf<Result>().toEqualTypeOf<{ id: number; name: string }>();
  });

  test('["users.id", "users.age"]', () => {
    type Result = Object.ExpandRecursively<InferReturnType<["users.id", "users.age"], DB>>;
    expectTypeOf<Result>().toEqualTypeOf<{ id: number; age: number }>();
  });
});

describe("SanitizeColumnNames", () => {
  test('["col1", "col2"], "tbl_name1"', () => {
    type Result = SanitizeColumnNames<["col1", "col2"], "tbl_name1">;
    expectTypeOf<Result>().toEqualTypeOf<["tbl_name1.col1", "tbl_name1.col2"]>();
  });

  test('["col1", "tbl_name2.col1"], "tbl_name1"', () => {
    type Result = SanitizeColumnNames<["col1", "tbl_name2.col1"], "tbl_name1">;
    expectTypeOf<Result>().toEqualTypeOf<["tbl_name1.col1", "tbl_name2.col1"]>();
  });
});
