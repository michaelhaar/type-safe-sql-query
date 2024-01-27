import { test, describe, expectTypeOf } from "vitest";
import { ParseTableReferences } from "./table-references";

function parseTableReferences<TR extends string>(tr: TR): ParseTableReferences<TR> {
  return tr as any;
}

describe("Basic", () => {
  test("tbl_name", () => {
    const tf = parseTableReferences("tbl_name");
    expectTypeOf(tf).toMatchTypeOf<["tbl_name"]>();
  });
});

describe("Single Joins", () => {
  test("tbl_name1 JOIN tbl_name2", () => {
    const jt = parseTableReferences("tbl_name1 JOIN tbl_name2");
    expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
  });

  test("tbl_name1 INNER JOIN tbl_name2", () => {
    const jt = parseTableReferences("tbl_name1 INNER JOIN tbl_name2");
    expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
  });

  test("tbl_name1 CROSS JOIN tbl_name2", () => {
    const jt = parseTableReferences("tbl_name1 CROSS JOIN tbl_name2");
    expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
  });

  test("tbl_name1 STRAIGHT_JOIN tbl_name2", () => {
    const jt = parseTableReferences("tbl_name1 STRAIGHT_JOIN tbl_name2");
    expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
  });

  test("tbl_name1 LEFT JOIN tbl_name2", () => {
    const jt = parseTableReferences("tbl_name1 LEFT JOIN tbl_name2");
    expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
  });

  test("tbl_name1 RIGHT JOIN tbl_name2", () => {
    const jt = parseTableReferences("tbl_name1 RIGHT JOIN tbl_name2");
    expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
  });

  test("tbl_name1 LEFT OUTER JOIN tbl_name2", () => {
    const jt = parseTableReferences("tbl_name1 LEFT OUTER JOIN tbl_name2");
    expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
  });

  test("tbl_name1 RIGHT OUTER JOIN tbl_name2", () => {
    const jt = parseTableReferences("tbl_name1 RIGHT OUTER JOIN tbl_name2");
    expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
  });

  test("tbl_name1 NATURAL LEFT JOIN tbl_name2", () => {
    const jt = parseTableReferences("tbl_name1 NATURAL LEFT JOIN tbl_name2");
    expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
  });

  test("tbl_name1 NATURAL RIGHT JOIN tbl_name2", () => {
    const jt = parseTableReferences("tbl_name1 NATURAL RIGHT JOIN tbl_name2");
    expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
  });

  test("tbl_name1 NATURAL LEFT OUTER JOIN tbl_name2", () => {
    const jt = parseTableReferences("tbl_name1 NATURAL LEFT OUTER JOIN tbl_name2");
    expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
  });

  test("tbl_name1 NATURAL RIGHT OUTER JOIN tbl_name2", () => {
    const jt = parseTableReferences("tbl_name1 NATURAL RIGHT OUTER JOIN tbl_name2");
    expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
  });

  test("tbl_name1 NATURAL INNER JOIN tbl_name2", () => {
    const jt = parseTableReferences("tbl_name1 NATURAL INNER JOIN tbl_name2");
    expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
  });

  test("tbl_name1 NATURAL JOIN tbl_name2", () => {
    const jt = parseTableReferences("tbl_name1 NATURAL JOIN tbl_name2");
    expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
  });
});

describe("Multiple Joins", () => {
  test("tbl_name1 JOIN tbl_name2 JOIN tbl_name3", () => {
    const jt = parseTableReferences("tbl_name1 JOIN tbl_name2 JOIN tbl_name3");
    expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2", "tbl_name3"]>();
  });

  test("tbl_name1 JOIN tbl_name2 INNER JOIN tbl_name3", () => {
    const jt = parseTableReferences("tbl_name1 JOIN tbl_name2 INNER JOIN tbl_name3");
    expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2", "tbl_name3"]>();
  });

  test("tbl_name1 LEFT JOIN tbl_name2 CROSS JOIN tbl_name3", () => {
    const jt = parseTableReferences("tbl_name1 JOIN tbl_name2 CROSS JOIN tbl_name3");
    expectTypeOf(jt).toMatchTypeOf<["tbl_name1", "tbl_name2", "tbl_name3"]>();
  });
});

describe("Multiple table references", () => {
  test("tbl_name1, tbl_name2", () => {
    const tf = parseTableReferences("tbl_name1, tbl_name2");
    expectTypeOf(tf).toMatchTypeOf<["tbl_name1", "tbl_name2"]>();
  });

  test("tbl_name1, tbl_name2 JOIN tbl_name3", () => {
    const tf = parseTableReferences("tbl_name1, tbl_name2 JOIN tbl_name3");
    expectTypeOf(tf).toMatchTypeOf<["tbl_name1", "tbl_name2", "tbl_name3"]>();
  });

  test("tbl_name1, tbl_name2 JOIN tbl_name3, tbl_name4", () => {
    const tf = parseTableReferences("tbl_name1, tbl_name2 JOIN tbl_name3, tbl_name4");
    expectTypeOf(tf).toMatchTypeOf<["tbl_name1", "tbl_name2", "tbl_name3", "tbl_name4"]>();
  });
});
