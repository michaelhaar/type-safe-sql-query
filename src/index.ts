import { InferReturnTypeFromSelectStatement } from "./select";

export type InferReturnTypeFromSqlStatement<Query extends string, Tables> = Query extends `SELECT ${infer _Rest}`
  ? InferReturnTypeFromSelectStatement<Query, Tables>
  : never;
