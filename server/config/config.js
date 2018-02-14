const REMOTE_MONGO = 'mongodb://slahiri201:B1gF\@tT0d0\@ds233208.mlab.com:33208/node-test-todo';
const LOCAL_MONGO_DEV = 'mongodb://localhost:27017/ToDoApp';
const LOCAL_MONGO_TEST = 'mongodb://localhost:27017/ToDoAppTest';

const env = process.env.NODE_ENV || 'development';

const LOCAL_MONGO = (env==='development') ? LOCAL_MONGO_DEV : LOCAL_MONGO_TEST;

process.env.MONGODB_URI = process.env.PORT ? REMOTE_MONGO : LOCAL_MONGO;
process.env.LOCATION = process.env.PORT ? "remote" : "local";

if (!process.env.PORT) {
  process.env.PORT = 3000;
}
