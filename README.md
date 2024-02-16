# type-safe-sql-query

<div align="center">
  <img src="docs/assets/interim_logo.png" width="200px" alt="type-safe-sql-query logo" />
  <h3>Bridging the Gap Between SQL and TypeScript Types</h3>
  <p>Write traditional SQL queries with an added layer of reliability and scalability.</p>
  <!-- <a href="https://codesandbox.io/p/devbox/type-safe-sql-query-demo-9g7dly?layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522cls3bnup100063b6h1wdkn9p6%2522%252C%2522sizes%2522%253A%255B70%252C30%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522cls3bnup100023b6htvz9kv1b%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522cls3bnup100043b6hhpkd4mhz%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522cls3bnup100053b6hke9t9lg9%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B100%252C0%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522cls3bnup100023b6htvz9kv1b%2522%253A%257B%2522id%2522%253A%2522cls3bnup100023b6htvz9kv1b%2522%252C%2522tabs%2522%253A%255B%255D%257D%252C%2522cls3bnup100053b6hke9t9lg9%2522%253A%257B%2522id%2522%253A%2522cls3bnup100053b6hke9t9lg9%2522%252C%2522tabs%2522%253A%255B%255D%257D%252C%2522cls3bnup100043b6hhpkd4mhz%2522%253A%257B%2522id%2522%253A%2522cls3bnup100043b6hhpkd4mhz%2522%252C%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522cls3ctta3002o3b6hlhau0ka9%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522TERMINAL%2522%252C%2522shellId%2522%253A%2522cls3cttbn001idaga9v5y33ck%2522%257D%255D%252C%2522activeTabId%2522%253A%2522cls3ctta3002o3b6hlhau0ka9%2522%257D%257D%252C%2522showDevtools%2522%253Afalse%252C%2522showShells%2522%253Atrue%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D">Try now</a> •
  <a href="#features">Features</a> •
  <a href="/">Docs</a> •
  <a href="/#roadmap--current-status">Roadmap</a> •
  <a href="/">FAQ</a> -->
</div>

## About

`type-safe-sql-query` provides two well-tested util types

- `InferReturnTypeFromSqlStatement`
- `InferParamsTypeFromSqlStatement`

that allow us to automatically infer the return type and the parameter type of a SQL statement. e.g.:

```ts
type T0 = InferReturnTypeFromSqlStatement<"SELECT * FROM users", Tables>;
// => { id: number, name: string, age: number, email: string }[]
```

Feel free to be creative and use them however you like.

