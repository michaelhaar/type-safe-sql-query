import { test, describe, expectTypeOf } from "vitest";
import { Tokenize } from "./utils";

describe("Tokenize", () => {
  function tokenize<S extends string>(s: S): Tokenize<S> {
    return s as any;
  }

  test("INSERT INTO users (id, name) VALUES (?, ?)", () => {
    const result = tokenize("INSERT INTO users (id, name) VALUES (?, ?)");
    expectTypeOf(result).toEqualTypeOf<["INSERT", "INTO", "users", "id", "name", "VALUES", "?", "?"]>();
  });
});
