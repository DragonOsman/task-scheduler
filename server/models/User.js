const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
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
    default: "parent"
  },
  children: {
    type: [this, { role: "child" }],
    required: this.role === "parent" ? true : false,
    default: this.role === "parent" ? [] : null
  },
  dateRegistered: {
    type: Date,
    required: true,
    default: new Date()
  }
});

UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", UserSchema);

module.exports = User;