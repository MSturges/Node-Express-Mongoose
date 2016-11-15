const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'email' }

// Create Local strategy
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  // verify this username and password, call done with the user
  // if it is the correct username and password
  // otherwise, call done with false

  User.findOne({ email: email }, function(err, user){
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    // compare passwords - is password the same in dataBase
    user.comparePassword(password, function(err, isMatch){
      if (err) {return done(err); }

      if (!isMatch) { return done(null, false); }

      return done(null, user);
    })

  })
})



// Purpose of passport is to see if our user
// Is authenticated

// Setup options for JWT Strategy
// Look on the request.header for authorization
//
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy
// Payload is the decoded token
// payload = user id + time stamp
// done is a call back
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  // See if the user ID in the payload exists in our dataBase
  // If it does, call done with that other
  // otherwise, call done without a user object
  User.findById(payload.sub, function(err, user){

    // not authenticated
    if (err) { return done(err, false); }

    // If they do exist call done
    // which is a call back apart of passport
    // to let passport who the user is.
    if (user) { done(null, user); }

    // couldn't find a user
     else { done(null, false); }

  });
});


// Tell passport to use this stategy
passport.use(jwtLogin);
passport.use(localLogin);
