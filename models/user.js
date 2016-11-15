const mongoose = require('mongoose');
// requre bycrypt
const bcrypt = require('bcrypt-nodejs');
// tell mongoose about the particular fields our database modle will have
const Schema = mongoose.Schema;

// define our user model
// email forces a unique check
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// on save hook, encrypt password
// Before saving (userSchema.pre) to our model, run this function
userSchema.pre('save', function(next){
  // get access to the user model...looks weird
  const user = this;

  // Generate a salt, take time, then run callback function
  bcrypt.genSalt(10, function(err, salt){
    if(err) {return next(err); }

    // Hash (encrypt) our password using the salt,
    // take time, then run callback function
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err) {return next(err);}

      // overwrite plain text password with encrypted password
      user.password = hash;

      // then run next which will save our user modle
      next();
    });
  });
});

// Create the model class
// represents all users
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
