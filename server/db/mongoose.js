// The file has been modified to access environment variable MONGODB_URI
// for the database connection info

const mongoose = require ('mongoose');

mongoose.Promise = global.Promise;

//console.log ('DB **** ', process.env.MONGODB_URI);
//console.log ('PORT **** ', process.env.PORT);

const location = process.env.LOCATION;

mongoose.connect (process.env.MONGODB_URI).then(() => {
  console.log(`Connected to ${process.env.LOCATION} Mongo instance.`)
}, (err) => {
  console.log(`Error connecting to ${process.env.LOCATION} Mongo instance: `, err);
});

module.exports = { mongoose };
