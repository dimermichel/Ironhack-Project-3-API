const User = require('../../models/User.model');
const passport = require('passport');
const Strategy = require('passport-github').Strategy;

passport.use( new Strategy({
  clientID: process.env.CLIENT_GITHUB_ID,
  clientSecret: process.env.CLIENT_GITHUB_SECRET,
  callbackURL: process.env.BASE_URL+'/auth/github/callback'
  }, (accessToken, refreshToken, profile, done) => {
      // check if user already exists in our own db
      User.findOne({githubId: profile.id}).then((currentUser) => {
          if(currentUser){
              // already have this user
              //console.log('user is: ', currentUser);
              done(null, currentUser);
          } else {
              // if not, create user in our db
              new User({
                  githubId: profile.id,
                  username: profile.username,
                  profileUrl: profile._json.avatar_url,
                  strategy: 'github'
              }).save().then((newUser) => {
                  //console.log('created new user: ', newUser);
                  done(null, newUser);
              });
          }
      });
  })
);