const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    default: ""
  },
  username: {
    type: String,
    required: true,
    default: ""
  },
  firstName: {
    type: String,
    required: true,
    default: ""
  },
  lastName: {
    type: String,
    required: true,
    default: ""
  },
  role: {
    type: String,
    required: true,
    default: "child"
  }
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});
const User = mongoose.model("User", UserSchema);

module.exports = User;