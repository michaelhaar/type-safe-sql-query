export type ExtractTableName<Query extends string> = Query extends `select ${infer _Columns} from ${infer TableName}`
  ? TableName
  : Query extends `SELECT ${infer _Columns} FROM ${infer TableName}`
    ? TableName
    : never;

export type GetTableType<Query extends string, Tables> = Tables[ExtractTableName<Query> extends keyof Tables
  ? ExtractTableName<Query>
  : never];
