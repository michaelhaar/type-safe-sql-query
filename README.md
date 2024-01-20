# mysql-to-ts

## Motivation 

[ThePrimeagen](https://twitter.com/ThePrimeagen) (who works at Netflix BTW) recently published some videos about ORMs and SQL:

- [DONT USE AN ORM | Prime Reacts](https://youtu.be/bpGvVI7NM_k?feature=shared)
- [The Only Database Abstraction You Need | Prime Reacts](https://youtu.be/nWchov5Do-o?feature=shared)

He did a quick poll in one of those videos and people seem to choose SQL over ORMs. Approximately 50% of the people who voted chose SQL over and SQL query builders.

![Do you like orms](docs/assets/do-you-like-orms.png)

(Source: [DONT USE AN ORM | Prime Reacts](https://youtu.be/bpGvVI7NM_k?feature=shared))


My guess is this might also be the reason why [Drizzle ORM](https://orm.drizzle.team/) is so popular at the moment because it's main philosophy is: 

> If you know SQL — you know Drizzle.

SQL has been around since the 1970s, and was standardized by the American National Standards Institute (ANSI) in 1986 ([A Brief History of SQL and its Usefulness](https://www.coginiti.co/tutorials/introduction/what-is-sql/#:~:text=SQL%20has%20been%20around%20since,needs%20of%20the%20database%20industry.)). I assume there must be a reason why it's still around after approximately half a century and is still one of the most used databases ([Stackoverflow Survey 2023](https://survey.stackoverflow.co/2023/#databases)), while other software technologies barely survive a decade.

## Existing Tools

I used a lot of ORMs in the past. Coming from Python starting with raw SQL queries, then SQLAlchemy, then Django ORM and then moving to Node.js and using Knex.js, Bookshelf.js, TypeORM, and finally Prisma and Drizzle ORM.

## Pain Points



| Pain Point | Solution |
| ---------- | -------- |
| ORM 
