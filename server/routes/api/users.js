const express = require("express");
const userRouter = express.Router();
const User = require("../../models/User");
const LocalStrategy = require("passport-local").Strategy;

userRouter.get("/register", (req, res, next) => {
  User.register({
    username: req.body.email,
    email: req.body.email,
    role: req.body.role
  }, req.body.password, async (err, user) => {
    if (err) {
      res.status(500);
      res.json({ error: err, success: false });
    }

    if (user) {
      User.authenticate(req.body.email, req.body.password, (err, result) => {

      });
      res.status(200);
      res.json({ user, success: true });
    }
  });
});

module.exports = userRouter;