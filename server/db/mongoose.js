const mongoose = require ('mongoose');

mongoose.Promise = global.Promise;

const REMOTE_MONGO = 'mongodb://slahiri201:B1gF@tT0d0@ds233208.mlab.com:33208/node-test-todo';
const LOCAL_MONGO = 'mongodb://localhost:27017/TodoApp';

const MONGO_URI = process.env.PORT ? REMOTE_MONGO : LOCAL_MONGO;

mongoose.connect (MONGO_URI).then(() => {
  console.log('Connected to Mongo instance.')
}, (err) => {
  console.log('Error connecting to Mongo instance: ', err);
});

module.exports = { mongoose };
