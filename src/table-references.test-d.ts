import { test, describe, expectTypeOf } from "vitest";
import { ParseTableReference } from "./table-references";

describe("ParseTableReference", () => {
  function parseTableReference<TR extends string>(tr: TR): ParseTableReference<TR> {
    return tr as any;
  }

  describe("simple", () => {
    test("tbl_name", () => {
      const tf = parseTableReference("tbl_name");
      expectTypeOf(tf).toMatchTypeOf<["tbl_name"]>();
    });
  });

  describe("Single Joins", () => {
    test("tbl_name1 JOIN tbl_name2", () => {
      const jt = parseTableReference("tbl_name1 JOIN tbl_name2");
      expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
    });

    test("tbl_name1 INNER JOIN tbl_name2", () => {
      const jt = parseTableReference("tbl_name1 INNER JOIN tbl_name2");
      expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
    });

    test("tbl_name1 CROSS JOIN tbl_name2", () => {
      const jt = parseTableReference("tbl_name1 CROSS JOIN tbl_name2");
      expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
    });

    test("tbl_name1 STRAIGHT_JOIN tbl_name2", () => {
      const jt = parseTableReference("tbl_name1 STRAIGHT_JOIN tbl_name2");
      expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
    });

    test("tbl_name1 LEFT JOIN tbl_name2", () => {
      const jt = parseTableReference("tbl_name1 LEFT JOIN tbl_name2");
      expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
    });

    test("tbl_name1 RIGHT JOIN tbl_name2", () => {
      const jt = parseTableReference("tbl_name1 RIGHT JOIN tbl_name2");
      expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
    });

    test("tbl_name1 LEFT OUTER JOIN tbl_name2", () => {
      const jt = parseTableReference("tbl_name1 LEFT OUTER JOIN tbl_name2");
      expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
    });

    test("tbl_name1 RIGHT OUTER JOIN tbl_name2", () => {
      const jt = parseTableReference("tbl_name1 RIGHT OUTER JOIN tbl_name2");
      expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
    });

    test("tbl_name1 NATURAL LEFT JOIN tbl_name2", () => {
      const jt = parseTableReference("tbl_name1 NATURAL LEFT JOIN tbl_name2");
      expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
    });

    test("tbl_name1 NATURAL RIGHT JOIN tbl_name2", () => {
      const jt = parseTableReference("tbl_name1 NATURAL RIGHT JOIN tbl_name2");
      expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
    });

    test("tbl_name1 NATURAL LEFT OUTER JOIN tbl_name2", () => {
      const jt = parseTableReference("tbl_name1 NATURAL LEFT OUTER JOIN tbl_name2");
      expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
    });

    test("tbl_name1 NATURAL RIGHT OUTER JOIN tbl_name2", () => {
      const jt = parseTableReference("tbl_name1 NATURAL RIGHT OUTER JOIN tbl_name2");
      expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
    });

    test("tbl_name1 NATURAL INNER JOIN tbl_name2", () => {
      const jt = parseTableReference("tbl_name1 NATURAL INNER JOIN tbl_name2");
      expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
    });

    test("tbl_name1 NATURAL JOIN tbl_name2", () => {
      const jt = parseTableReference("tbl_name1 NATURAL JOIN tbl_name2");
      expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
    });
  });

  describe("Multiple Joins", () => {
    test("tbl_name1 JOIN tbl_name2 JOIN tbl_name3", () => {
      const jt = parseTableReference("tbl_name1 JOIN tbl_name2 JOIN tbl_name3");
      expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2", "tbl_name3"]>();
    });

    test("tbl_name1 JOIN tbl_name2 INNER JOIN tbl_name3", () => {
      const jt = parseTableReference("tbl_name1 JOIN tbl_name2 INNER JOIN tbl_name3");
      expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2", "tbl_name3"]>();
    });

    test("tbl_name1 LEFT JOIN tbl_name2 CROSS JOIN tbl_name3", () => {
      const jt = parseTableReference("tbl_name1 JOIN tbl_name2 CROSS JOIN tbl_name3");
      expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2", "tbl_name3"]>();
    });
  });
});
