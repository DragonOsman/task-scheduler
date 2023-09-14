const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: {
    type: String,
    required: true,
    default: ""
  },
  startTime: {
    type: Date,
    requred: false,
    default: new Date()
  },
  endTime: {
    type: Date,
    required: false,
    default: new Date()
  },
  timer: {
    type: String,
    required: false,
    default: ""
  },
  time: {
    type: String,
    required: false,
    default: ""
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
    type: Schema.ObjectId,
    required: true
  }
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;