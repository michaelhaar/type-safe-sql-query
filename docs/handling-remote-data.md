# Handling remote data - What scales well and what doesn't

> TLDR; Use a type system to handle remote data. It makes your code more reliable and scalable.

Fetching and working with data from a remote computer/server is a very common task in modern web development as such doing it "right" is reeeeeeally important!

BTW "right" is whatever works best for your use case. There are many ways to handle remote data and each has its own trade-offs (like everything in software engineering). This article describes my lessons learned.

## Lessons Learned from the History

> Please note that handling remote data is traditionally expressed as simple strings without type checking at compile/dev time or IntelliSense support (e.g.: JSON, SQL, ...) and therefore similar to the problem described in this section.

Let's start by looking at handling data in a single application on a single machine.

Let's assume we have a loosely typed programming language like JavaScript for example and the requirements is to print a list of hobbies of a user. The data might look like this:

```js
const data = {
  name: "Michael",
  age: 32,
  hobbies: ["programming", "reading", "snowboarding"],
};
```

In in our small little DIY Indie hacker project, we might simply implement the `printHobbies` function like this:

```js
function printHobbies(data) {
  data.hobbies.forEach((hobby) => console.log(hobby));
}
```

This works well for a small application and as long as we're the only developer working on it.

Great!

But what happens when the application grows? Lets assume we want to implement the same trivial functionality in a bigger application and for the sake of the argument let's assume the following:

- We are working on a Node.js server backend
  - approx. 200 db tables
  - approx. 200 REST-ish endpoints
  - approx. half a million lines of JavaScript code
  - 1000+ files
- 15+ developers are working on the same codebase and there's a lot of change happening.
- Real users are using the application, time pressure from management and we must not break anything.
- There's a lot of "space" and code between the `data` definition and it's usage in the `printHobbies` function.
  - The `data` definition `const data = ...` is on the other end of the codebase. (1000+ files away)
  - `data` is passed through 10+ functions before it reaches our `printHobbies` function.

How can we as a developer know what the `data` looks like when it reaches our `printHobbies` function?

> We might search/look for the definition of the `data` variable in the source code or run a `console.log(data)` to see what it looks like. Right?

But we'll quickly realize that there are a few problems with this approach:

- What if the `data` definition is hard to find?
- How long does it take to find out what the `data` looks like?
- Assuming we used a `console.log`: Does the `data` always look look like that? (Variants?)
- Assuming we figured out what the `data` looks like:
  - What if one of the 10 functions that `data` passes through is mutating the `data` variable?
  - What if someone in the future changes the definition of the `data` variable?
  - What if someone in the future changes one of those 10 functions that might be mutating the `data` variable. How does he know that he needs to update our function?

We might mitigate the problems above by using some best practices like:

- using a more descriptive variable and function name like `user` instead of `data` and `printUserHobbies` instead of `printHobbies`.
- add some comments to the `printHobbies` function in order to describe what the expected `data` param looks like.
- check the arguments of the `printHobbies` function and throw a runtime error if it's not the expected type.
- add some tests to the `printHobbies` function to make sure that our function is still working.

But these are not good solutions at all. They are not reliable, not scalable and introduce a lot of overhead that needs to be maintained manually.

With the rising demand for more complex applications, we developers had to find a way to handle data in a more reliable and scalable way. Thankfully the industry has come up with a solution for this problem.

It's called **Type System**.

## The Importance of a Type System

I assume most readers are already familiar with the concept of a type system. But for those who are not, here's concise summary of the definition:

> A type system is a set of rules that assigns a property called type to the various constructs of a computer program, such as variables, expressions, functions or modules. The main purpose of a type system is to reduce possibilities for bugs in computer programs by defining interfaces between different parts of a computer program, and then checking that the parts have been connected in a consistent way. see [Wikipedia](https://en.wikipedia.org/wiki/Type_system)

The crucial part for us is "defining interfaces between different parts of a computer program, and then checking that the parts have been connected in a consistent way". This is exactly what we need!

Circling back to the problem stated above, using something like Typescript makes our code more reliable and scalable, while adding an acceptable amount of overhead.

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

Luckily for us this solves all of the problems mentioned earlier:

- We can **immediately find out what the `user` object looks** like by hovering the `User` type in our IDE.
- When making changes the TS compiler will **show us (to a certain extent) the other parts of our codebase that need to be updated**.
- **No need to add and maintain comments** to this trivial `printUserHobbies` function.
- **No need to add and maintain tests** for this simple use case.
  - In this case TS gives us more than enough confidence that it works as required.

No more questions like:

- What does the data look like?
- How long does it take to find out what the data looks like?
- What happens if we change something? How do we know if we need to update anything else?
- Add documentation, tests, ... to mitigate the problems above.

**Type-systems allow us to write more reliable and scalable code.**

Awesome!

## Transferring the Knowledge to Handling Remote Data

Now back to our original problem. How can we apply our learnings for loosely typed programming languages to handling remote data?

We developers are constantly being asked by our management and users to build more complex applications and with that the demand for remote data is steadily growing.
As mentioned at the beginning, handling remote data is traditionally expressed as simple strings without type checking at compile/dev time or IntelliSense support (e.g.: JSON, SQL, ...) and therefore introduces the exact same problems as highlighted in this article.

Of course our developer community noticed this problem and came up with a few solutions

- Client <-> Server interaction
  - tRPC
  - GraphQL
  - REST with OpenAPI
  - ...

Looks good! But what about the server <-> database interaction?

AFAIK there are approximately 4 ways to interact with a SQL database from a server:

- using a Language Integrated Query (LINQ) => not available in JavaScript
- using an ORM
  - without TS: Bookshelf, ...
  - with TS: Prisma, Drizzle, TypeORM, Sequelize, ...
- using a query builder
  - without TS: Knex, ...
  - with TS: Kysely, ...
- using a raw SQL:
  - without TS: [mysql](https://github.com/mysqljs/mysql), [mysql2](https://github.com/sidorares/node-mysql2), [postgres](https://github.com/porsager/postgres), [pg](https://node-postgres.com/), ...
  - with TS: type-safe-sql-query, (Any others??)

## Summary

- Use a type system to handle remote data. It makes your code more reliable and scalable.
- type-safe-sql-query enables us to write traditional SQL queries with an added layer of reliability and scalability.
