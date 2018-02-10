const expect = require ('expect');
const request = require ('supertest');

const {app} = require ('./../server');
const {Todo} = require ('./../models/todo');

//************************************************************
// This will ensure the Todos collection is cleared out before
// each test run.  Ensures that the test, if run successfyully,
// will result in one and only one record in the todos
// collection in the MongoDB database
//*************************************************************
beforeEach((done) => {
  Todo.remove({}).then(() => done());
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
        // First find all records in the collection, there should be only one.
        // Then check the text field in that record, should be text as above.
        // if everything checks out, test was successful, call sone. If not,
        // error will be caught in catch section. call done with error parm.
        Todo.find().then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done (e));
      })
  });
});
