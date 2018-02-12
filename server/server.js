const express = require ('express');
const bodyParser = require ('body-parser');
const {ObjectID} = require ('mongodb');

const { mongoose } = require ('./db/mongoose');
const {Todo} = require ('./models/todo');
const {User} = require ('./models/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const todo = new Todo ({
    text: req.body.text,
    completed: req.body.completed,
    completedAt: req.body.completedAt
  })
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
})

app.get('/todos', (req, res) => {
    Todo.find().then ((todos) => {
      res.send({
        todos
      })
    }, (e) => {
      res.status(400).send(e);
    });
})

//*****************************************************************
// GET /todos/:id
//
// In this route, first we check for validity of the ID.  If invalid,
// we can immediately terminate the all and return a 404 status code.
// Next we use Todo.findById to search for a matching record.  If not
// found, return 404 status code.  If found, return the document.
// Lastly, we have a catch block to catch any errors that may occur.
//*******************************************************************
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Id format is invalid');
  }
  Todo.findById(id).then((todo)  => {
      if (!todo) {
        res.status(404).send('Record not found');
      } else {
          res.send ({
            todo
          });
      }
    }, (e) => {
      res.status(404).send (e);
    }).catch((e) => res.status(400).send());
})

app.listen (port3000, () => {
  console.log (`Started on port ${port}`);
})

module.exports = {app};
