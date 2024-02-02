import { IsDeleteStatement, ReturnTypeFromDeleteStatement } from "./delete";
import { InferReturnTypeFromSelectStatement, IsSelectStatement } from "./select";

export type InferReturnTypeFromSqlStatement<Query extends string, Tables> =
  IsSelectStatement<Query> extends true
    ? InferReturnTypeFromSelectStatement<Query, Tables>
    : IsDeleteStatement<Query> extends true
      ? ReturnTypeFromDeleteStatement
      : never;
