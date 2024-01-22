export type ExtractTableName<Query extends string> = Query extends `select ${infer _Columns} from ${infer TableName}`
  ? TableName
  : Query extends `SELECT ${infer _Columns} FROM ${infer TableName}`
    ? TableName
    : never;

type ExtractColumns<Query extends string> = Query extends `select ${infer Columns} from ${infer _TableName}`
  ? Columns
  : Query extends `SELECT ${infer Columns} FROM ${infer _TableName}`
    ? Columns
    : never;

export type GetTableType<Query extends string, Tables> = Tables[ExtractTableName<Query> extends keyof Tables
  ? ExtractTableName<Query>
  : never];

type Split<S extends string, Delimiter extends string> = S extends `${infer T}${Delimiter}${infer U}`
  ? [T, ...Split<U, Delimiter>]
  : [S];

type MapColumnsToTypes<Table, Columns> = Columns extends "*"
  ? Table
  : Columns extends string
    ? Pick<Table, Extract<keyof Table, Split<Columns, ", ">[number]>>
    : never;

export type InferReturnTypeFromSelect<Query extends string, Tables> = MapColumnsToTypes<
  GetTableType<Query, Tables>,
  ExtractColumns<Query>
>;
