const express = require("express");
const userRouter = express.Router();
const User = require("../../models/User");
const passport = require("passport");

const validateRegisterInput = require("../../user-validation/register");
const validateLoginInput = require("../../user-validation/login");

userRouter.post("/register", (req, res) => {
  try {
    const { isValid, errors } = validateRegisterInput(req.body);
    if (!isValid) {
      res.statusCode = 400;
      if (errors.password) {
        res.json({ error: errors.password });
        console.log(`error: ${errors.password}`);
        return;
      } else if (errors.confirmPassword) {
        res.json({ error: errors.confirmPassword });
        console.log(`error: ${errors.confirmPassword}`);
        return;
      } else if (errors.email) {
        res.json({ error: errors.email });
        console.log(`error: ${errors.email}`);
        return;
      } else if (errors.firstName) {
        res.json({ error: errors.firstName });
        console.log(`error: ${errors.firstName}`);
        return;
      } else if (errors.lastName) {
        res.json({ error: errors.lastName });
        console.log(`error: ${errors.lastName}`);
        return;
      }
    } else {
      User.register(new User({
        email: req.body.email,
        username: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      }), req.body.password, async (err, user) => {
        if (err) {
          res.status(500).json({ error: err, success: false });
          console.log(err);
        }

        try {
          if (user) {
            await user.save();
            res.status(200).json({ success: true, message: "you are registered!", user });
          }
        } catch (err) {
          console.log(err);
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.json({ error: err, success: false });
  }
});

userRouter.post("/login", passport.authenticate("local"), async (req, res, next) => {
  try {
    const { isValid, errors } = validateLoginInput(req.body);
    if (!isValid) {
      res.statusCode = 400;
      if (errors.email) {
        res.json({ error: errors.email });
        return;
      } else if (errors.password) {
        res.json({ error: errors.password });
        return;
      }
    }
    const user = await User.findById(req.user._id);
    if (user) {
      try {
        await user.save();
        res.json({ success: true, user });
      } catch (err) {
        res.status(500).json({ error: err });
      }
    } else {
      res.status(401).json({ message: "Unauthorized: User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
    return next(err);
  }
});

userRouter.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

userRouter.get("/user-details", passport.authenticate("local"), (req, res) => {
  console.log("trying to user info in /user-details route:");
  for (const [key, value] of Object.entries(req)) {
    console.log(`${key}: ${value}`);
    for (const [innerKey, innerValue] of Object.entries(req.user)) {
      console.log(`${innerKey}: ${innerValue}`);
    }
  }
  res.status(200).json({ success: true, user: req.user });
});

module.exports = userRouter;