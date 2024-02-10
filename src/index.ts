import { InferParamsTypeFromDeleteStatement, IsDeleteStatement, ReturnTypeFromDeleteStatement } from "./delete";
import { InferParamsTypeFromInsertStatement, IsInsertStatement, ReturnTypeFromInsertStatement } from "./insert";
import { InferParamsTypeFromSelectStatement, InferReturnTypeFromSelectStatement, IsSelectStatement } from "./select";
import { InferParamsTypeFromUpdateStatement, IsUpdateStatement, ReturnTypeFromUpdateStatement } from "./update";

export type InferReturnTypeFromSqlStatement<Query extends string, Tables> =
  IsSelectStatement<Query> extends true ? InferReturnTypeFromSelectStatement<Query, Tables>
  : IsDeleteStatement<Query> extends true ? ReturnTypeFromDeleteStatement
  : IsInsertStatement<Query> extends true ? ReturnTypeFromInsertStatement
  : IsUpdateStatement<Query> extends true ? ReturnTypeFromUpdateStatement
  : never;

export type InferParamsTypeFromSqlStatement<Query extends string, Tables> =
  IsSelectStatement<Query> extends true ? InferParamsTypeFromSelectStatement<Query, Tables>
  : IsDeleteStatement<Query> extends true ? InferParamsTypeFromDeleteStatement<Query, Tables>
  : IsInsertStatement<Query> extends true ? InferParamsTypeFromInsertStatement<Query, Tables>
  : IsUpdateStatement<Query> extends true ? InferParamsTypeFromUpdateStatement<Query, Tables>
  : never;
