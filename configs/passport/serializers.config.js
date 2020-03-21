const passport = require('passport');
const User = require('../../models/User.model');

// defines which data are going to be saved in the session
// happens when user log in successfully
passport.serializeUser((user, next) => {
  next(null, user.id);
});

// helps us to retrieve user information from the database
// happens AUTOMATICALLY on every request after you login
// whenever you refresh the page or any change happens that would normally log you out,
// .deserializeUser() keeps you in and you don't have to log in
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
      done(null, user);
  });
});



