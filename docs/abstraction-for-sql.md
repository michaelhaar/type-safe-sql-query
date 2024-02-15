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

## Comparison

The following examples illustrate why maybe we don't need an abstraction for SQL.

### Raw SQL

```sql
-- Create
INSERT INTO users (name, age) VALUES ('John', 30);

-- Read
SELECT * FROM users WHERE name = 'John' AND age < 40;

-- Update
UPDATE users SET age = 31 WHERE name = 'John';

-- Delete
DELETE FROM users WHERE name = 'John';
```

### type-safe-sql-query

```typescript
// Create
await sql(`INSERT INTO users (name, age) VALUES (?, ?)`, ["John", 30]);

// Read
const users = await sql(`SELECT * FROM users WHERE name = ? AND age < ?`, ["John", 40]);

// Update
await sql(`UPDATE users SET age = ? WHERE name = ?`, [31, "John"]);

// Delete
await sql(`DELETE FROM users WHERE name = ?`, ["John"]);
```

### TypeORM

```typescript
// Create
const user = new User();
user.name = "John";
user.age = 30;
await userRepository.save(user);

// Read
const users = await userRepository.find({ name: "John": age: LessThan(40) });

// Update
const userToUpdate = await userRepository.findOneBy({
  name: "John",
});
userToUpdate.age = 31;
await userRepository.save(userToUpdate);

// Delete
const userToDelete = await userRepository.findOneBy({
  name: "John",
});
await userRepository.remove(userToDelete);
```

### Prisma

```typescript
// Create
await prisma.user.create({
  data: {
    name: "John",
    age: 30,
  },
});

// Read
const users = await prisma.user.findMany({
  where: {
    name: "John",
    age: {
      lt: 40,
    },
  },
});

// Update
await prisma.user.update({
  where: {
    name: "John",
  },
  data: {
    age: 31,
  },
});

// Delete
await prisma.user.delete({
  where: {
    name: "John",
  },
});
```

### Drizzle

```typescript
// Create
await db.insert(users).values({
  name: "John",
  age: 30,
});

// Read
const users = await db
  .select()
  .from(users)
  .where(and(eq(users.name, "John"), lt(users.age, 40)));

// Update
await db.update(users).set({ age: 31 }).where(eq(users.name, "John"));

// Delete
await db.delete(users).where(eq(users.name, "John"));
```

### Knex.js

```javascript
// Create
await knex("users").insert({ name: "John", age: 30 });

// Read
const users = await knex("users").where({ name: "John" }).andWhere("age", "<", 40);

// Update
await knex("users").where({ name: "John" }).update({ age: 31 });

// Delete
await knex("users").where({ name: "John" }).del();
```

### Kysely

```typescript
// Create
await db.insertInto("users").values({ name: "John", age: 30 }).execute();

// Read
const users = await db.selectFrom("users").selectAll().where("id", "=", "John").where("age", "<", 40).execute();

// Update
await db.update("users").set({ age: 31 }).where("id", "=", "John").execute();

// Delete
await db.deleteFrom("users").where("id", "=", "John").execute();
```

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
