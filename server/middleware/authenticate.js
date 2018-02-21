var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');
  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject
    }
    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();   // 401 => not authenticated or user not found
    // do not call next here as we do not want the code to continue if this failed.
  })
}

module.exports = {authenticate};
