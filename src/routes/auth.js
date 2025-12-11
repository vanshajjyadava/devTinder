const User = require("../models/user");
const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");

// Converts JSON into JS object.
authRouter.use(express.json());

// POST API - adds user to the database.
authRouter.post("/signup", async (req, res, next) => {
  try {
    // Validation of data..
    validateSignUpData(req);

    const { firstName, lastName, emailId, password, gender, age } = req.body;
    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);

    // Creating a new instance of the user model.
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      gender,
      age,
    });

    await user.save();
    res.send("User added successfully.");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// GET API - logs in the user.
authRouter.post("/login", async (req, res, next) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("Invalid credentials !");

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Create a JWT..
      const token = await user.getJWT();

      res.cookie("token", token);
      res.send("Login successful.");
    } else {
      throw new Error("Invalid credentials !");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = authRouter;
