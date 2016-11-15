const User = require('../models/user');

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
      res.json({sucess: true});
    });

  });

}
