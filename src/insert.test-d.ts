import { test, describe, expectTypeOf } from "vitest";
import { InferParamsTypeFromInsertStatement, IsInsertStatement, ParseParamColumns } from "./insert";

type TestTables = {
  users: {
    id: number;
    name: string;
    country: "AT" | "DE";
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

describe("IsInsertStatement", () => {
  test("INSERT INTO users (name) VALUES (?)", () => {
    type Result = IsInsertStatement<"INSERT INTO users (name) VALUES (?)">;
    expectTypeOf<Result>().toEqualTypeOf<true>();
  });

  test("SELECT * FROM users", () => {
    type Result = IsInsertStatement<"SELECT * FROM users">;
    expectTypeOf<Result>().toEqualTypeOf<false>();
  });

  // describe("should support lowercase", () => {
  test("insert into users (name) values (?)", () => {
    type Result = IsInsertStatement<"insert into users (name) values (?)">;
    expectTypeOf<Result>().toEqualTypeOf<true>();
  });
  // });
});

describe("InferParamsTypeFromInsertStatement", () => {
  test("INSERT INTO users (id, name, country) VALUES (?, ?, ?)", () => {
    type Result = InferParamsTypeFromInsertStatement<
      "INSERT INTO users (id, name, country) VALUES (?, ?, ?)",
      TestTables
    >;
    expectTypeOf<Result>().toEqualTypeOf<[number, string, "AT" | "DE"]>();
  });

  // describe("should support lowercase", () => {
  test("insert into users (id, name, country) values (?, ?, ?)", () => {
    type Result = InferParamsTypeFromInsertStatement<
      "insert into users (id, name, country) values (?, ?, ?)",
      TestTables
    >;
    expectTypeOf<Result>().toEqualTypeOf<[number, string, "AT" | "DE"]>();
  });
  // });
});

describe("ParseParamColumns", () => {
  test("['name', 'age'], ['?', '?']", () => {
    type Result = ParseParamColumns<["name", "age"], ["?", "?"]>;
    expectTypeOf<Result>().toEqualTypeOf<["name", "age"]>();
  });

  test("['name', 'age'], ['?', '32']", () => {
    type Result = ParseParamColumns<["name", "age"], ["?", "32"]>;
    expectTypeOf<Result>().toEqualTypeOf<["name"]>();
  });
});
