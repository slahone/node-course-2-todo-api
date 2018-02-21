const express = require ('express');
const passport = require ('passport');
const LocalStrategy = require ('passport-local').Strategy;

const app = express();



// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function(err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
//
// ))

app.get('/', (req, res) => {
  res.send ('<form action=\"/login\" method=\"post\"><div><label>Username:</label><input type=\"text\" name=\"username\"/></div><div><label>Password:</label><input type=\"password\" name=\"password\"/></div><div><input type=\"submit\" value=\"Log In\"/></div></form>');
});


app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.listen (3000, () => {
  console.log ('Listening on port 3000');
})
