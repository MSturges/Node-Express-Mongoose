const mongoose = require('mongoose');

// tell mongoose about the particular fields our
// database modle will have
const Schema = mongoose.Schema;

// define our model
// email forces a unique check
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// Create the model class
// represents all users
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
