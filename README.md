# mysql-to-ts

- ORMs and SQL Query Builders tend to be leaky abstractions. => Many people prefer writing SQL directly.
- ORMs and SQL Query Builders do not use the database as the source of truth. => Potential schema drift.
- Most ORMs and Query Builders are just wrappers around common packages/drivers like [mysql](https://github.com/mysqljs/mysql), [mysql2](https://github.com/sidorares/node-mysql2), [postgres](https://github.com/porsager/postgres) or [pg](https://node-postgres.com/). => Unnecessary performance/runtime overhead.
- Having a dedicated compilation step that depends on the target platform (e.g., [Prisma](https://www.prisma.io/)) is quite cumbersome. => Unnecessary complexity.

## Goals

I'm trying to build something like this:

![mysql-to-ts](docs/assets/high-level-overview.png)

The goal is to use `mysql-to-ts` like this:

1. Pull table types from a live database
2. Use the type utilities to create a type-safe query

e.g.:

Assuming we have a table called `users` with the following schema:

```sql
CREATE TABLE `users` (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  age int NOT NULL,
);
```

We can use `mysql-to-ts` like this:

```ts
import mysql from "mysql2/promise";
import type { MySqlQueryWrapper } from "mysql-to-ts";

// Create the connection to database
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
});

// Wrap the query function with the type-safe query wrapper
const queryWrapper: MySqlQueryWrapper = (sql, params) => connection.query(sql, params);

// Use the type-safe query wrapper to query the database.
const [users] = await queryWrapper("SELECT * FROM `users` WHERE `name` = ? AND `age` > ?", ["Michael", 36]);

// Input and output types are inferred from the database schema and the sql statement.
// type of users is: { id: number, name: string, age: number }[]
// type of params is: [string, number]
```

<!-- TODO
- A **single source of truth** for the database schema.
- **Type-safe** SQL queries.
- **No runtime overhead**.
- **No ORM**.
- **No SQL query builder**.
- **No API**.
- **No magic**.
- **No leaky abstractions**.
- **No boilerplate**.
- **No dependencies**.
- **No configuration**.
- **No compilation step**.
- **No code generation**. -->

## Motivation: Do we need an Abstraction?

[ThePrimeagen](https://twitter.com/ThePrimeagen) (I think he works at Netflix) recently published some videos about ORMs and SQL:

- [DONT USE AN ORM | Prime Reacts](https://youtu.be/bpGvVI7NM_k?feature=shared)
- [The Only Database Abstraction You Need | Prime Reacts](https://youtu.be/nWchov5Do-o?feature=shared)

He did a quick poll in one of those videos and people seem enjoy writing SQL statements. Approximately 50% of the people who voted chose SQL over ORMs and SQL query builders.

![Do you like orms](docs/assets/do-you-like-orms.png)
(Source: [DONT USE AN ORM | Prime Reacts](https://youtu.be/bpGvVI7NM_k?feature=shared))

Maybe that's also the reason why [Drizzle ORM](https://orm.drizzle.team/) is so popular at the moment (9th Place at [2023 JavaScript Rising Stars](https://risingstars.js.org/2023/en#section-all)) since one of it's main selling points is:

> If you know SQL — you know Drizzle.

SQL has been around since the 1970s, and was standardized by the American National Standards Institute (ANSI) in 1986 ([A Brief History of SQL and its Usefulness](https://www.coginiti.co/tutorials/introduction/what-is-sql/#:~:text=SQL%20has%20been%20around%20since,needs%20of%20the%20database%20industry.)). There must be a good reason why it's still around after approximately **half a century** and is still one of the most used databases according to the [Stackoverflow Survey 2023](https://survey.stackoverflow.co/2023/#databases), while other software technologies barely survive a decade.

![so-database-survey-2023](docs/assets/so-database-survey-2023.png)
(Source: [Stackoverflow Survey 2023](https://survey.stackoverflow.co/2023/#databases))

### 3 Different Classes of Abstraction

ORMs and SQL query builders are an attempt to abstract away the SQL language. Under the hood they are still using SQL to interact with the database.

The [CompSciGuy](https://www.youtube.com/@MrCompSciGuy) did a great job in his video [The Only Database Abstraction You Need](https://youtu.be/tbfKZy7Y1pc?feature=shared) in explaining the 3 classes of query families:

- Query-By-Example
- Query-By-API
- Query-By-Language

### Query-By-Example

TODO: add short and simple example

### Query-By-API

It's just SQL but we call functions instead

TODO: add short and simple example

Typical examples are:

- [Prisma](https://www.prisma.io/)
- [TypeORM](https://typeorm.io/#/)
- [Drizzle](https://orm.drizzle.team/)

### Query-By-Language

TODO: add short and simple example

### A Single Source of Truth?

When developing server code with TypeScript (for example with frameworks like Nextjs, Express, Fastlify or Nestjs), we'll inevitably come up against the question of how to interact with our database.

[Dan Vanderkam](https://twitter.com/danvdk) wrote a great article about [TypeScript and SQL: Six Ways to Bridge the Divide](https://effectivetypescript.com/2023/08/29/sql/).

There's lots of type information in our SQL database (the structure of the tables) and at the time of writing it's challenging to share that type information between the DB and TypeScript.

So you want a single source of truth? Where should it be? In the database or in the TypeScript code?

Most ORMs (like Prisma, TypeORM and Drizzle for example) use TypeScript as the source of truth. We define our models in TypeScript and the ORM generates the types from that. E.g.:

- Prisma uses the `schema.prisma` file which is used by a compiler,
- Drizzle uses the `pgSchema` object for declaring SQL schemas,
- and TypeORM uses `Entities` which are classes that map to a database tables.

In contrast to the choices made by the ORMs mentioned above, I think it's quite obvious that the database should be the source of truth. It's the only place where the data is stored and TypeScript is a consumer of that data and thus should infer the types from the database.

## Why MySQL?

You might ask yourself why I chose MySQL as the main SQL dialect for this project. The reasons are simple:

- I'm most familiar with MySQL,
- it's second most popular database according to the [Stackoverflow Survey 2023](https://survey.stackoverflow.co/2023/#databases),
- [PlanetScale](https://planetscale.com/) is using it,
- I'm using it in a current project and we are not happy with the current ORM we're using.

## Why Open Source?

See:

- [Why do Open Source](https://www.youtube.com/shorts/lMlhkWYe5qc)
- [Don't Contribute to Open Source](https://youtu.be/5nY_cy8zcO4?feature=shared)

TLDR: I had a pain point and I wanted to solve it. I'm not sure if this is the best solution but I'm willing to give it a try.
