const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const ChildSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    default: ""
  },
  wakeTime: {
    type: Date,
    required: true,
    default: new Date()
  },
  dinnerTime: {
    type: Date,
    required: true,
    default: new Date()
  },
  sleepTime: {
    type: Date,
    required: true,
    default: new Date()
  },
  breakfastTime: {
    type: Date,
    required: true,
    default: new Date()
  },
  lunchTime: {
    type: Date,
    required: true,
    default: new Date()
  },
  role: {
    type: String,
    required: true,
    default: "child"
  },
  isActive: {
    type: Boolean,
    required: true,
    default: false
  }
});

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
    type: [ChildSchema],
    required: true,
    default: []
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