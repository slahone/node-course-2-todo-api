const mongoose = require ('mongoose');

// Mongoose User data model
const User = mongoose.model ('User', {
  email: {
    type: String,
    required: true,
    minlength: 5,
    trim: true
  }
});

module.exports = {User};
