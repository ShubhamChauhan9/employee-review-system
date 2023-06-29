const mongoose = require('mongoose');
var  passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: false }
  });

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;