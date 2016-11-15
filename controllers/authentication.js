const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');


// simple function
// using jwt method encode
// sub property = subject
// iat = issued at time
function tokenForUser(user){
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret );
}

exports.signin = function (req, res, next) {
  // user has already had their email and password auth'd
  // We just need to give them a token
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!', req.body);

  res.send({token: tokenForUser(req.user)});
}

exports.signup = function(req, res, next) {

  // Here we get our constants off of req.body
  const email = req.body.email;
  const password = req.body.password;


  // Quick check to see if the user sent us data
  // This is a simple check we really could run some regex
  if (!email || !password) {
    return res.status(422).send({error: "you must provide an email/passowrd"})
  }

  // User.findOne queries our database by email
  User.findOne({ email: email}, function(err, existingUser){
    // if it fails run the next error
    if (err) {
      return next(err);
    }
    // If a user with email does exist, return error saying email in use
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use'});
    }
    // If a user with email does not exist, create and save
    const user = new User({
      email: email,
      password: password
    });

    // Save the user and respond with true
    user.save(function(err){
      if (err) { return next(err) }
      // respond to request indicating a user was created.
      res.json({ token: tokenForUser(user) });
    });

  });

}
