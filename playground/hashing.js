const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

const data = {
  id: 10
}

var token = jwt.sign (data, '123abc');

console.log (token);


// const message = "I am user number 23";
// const hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Message: ${hash}`);
//
// const data = {
//   id: 23
// };
//
// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data)+ 'somesecret').toString()
// }
//
// token.data.id = 5;
// token.  hash = SHA256(JSON.stringify(data));
//
// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log ('Data was not changed')
// } else {
//   console.log ('Data was changed');
// }
