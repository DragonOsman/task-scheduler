const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  id: {
    type: Number,
    required: true,
    default: 0
  },
  title: {
    type: String,
    required: true,
    default: ""
  },
  startTime: {
    type: Date,
    requred: true,
    default: new Date()
  },
  endTime: {
    type: Date,
    required: true,
    default: new Date()
  },
  scheduled: {
    type: Boolean,
    required: false,
    default: false
  },
  flexible: {
    type: Boolean,
    required: false,
    default: false
  },
  isRecurring: {
    type: Boolean,
    default: false,
    required: true
  },
  daysRecurring: {
    type: [String],
    default: [],
    required: false
  },
  isCompleted: {
    type: Boolean,
    default: false,
    required: true
  },
  userId: {
    type: Schema.ObjectId
  }
});

module.exports = mongoose.model("Task", TaskSchema);