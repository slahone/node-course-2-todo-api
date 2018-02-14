const expect = require ('expect');
const request = require ('supertest');
const {ObjectID} = require('mongodb');

const {app} = require ('./../server');
const {Todo} = require ('./../models/todo');
const {User} = require ('./../models/user');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}];

const users = [{
  _id: new ObjectID(),
  email: 'FirstUserEmail@someserver.com'
}, {
  _id: new ObjectID(),
  email: 'SecondUserEmail@someserver.com'
}];

//************************************************************
// This will ensure the Todos collection is cleared out before
// each test run. After  that, insert a known set of records.
//*************************************************************
beforeEach((done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos);
  }).then(() => done());
})

// beforeEach((done) => {
//   User.remove({}).then(() => {
//     User.insertMany(users);
//   }).then(() => done());
// })

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test todo text';

    // supertest function.  POST using the "localhost:3000/todos" url
    // sends an object with text set as above.  the complted and
    // completedAt fields are not defined.  The expected status returned
    // is 200.  The res object returns the record, which should have a
    // body with text set as above, so expect(res.body.text).toBe(text).
    // This test needs to be encapsulated inside another expect(res) which
    // tests that a result object res was actually returned.
    request(app)                            // run app to listen on port 3000
      .post('/todos')                       // create a post request
      .send({text})                         // in the post request, send object {text} above as body
      .expect(200)                          // returned status is 200
      .expect((res) => {                    // a result is actually returned
        expect(res.body.text).toBe(text);   // body of result contains text and has the text avalue above
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        // After the test is run, we check the database for correct results
        // First find all records in the collection that match the text specified,
        // there should be only one matching record returned from find.
        // Then check the text field in the first record, should be text as above.
        // if everything checks out, test was successful, call sone. If not,
        // error will be caught in catch section. call done with error parm.
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done (e));
      })
  });

  it('should not create a new todo if invalid body supplied', (done) => {
    const text = '';
    request(app)                            // run app to listen on port 3000
      .post('/todos')                       // create a post request
      .send({})                             // in the post request, send object {text} above as body
      .expect(400)                          // should return status 400 this test since there is no body
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {       // check that a new record was not created in the db.
          expect (todos.length).toBe(2);    // length should be 2
          done();
        }).catch((e) => done(e));
      })
    })
});

// testing get route.  There is no reason to test the results for errors here
// so we do not need the end(err, res) statement.  A simple end (done) does it.
describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
    })
});

describe('GET /todos/:id', () => {
  it ('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  })
  it ('should return 404 for non-object ids', (done) => {
    request(app)
    .get(`/todos/123456`)
    .expect(404)
    .end(done);
  })
  it ('should return 404 for unavailable ids', (done) => {
    const hexId = new ObjectID().toHexString();
    request(app)
    .get(`/todos/${hexId}`)
    .expect(404)
    .end(done);
  })

})

// testing a delete operation. We create the test entries earlier
// So now we can use the ID from those to delete one of them.
describe('DELETE /todos/:id', () => {
  it ('should remove a todo doc', (done) => {
    const hexID = todos[0]._id.toHexString();
    request(app)
    .delete(`/todos/${hexID}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexID) // MUST be a string
    })
    .end((err, res) => {
      if (err) {          // we check the results of the delete op here
        return done (err);
      }
      Todo.findById(hexID).then((todo) => { // check that the databse does not have the id any more.
        expect(todo).toNotExist();          // if deleted successfully, todo should be null.
        done();
      }).catch((e) => done(e));
    })
  })
  it ('should return 404 for unavailable ids', (done) => {
    const hexID = new ObjectID().toHexString();
    request(app)
    .get(`/todos/${hexID}`)
    .expect(404)
    .end(done);
  })
  it ('should return 404 for non-object ids', (done) => {
    request(app)
    .get(`/todos/123456`)
    .expect(404)
    .end(done);
  })
})


describe ('PATCH /todos/:id', () => {
  it ('should update the todo', (done) => {
    const hexID = todos[0]._id.toHexString();
    const text = 'This is the updated text';
    request(app)
      .patch(`/todos/${hexID}`)
      .send ({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
         expect (res.body.todo.text).toBe (text);
         expect (res.body.todo.completed).toBe (true);
         expect (res.body.todo.completedAt).toBeA ('number');
       })
       .end (done);
  })

  it ('should clear completeAt when todo is not completed', (done) => {
    const hexID = todos[1]._id.toHexString();
    const text = 'This is the second text';
    request(app)
      .patch(`/todos/${hexID}`)
      .send ({
          completed: false,
          text
      })
      .expect(200)
      .expect((res) => {
        expect (res.body.todo.text).toBe (text);
        expect (res.body.todo.completed).toBe (false);
        expect (res.body.todo.completedAt).toNotExist();
      })
      .end (done);
    })
})
