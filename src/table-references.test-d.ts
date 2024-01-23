import { test, describe, expectTypeOf } from "vitest";
import {
  ParseJoinedTable,
  ParseJoinedTableTypeA,
  ParseJoinedTableTypeB,
  ParseJoinedTableTypeC,
  ParseTableFactor,
  ParseTableReference,
} from "./table-references";

describe("ParseTableFactor", () => {
  function parseTableFactor<TF extends string>(tf: TF): ParseTableFactor<TF> {
    return tf as any;
  }

  test("tbl_name", () => {
    const tf = parseTableFactor("tbl_name");
    expectTypeOf(tf).toMatchTypeOf<"tbl_name">();
  });

  test("tbl_name AS alias", () => {
    const tf = parseTableFactor("tbl_name AS alias");
    expectTypeOf(tf).toMatchTypeOf<"tbl_name">();
  });

  test("tbl_name alias", () => {
    const tf = parseTableFactor("tbl_name alias");
    expectTypeOf(tf).toMatchTypeOf<"tbl_name">();
  });
});

describe("ParseJoinedTableTypeA", () => {
  function parseJoinedTable<JT extends string>(jt: JT): ParseJoinedTableTypeA<JT> {
    return jt as any;
  }

  test("table_reference JOIN table_factor", () => {
    const jt = parseJoinedTable("table_reference JOIN table_factor");
    expectTypeOf(jt).toMatchTypeOf<["table_reference", "table_factor"]>();
  });

  test("table_reference INNER JOIN table_factor", () => {
    const jt = parseJoinedTable("table_reference INNER JOIN table_factor");
    expectTypeOf(jt).toMatchTypeOf<["table_reference", "table_factor"]>();
  });

  test("table_reference CROSS JOIN table_factor", () => {
    const jt = parseJoinedTable("table_reference CROSS JOIN table_factor");
    expectTypeOf(jt).toMatchTypeOf<["table_reference", "table_factor"]>();
  });

  test("table_reference STRAIGHT_JOIN table_factor", () => {
    const jt = parseJoinedTable("table_reference STRAIGHT_JOIN table_factor");
    expectTypeOf(jt).toMatchTypeOf<["table_reference", "table_factor"]>();
  });
});

describe("ParseJoinedTableTypeB", () => {
  function parseJoinedTable<JT extends string>(jt: JT): ParseJoinedTableTypeB<JT> {
    return jt as any;
  }

  test("table_reference LEFT JOIN table_reference", () => {
    const jt = parseJoinedTable("table_reference LEFT JOIN table_reference");
    expectTypeOf(jt).toMatchTypeOf<["table_reference", "table_reference"]>();
  });

  test("table_reference RIGHT JOIN table_reference", () => {
    const jt = parseJoinedTable("table_reference RIGHT JOIN table_reference");
    expectTypeOf(jt).toMatchTypeOf<["table_reference", "table_reference"]>();
  });

  test("table_reference LEFT OUTER JOIN table_reference", () => {
    const jt = parseJoinedTable("table_reference LEFT OUTER JOIN table_reference");
    expectTypeOf(jt).toMatchTypeOf<["table_reference", "table_reference"]>();
  });

  test("table_reference RIGHT OUTER JOIN table_reference", () => {
    const jt = parseJoinedTable("table_reference RIGHT OUTER JOIN table_reference");
    expectTypeOf(jt).toMatchTypeOf<["table_reference", "table_reference"]>();
  });
});

describe("ParseJoinedTableTypeC", () => {
  function parseJoinedTable<JT extends string>(jt: JT): ParseJoinedTableTypeC<JT> {
    return jt as any;
  }

  test("table_reference NATURAL LEFT JOIN table_reference", () => {
    const jt = parseJoinedTable("table_reference NATURAL LEFT JOIN table_reference");
    expectTypeOf(jt).toMatchTypeOf<["table_reference", "table_reference"]>();
  });

  test("table_reference NATURAL RIGHT JOIN table_reference", () => {
    const jt = parseJoinedTable("table_reference NATURAL RIGHT JOIN table_reference");
    expectTypeOf(jt).toMatchTypeOf<["table_reference", "table_reference"]>();
  });

  test("table_reference NATURAL LEFT OUTER JOIN table_reference", () => {
    const jt = parseJoinedTable("table_reference NATURAL LEFT OUTER JOIN table_reference");
    expectTypeOf(jt).toMatchTypeOf<["table_reference", "table_reference"]>();
  });

  test("table_reference NATURAL RIGHT OUTER JOIN table_reference", () => {
    const jt = parseJoinedTable("table_reference NATURAL RIGHT OUTER JOIN table_reference");
    expectTypeOf(jt).toMatchTypeOf<["table_reference", "table_reference"]>();
  });

  test("table_reference NATURAL INNER JOIN table_reference", () => {
    const jt = parseJoinedTable("table_reference NATURAL INNER JOIN table_reference");
    expectTypeOf(jt).toMatchTypeOf<["table_reference", "table_reference"]>();
  });

  test("table_reference NATURAL JOIN table_reference", () => {
    const jt = parseJoinedTable("table_reference NATURAL JOIN table_reference");
    expectTypeOf(jt).toMatchTypeOf<["table_reference", "table_reference"]>();
  });
});

describe("ParseJoinedTable", () => {
  function parseJoinedTable<JT extends string>(jt: JT): ParseJoinedTable<JT> {
    return jt as any;
  }

  test("table_reference JOIN table_factor", () => {
    const jt = parseJoinedTable("table_reference JOIN table_factor");
    expectTypeOf(jt).toMatchTypeOf<["table_reference", "table_factor"]>();
  });
});

describe("ParseTableReference", () => {
  function parseTableReference<TR extends string>(tr: TR): ParseTableReference<TR> {
    return tr as any;
  }

  test("tbl_name", () => {
    const tr = parseTableReference("tbl_name");
    expectTypeOf(tr).toMatchTypeOf<"tbl_name">();
  });

  test("tbl_name AS alias", () => {
    const tr = parseTableReference("tbl_name AS alias");
    expectTypeOf(tr).toMatchTypeOf<"tbl_name">();
  });

  test("tbl_name alias", () => {
    const tr = parseTableReference("tbl_name alias");
    expectTypeOf(tr).toMatchTypeOf<"tbl_name">();
  });

  test("table_reference JOIN table_factor", () => {
    const tr = parseTableReference("table_reference JOIN table_factor");
    expectTypeOf(tr).toMatchTypeOf<["table_reference", "table_factor"]>();
  });
});
