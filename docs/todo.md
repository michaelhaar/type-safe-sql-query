# Handling remote data - What scales well and what doesn't

> Handling remote data seems to be the holy grail of modern web development. - Theo? TODO: Find a quote

Fetching data from a remote computer is a common task although it can be quite complex.

## Lessons Learned from the History

> Please note that handling remote data is traditionally expressed as simple strings without type checking at compile/dev time or IntelliSense support (e.g.: JSON, SQL, ...) and therefore similar to the problem described in this section.

Let's start by looking at handling data at a single application on a single machine.

Let's assume we have a loosely typed programming language like JavaScript and have the requirement to print a list of hobbies of a user. The data might look like this:

```js
const data = {
  name: "Michael",
  age: 32,
  hobbies: ["programming", "reading", "snowboarding"],
};
```

In a small application where we are the only developer, this is fine. We can easily handle this data like this:

```js
function printHobbies(data) {
  data.hobbies.forEach((hobby) => console.log(hobby));
}
```

The Problem arises when the size of the application grows, 10+ developers are working on the same codebase and there's a lot of change happening.

Let's also assume the data definition is 100 files away from the print function that we should implement. How can we as a developer know what the data looks like?

> We might search/look for the definition of the `data` variable in the source code or run a `console.log(data)` to see what it looks like.

But we'll quickly realize that there are a few problems with this approach:

- What if the definition of the `data` is hard to find?
- How long does it take to find out what the `data` looks like?
- What if it's passed through 10 functions before it reaches the `printHobbies` function. Is it still the same data?
- What if there are some changes to the definition or to one of those 10 functions that might be mutating the `data` variable. How do we know that we need to update our function?

We might mitigate the problems above by using some best practices like:

- using a more descriptive variable and function names like `user` instead of `data` and `printUserHobbies` instead of `printHobbies`.
- add some comments to the `printHobbies` function that says what the `data` looks like.
- check the arguments of the `printHobbies` function and throw an error if it's not the expected type.
- add some tests to the `printHobbies` function that checks if it works required.

But these are not good solutions. They are not reliable, not scalable and introduce a lot of overhead that needs to be maintained.

As the demand for more complex applications grew, we needed to find a way to handle data in a more reliable and scalable way!

The industry has come up with a solution to this problem. It's called **Type System**.

## The Importance of a Type System

I assume most readers are familiar with the concept of a type system. But for those who are not, here's concise summary of the definition:

> A type system is a set of rules that assigns a property called type to the various constructs of a computer program, such as variables, expressions, functions or modules. The main purpose of a type system is to reduce possibilities for bugs in computer programs by defining interfaces between different parts of a computer program, and then checking that the parts have been connected in a consistent way. see [Wikipedia](https://en.wikipedia.org/wiki/Type_system)

The crucial part for our problem is "defining interfaces between different parts of a computer program, and then checking that the parts have been connected in a consistent way".

Circling back to the problem stated above, we can use Typescript in order make it more reliable and scalable.

```ts
type User = {
  name: string;
  age: number;
  hobbies: string[];
};

const user = {
  name: "Michael",
  age: 32,
  hobbies: ["programming", "reading", "snowboarding"],
} satisfies User;

// ...

// somewhere else in our codebase (100 files away)
function printUserHobbies(user: User) {
  user.hobbies.forEach((hobby) => console.log(hobby));
}
```

Luckily for us this solves all problems mentioned before:

- We can easily know what the `user` object looks like by looking at the `User` type.
  - Hover over `User` in your IDE to see the definition
- When making changes the TS compiler will tell us (to a certain extent) what we need to update.
- Acceptable amount of overhead/boilerplate.
  - We don't need to add and maintain comments to this simple `printUserHobbies` function.
  - We don't need to add and maintain tests for this simple use case.
    - In this case TS gives us more than enough confidence that it works as required.

> Type-systems allow us to write more reliable and scalable code.

## Takeaways for Handling Remote Data

Now back to our original problem. What does this mean for our problem of handling remote data?

As developers we are constantly being asked by our stakeholders and users to build more complex applications and with that the demand for remote data is also growing (aka more API endpoints). Just to give you an idea of what I mean:

- I'm currently working on a rather small customer project.
- Approx 10-15 developers are working on the same codebase.
- We have a MySql database with approx. 200 tables.
- The backend is an Express.js server with approx. 200 REST-ish endpoints and approx. half a million lines of JavaScript code.
- Keeping everything working as expected is very challenging, especially when facing constant changes in various parts of the application and people coming and going.
- In essence we are facing the some problems as described in the example above but on a much larger scale.
  - What does the data look like?
  - How long does it take to find out what the data looks like?
  - What happens if we change something? How do we know if we need to update something?
  - Add documentation, tests, ... to mitigate the problems above.
- Having a type system across the whole codebase would help us to write more reliable and scalable code.

As mentioned at the beginning of this article, handling remote data is traditionally expressed as simple strings without type checking at compile/dev time or IntelliSense support (e.g.: JSON, SQL, ...) and therefore introduces the problems described in this article.

The industry noticed this problem and came up with a few solutions

- Client <-> Server interaction
  - tRPC
  - GraphQL
  - REST with OpenAPI
  - ...

Looks good! But what about the server <-> database interaction?

Basically there are 3 (maybe 4) ways to interact with a SQL database from a server:

- using Language Integrated Query (LINQ)
- using an ORM
  - without type-safety: Bookshelf, ...
  - with type-safety: Prisma, Drizzle, TypeORM, Sequelize, ...
- using a query builder
  - without type-safety: Knex, ...
  - with type-safety: Kysely, ...
- using a raw SQL:
  - without type-safety: [mysql](https://github.com/mysqljs/mysql), [mysql2](https://github.com/sidorares/node-mysql2), [postgres](https://github.com/porsager/postgres), [pg](https://node-postgres.com/), ...
  - with type-safety: type-safe-sql-query, (Are there others?)

## Conclusion

type-safe-sql-query enables us to write traditional SQL queries with an added layer of reliability and scalability.
