import { IsDeleteStatement, ReturnTypeFromDeleteStatement } from "./delete";
import { IsInsertStatement, ReturnTypeFromInsertStatement } from "./insert";
import { InferReturnTypeFromSelectStatement, IsSelectStatement } from "./select";
import { IsUpdateStatement, ReturnTypeFromUpdateStatement } from "./update";

export type InferReturnTypeFromSqlStatement<Query extends string, Tables> =
  IsSelectStatement<Query> extends true
    ? InferReturnTypeFromSelectStatement<Query, Tables>
    : IsDeleteStatement<Query> extends true
      ? ReturnTypeFromDeleteStatement
      : IsInsertStatement<Query> extends true
        ? ReturnTypeFromInsertStatement
        : IsUpdateStatement<Query> extends true
          ? ReturnTypeFromUpdateStatement
          : never;
