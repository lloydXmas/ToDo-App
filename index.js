const express = require('express');
const nunjucks = require('nunjucks');
const body_parser = require('body-parser');
const pgp = require('pg-promise')({});
const db = pgp({database: 'todo', user: 'postgres'});

var app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});
app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());
app.use(express.static('public'));

app.get('/todos', function (request, response, next) {
  db.any('SELECT * FROM task')
   .then(function (results) {
     response.send(results);
   })
   .catch(next);
   response.render('todos.html');
});

 app.get('/todos/add', function (request, response, next) {
   response.render('new.html');
 });

app.post('/submit', function (request, response, next) {
  var attr = {
    title: request.body.title,
    description: request.body.description
  };
  var q = "INSERT INTO task VALUES(default, ${title}, ${description})"
  db.one(q, attr)
  .then(function (result) {
    console.log(result);
  })
  .catch(next);
  response.redirect('/todos');
});

app.get('/todo/done/:id', function (request, response, next) {
  var slug = request.params.slug;
  var q = "UPDATE task SET done = 'FALSE' WHERE id = $1, [slug]";
  db.result(q)
  .then(function (result) {
    console.log(result);
  })
  .catch(next);

  response.redirect('/todos.html');

});

app.listen(8080, function () {
  console.log('Listening on port 8080');
});