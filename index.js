const express = require('express');
const nunjucks = require('nunjucks');
const body_parser = require('body-parser');
const pgp = require('pg-promise')({});
const db = pgp({
  database: 'todo',
  user: 'postgres'
});

var app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});
app.use(body_parser.urlencoded({
  extended: false
}));
app.use(express.static('public'));

app.get('/todos', function(request, response, next) {
  const mylist = [];
  db.any('SELECT * FROM task WHERE done = FALSE')
    .then(function(results) {
      results.forEach(function(r) {
        mylist.push(r);
      });
      response.render('todos.html', {
        title: 'All Entries',
        results: mylist
      });
    })
    .catch(next);
});

app.get('/todos/add', function(request, response, next) {
  response.render('new.html', {title: 'New Entry'});
});

app.post('/submit', function(request, response, next) {
  var attr = {
    title: request.body.title,
    description: request.body.description
  };
  var q = "INSERT INTO task VALUES(default, ${title}, ${description})"
  db.one(q, attr)
    .then(function(result) {
      console.log(result);
    })
    .catch(next);
  response.redirect('/todos');
});

app.get('/todo/done/:id', function(request, response, next) {
  var id = request.params.id;
  var q = "UPDATE task SET done = 'TRUE' WHERE id = $1";
  db.one(q, [id])
    .then(function(result) {
      console.log(result);
    })
    .catch(next);
  response.redirect('/todos');
});

app.listen(8080, function() {
  console.log('Listening on port 8080');
});