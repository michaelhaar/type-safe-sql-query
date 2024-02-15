# Do we need an Abstraction for SQL?

## Introduction

[ThePrimeagen](https://twitter.com/ThePrimeagen) (I think he works at Netflix) recently published some videos about ORMs and SQL:

- [DONT USE AN ORM | Prime Reacts](https://youtu.be/bpGvVI7NM_k?feature=shared)
- [The Only Database Abstraction You Need | Prime Reacts](https://youtu.be/nWchov5Do-o?feature=shared)

He did a quick poll in one of those videos and people seem enjoy writing SQL statements, which was a bit surprising to me. Approximately 50% of the people who voted chose SQL over ORMs and SQL query builders.

![Do you like orms](assets/do-you-like-orms.png)
(Source: [DONT USE AN ORM | Prime Reacts](https://youtu.be/bpGvVI7NM_k?feature=shared))

SQL has been around since the 1970s, and was standardized by the American National Standards Institute in 1986 ([A Brief History of SQL and its Usefulness](https://www.coginiti.co/tutorials/introduction/what-is-sql/#:~:text=SQL%20has%20been%20around%20since,needs%20of%20the%20database%20industry.)).

It's astonishing that SQL remains prevalent **nearly half a century later**, maintaining its status as the most used database technology and one of the most employed programming/scripting/markup languages, according to the [Stackoverflow Survey 2023](https://survey.stackoverflow.co/2023/), especially when many other software technologies struggle to endure beyond half a decade.

![so-database-survey-2023](docs/assets/so-survey-2023.png)
(Source: [Stackoverflow Survey 2023](https://survey.stackoverflow.co/2023/))

IMHO these are the main reasons for its success:

- Well-defined and standardized language
- Easy and simple
- High performance

## Landscape of SQL Abstractions

There are many SQL abstractions available, including but not limited to:

- Java:
  - Apache Cayenne, open-source for Java
  - Apache OpenJPA, open-source for Java
  - DataNucleus, open-source JDO and JPA implementation (formerly known as JPOX)
  - Ebean, open-source ORM framework
  - EclipseLink, Eclipse persistence platform
  - Enterprise JavaBeans (EJB)
  - Enterprise Objects Framework, Mac OS X/Java, part of Apple WebObjects
  - Hibernate, open-source ORM framework, widely used
  - Java Data Objects (JDO)
  - JOOQ Object Oriented Querying (jOOQ)
  - Kodo, commercial implementation of both Java Data Objects and Java Persistence API
  - TopLink by Oracle
  - ...
- .Net
  - Base One Foundation Component Library, free or commercial
  - Dapper, open source
  - Entity Framework, included in .NET Framework 3.5 SP1 and above
  - iBATIS, free open source, maintained by ASF but now inactive.
  - LINQ to SQL, included in .NET Framework 3.5
  - NHibernate, open source
  - nHydrate, open source
  - Quick Objects, free or commercial
  - ...
- PHP
  - Laravel, framework that contains an ORM called "Eloquent" an ActiveRecord implementation.
  - Doctrine, open source ORM for PHP 5.2.3, 5.3.X., 7.4.X Free software (MIT)
  - CakePHP, ORM and framework for PHP 5, open source (scalars, arrays, objects); based on database introspection, no class extending
  - CodeIgniter, framework that includes an ActiveRecord implementation
  - Yii, ORM and framework for PHP 5, released under the BSD license. Based on the ActiveRecord pattern
  - FuelPHP, ORM and framework for PHP 5.3, released under the MIT license. Based on the ActiveRecord pattern.
  - Laminas, framework that includes a table data gateway and row data gateway implementations
  - Propel, ORM and query-toolkit for PHP 5, inspired by Apache Torque, free software, MIT
  - Qcodo, ORM and framework for PHP 5, open source
  - QCubed, A community driven fork of Qcodo
  - Redbean, ORM layer for PHP 5, for creating and maintaining tables on the fly, open source, BSD
  - Skipper, visualization tool and a code/schema generator for PHP ORM frameworks, commercial
  - ...
- Python
  - Django, ActiveRecord ORM included in Django framework, open source
  - SQLAlchemy, open source, a Data Mapper ORM
  - SQLObject, open source
  - Storm, open source (LGPL 2.1) developed at Canonical Ltd.
  - Tryton, open source
  - web2py, the facilities of an ORM are handled by the DAL in web2py, open source
  - Odoo – Formerly known as OpenERP, It is an Open Source ERP in which ORM is included.
  - ...
- Ruby
  - iBATIS (inactive)
  - ActiveRecord
  - DataMapper
  - ...
- Rust
  - Diesel, open source
  - seaORM, open source
  - sqlx, open source
  - ...
- Go
  - GORM, open source
  - SQLC, open source
  - SQLX, open source
  - SQLBOILER, open source
  - GORP, open source
  - Beego ORM, open source
  - ...
- Javascript/Typescript
  - Prisma, open source
  - Sequelize, open source
  - TypeORM, open source
  - Objection.js, open source
  - Bookshelf.js, open source
  - Waterline, open source
  - Mikro-ORM, open source
  - Knex.js, open source
  - ...

Used Sources:

- [List of object–relational mapping software](https://en.wikipedia.org/wiki/List_of_object%E2%80%93relational_mapping_software)
- [Comparing the 7 best ORM packages in Go](https://blog.logrocket.com/comparing-orm-packages-go/)
- [Top 22 Rust ORM Projects](https://www.libhunt.com/l/rust/topic/orm)

I counted 60+ SQL abstractions in the list above. I'm sure there are more out there. It's a bit overwhelming, isn't it? Imagine you are a backend developer and you need to switch between different projects, each of which uses a different SQL abstraction. You need to learn the API of each abstraction, and you need to remember the differences between them.

## High level comparison of SQL abstractions

### TypeORM

```typescript
// 1. define entity classes
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;
}

...

// 2. create a connection
const AppDataSource = new DataSource(options);
await AppDataSource.initialize();
const userRepository = AppDataSource.getRepository(User);

...

// 3. Usage
const user = new User();
user.name = "John";
user.age = 30;
await userRepository.save(user);

const users = await userRepository.find({ name: "John" });
```

### Prisma

```prisma
// 1. Create schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int    @id @default(autoincrement())
  name  String
  age   Int
}
```

```typescript
// 2. create a connection
const prisma = new PrismaClient();

...

// 3. Usage
await prisma.user.create({
  data: {
    name: "John",
    age: 30,
  },
});

const users = await prisma.user.findMany({
  where: {
    name: "John",
  },
});
```

### Drizzle

```typescript
// 1. Define schema
const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  age: integer("age"),
});

...

// 2. create a connection
const connection = connect(options);
const db = drizzle(connection);

...

// 3. Usage
await db.insert(users).values({
  name: "John",
  age: 30,
});

const users = await db.select().from(users).where(eq(users.name, "John"));
```

### Knex.js

```javascript
// 1. Create a connection
const knex = require("knex")(options);

...

// 2. Usage
await knex("users").insert({ name: "John", age: 30 });

const users = await knex('users').where({ name: "John" }).;
```

### Kysely

```typescript
// 0. Auto-generate types
type Database = {
  users: {
    id: number;
    name: string;
    age: number;
  };
};

// 1. Create a connection
export const db = new Kysely<Database>(options);

// 2. Usage
await db.insertInto("users").values({ name: "John", age: 30 }).execute();

const users = await db.selectFrom("users").selectAll().where("id", "=", "John").execute();
```

### type-safe-sql-query

```typescript
// 0. Auto-generate types
type Database = {
  users: {
    id: number;
    name: string;
    age: number;
  };
};

// 1. Create a connection
const connection = await mysql.createConnection(options);
async function sqlQuery<S extends string>(
  sql: S,
  params: InferParamsTypeFromSqlStatement<S, Tables>,
): InferReturnTypeFromSqlStatement<S, Tables> {
  const [results] = await connection.query(sql, params);
  return results as any;
}

// 2. Usage
await sqlQuery(`INSERT INTO users (name, age) VALUES (?, ?)`, ["John", 30]);

const users = await sqlQuery(`SELECT * FROM users WHERE name = ?`, ["John"]);
```
