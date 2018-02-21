const mongoose = require ('mongoose');
const validator = require ('validator');
const jwt  = require ('jsonwebtoken');
const _ = require ('lodash');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
      access: {
          type: String,
          required: true
      },
      token: {
        type: String,
        required: true
      }
  }]
});

UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
  const user = this;
  const access = "auth";
  const token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens = user.tokens.concat ([{access, token}]);
  return user.save().then(() => {
    return token;
  });
}

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify (token, 'abc123');
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // })
      return Promise.reject(); // same as commented code
  }


  // successfully decoded tokens
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,     // find a token inside the tokens array in the user model.
    'tokens.access': 'auth'
  }).catch((e) => {
    res.status(401)
  });
};

// Mongoose User data model
const User = mongoose.model ('User', UserSchema);

module.exports = {User}
