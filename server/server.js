require ('./config/config');    // Sets up the environment variables for PORT and MONGODB_URI

//console.log ('DB **** ', process.env.MONGODB_URI);
//console.log ('PORT **** ', process.env.PORT);

const _ = require('lodash');
const express = require ('express');
const bodyParser = require ('body-parser');
const {ObjectID} = require ('mongodb');

const { mongoose } = require ('./db/mongoose');
const {Todo} = require ('./models/todo');
const {User} = require ('./models/user');

const app = express();
const port = process.env.PORT;

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

app.post('/users', (req, res) => {
  const user = new User ({
    email: req.body.email,
  })
  user.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
})

app.get('/todos', (req, res) => {
    Todo.find().then ((todos) => {
      if (todos.length==0) {
        return res.send ('There are no Todos available!')
      }
      else res.send({
        todos
      })
    }, (e) => {
      res.status(400).send(e);
    });
})

app.get('/users', (req, res) => {
    User.find().then ((users) => {
      if (users.length==0) {
        return res.send ('There are no records available!')
      }
      else res.send({
        users
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
        res.status(404).send('Todo Record not found');
      } else {
          res.send ({
            todo
          });
      }
    }, (e) => {
      res.status(404).send (e);
    }).catch((e) => res.status(400).send());
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
app.get('/users/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Id format is invalid');
  }
  User.findById(id).then((user)  => {
      if (!user) {
        res.status(404).send('User record not found');
      } else {
          res.send ({
            user
          });
      }
    }, (e) => {
      res.status(404).send (e);
    }).catch((e) => res.status(400).send());
})

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Id format is invalid');
  }
  Todo.findByIdAndRemove(id).then((todo)  => {
      if (!todo) {
        res.status(404).send('Todo Record not found');
      } else {
          res.send ({
            status: "Deleted",
            todo: todo
          });
      }
    }, (e) => {
      res.status(404).send (e);
    }).catch((e) => res.status(400).send());
})

app.delete('/users/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Id format is invalid');
  }
  User.findByIdAndRemove(id).then((user)  => {
      if (!user) {
        res.status(404).send('User Record not found');
      } else {
          res.send ({
            status: "Deleted",
            user: user
          });
      }
    }, (e) => {
      res.status(404).send (e);
    }).catch((e) => res.status(400).send());
})

app.get('/*', (req, res) => {
  res.send ({resp: "Have a nice day!"})
  //  .catch((e) => console.log (e));
})

// Update route.
app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  //console.log ("Patching ", id);
  // We need to use lodash to parse the request body for fields to update
  // we will ignore all other fields even if specified.
  const body = _.pick(req.body, ['text', 'completed']); // only these are allowed

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Id format is invalid');
  }

  // before we update a record, we need to check the values passed in. We will
  // update completed iff it is a boolean and set to true.  Otherwise we will
  // set completed to false, and get rid of completedAt even if supplied.
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  // Now that body has the necessary fields, we can run find and update
  Todo.findByIdAndUpdate (id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch ((e) => {
    return res.status(400).send();
  })
})

app.listen (port, () => {
  console.log (`Started on port ${port}`);
})

module.exports = {app};
