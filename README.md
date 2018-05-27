# ToDo-App
A basic To-Do app built with Node using ExpressJS, Nunjucks, and PostrgeSQL

### Prerequisites
- Node.js v8.x
- PostgreSQL running with a database named `todo`
 
### Installing
```
npm install express nunjucks pg-promise body-parser
```
Create the `tasks` table:                                                                                 
```
CREATE TABLE task (
  id serial PRIMARY KEY,
  title varchar,
  description varchar,
  done boolean DEFAULT FALSE
);
```
