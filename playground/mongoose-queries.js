const {ObjectID} = require ('mongodb'); // needed to check for ObjectID validity

const {mongoose} = require ('./../server/db/mongoose');
const {Todo} = require ('./../server/models/todo');
const {User} = require ('./../server/models/user');

// const id = '5a7e76ddaa2a141a8873343011';
//
// if (!ObjectID.isValid(id)) {
//   console.log ('ID not valid');
// }

// Todo.find({
//   _id: id   // mongoose will translate this into an object ID
// }).then((todos) => {
//     console.log ('Todos', todos);
// })
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log ('Todo', todo);
// })

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log ("Id not found");
//   }
//   console.log ('Todo By ID', todo);
// }).catch((e) => console.log (e));

const id = '5a7d25e04326d009dcd26d4f';

User.find ({
    _id: id
}).then((users) => {
  console.log ('Users', users);
})

User.findById('5a7d26a4e9a9c31300631dd3').then((user) => {
  console.log ('User by Id', JSON.stringify (user, undefined, 2));
}).catch ((e) => console.log (e));

// incorrect ID, will return null
const id2 = '5a7d26a4e9a9c31300631dd6'
User.findById(id2).then((user) => {
  if (!user) {
    console.log ('No such user found: ', id2);
  }
  else console.log ('User by Id', JSON.stringify (user, undefined, 2))
}).catch ((e) => console.log (e));

// invalid ID altogether, goes to catch block
const id3 = '5a7d26a4e9a9c31300631dd311';

if (!ObjectID.isValid(id3)) {
   console.log ('ID not valid', id3);
 } else {
   User.findById(id2).then((user) => {
     console.log ('User by Id', user)
   }).catch ((e) => console.log (e));
}
