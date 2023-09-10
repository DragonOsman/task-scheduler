const express = require("express");
const taskRouter = express.Router();
const Task = require("../../models/Task");
const User = require("../../models/User");

taskRouter.post("/add-task", async (req, res, next) => {

});

taskRouter.get("/", async (req, res, next) => {

});

taskRouter.put("/edit-task/:id", async (req, res, next) => {

});

taskRouter.delete("/delete-task/:id", async (req, res, next) => {

});

module.exports = taskRouter;