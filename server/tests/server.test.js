const expect = require ('expect');
const request = require ('supertest');

const {app} = require ('./../server');
const {Todo} = require ('./../models/todo');

const todos = [{
  text: 'First test todo'
}, {
  text: 'Second test todo'
}];

//************************************************************
// This will ensure the Todos collection is cleared out before
// each test run. After  that, insert a known set of records.
//*************************************************************
beforeEach((done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos);
  }).then(() => done());
});

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