[![Try Now](docs/assets/try_now.png)](https://codesandbox.io/p/devbox/type-safe-sql-query-demo-9g7dly?layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522cls3bnup100063b6h1wdkn9p6%2522%252C%2522sizes%2522%253A%255B70%252C30%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522cls3bnup100023b6htvz9kv1b%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522cls3bnup100043b6hhpkd4mhz%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522cls3bnup100053b6hke9t9lg9%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B100%252C0%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522cls3bnup100023b6htvz9kv1b%2522%253A%257B%2522id%2522%253A%2522cls3bnup100023b6htvz9kv1b%2522%252C%2522tabs%2522%253A%255B%255D%257D%252C%2522cls3bnup100053b6hke9t9lg9%2522%253A%257B%2522id%2522%253A%2522cls3bnup100053b6hke9t9lg9%2522%252C%2522tabs%2522%253A%255B%255D%257D%252C%2522cls3bnup100043b6hhpkd4mhz%2522%253A%257B%2522id%2522%253A%2522cls3bnup100043b6hhpkd4mhz%2522%252C%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522cls3ctta3002o3b6hlhau0ka9%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522TERMINAL%2522%252C%2522shellId%2522%253A%2522cls3cttbn001idaga9v5y33ck%2522%257D%255D%252C%2522activeTabId%2522%253A%2522cls3ctta3002o3b6hlhau0ka9%2522%257D%257D%252C%2522showDevtools%2522%253Afalse%252C%2522showShells%2522%253Atrue%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D)

## Articles

Please check out our articles

- especially if you are **unsure whether you want to use an ORM or raw SQL**?
- or want to learn more about the motivation and the background of this project?

Articles:

- [Handling remote data - What scales well and what doesn't](/docs/handling-remote-data.md)
- [Do we need an Abstraction for SQL?](/docs/do-we-need-an-abstraction-for-sql.md)

## Features

- ✅ **Automatic type inference** from SQL statements.
- ✅ **No compilation** step
- ✅ **No runtime overhead**. 🏎️
- ✅ **No new language or API**. 🧠
- ✅ **Zero dependencies.**
- ✅ Minimalistic and **easy to use**.
- ✅ **Well-tested**
- ✅ MIT License

## Roadmap / Current Status

> ⚠️ Please note that this project is in a very early stage and is not yet ready for production use.

The MVP of this project is to support basic CRUD operations on a single table. The following is a list features that are already implemented or are planned to be implemented.

Legend:

- 📝: Planned
- 🏗️: In Progress
- ✅: Done

### InferReturnTypeFromSqlStatement

| Feature                         | Status |
| ------------------------------- | ------ |
| Support for `INSERT` statements | ✅     |
| Support for `UPDATE` statements | ✅     |
| Support for `DELETE` statements | ✅     |
| Support for `SELECT` statements | 🏗️     |

### InferParamsTypeFromSqlStatement

| Feature                         | Status |
| ------------------------------- | ------ |
| Support for `INSERT` statements | ✅     |
| Support for `UPDATE` statements | ✅     |
| Support for `DELETE` statements | ✅     |
| Support for `SELECT` statements | 🏗️     |

For more details please check the source code and the test files.

## Installation

```bash
npm install -D type-safe-sql-query

# or
yarn add -D type-safe-sql-query

# or
pnpm add -D type-safe-sql-query
```

## Basic Usage

The following examples demonstrates how to use `type-safe-sql-query` with MySQL.

```ts
import type { InferReturnTypeFromSqlStatement, InferParamsTypeFromSqlStatement } from "type-safe-sql-query";
import type { Tables } from "./tables";

type Result = InferReturnTypeFromSqlStatement<"SELECT * FROM users WHERE name = ? AND age > ?", Tables>;
// Result is: { id: number, name: string, age: number, email: string }[]

type Params = InferParamsTypeFromSqlStatement<"SELECT * FROM users WHERE name = ? AND age > ?", Tables>;
// Params is: [string, number]

type ResultWithAlias = InferReturnTypeFromSqlStatement<"SELECT name AS fullName, age FROM Users", Tables>;
// ResultWithAlias is: { fullName: string, age: number }[]
```

The examples above assumes that we have a file called `tables.ts` that contains the type information of our database tables. This file should be auto-generated with [schemats](https://github.com/sweetiq/schemats) for example.

```ts
// tables.ts (auto-generated with schemats)

export type Tables = {
  users: {
    id: number;
    name: string;
    age: number;
    email: string;
  };
  // ...
};
```

### Usage with Low Level Database Drivers

The following example demonstrates how to use `type-safe-sql-query` with the [mysql2](https://github.com/sidorares/node-mysql2) driver.

```ts
import mysql from "mysql2/promise";
import type { InferParamsTypeFromSqlStatement, InferParamsFromSqlStatement } from "type-safe-sql-query";
import type { Tables } from "./tables";

// Create the connection to database
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
});

// Create a type-safe query wrapper
async function query<S extends string>(
  sql: S,
  params: InferParamsTypeFromSqlStatement<S, Tables>,
): InferReturnTypeFromSqlStatement<S, Tables> {
  const [results] = await connection.query(sql, params);
  return results as any;
}

// Use the type-safe query wrapper to query the database.
const users = await query("SELECT * FROM users WHERE name = ? AND age > ?", ["Michael", 36]);
```

Other low level database drivers like [mysql](https://github.com/mysqljs/mysql), [postgres](https://github.com/porsager/postgres) or [pg](https://node-postgres.com/) should work similarly.
