/*
 *  Import external packages here;
 */
const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: false
  },
  profilePicture: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    required: false
  },
  maritalStatus: {
    type: String,
    required: false
  },
  dateOfBirth: {
    type: String,
    required: false
  }
});

const User = mongoose.model("User", UserSchema, "users");

module.exports = User;
