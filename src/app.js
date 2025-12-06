const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/user_auth");

const app = express();

// Converts JSON into JS object.
app.use(express.json());

// Used to parse cookies.
app.use(cookieParser());

// POST API - adds user to the database.
app.post("/signup", async (req, res, next) => {
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

    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(req.body.firstName)) {
      throw new Error("First name contains invalid characters");
    }

    if (!nameRegex.test(req.body.lastName)) {
      throw new Error(400).send("Last name contains invalid characters");
    }

    await user.save();
    res.send("User added successfully.");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// GET API - logs in the user.
app.post("/login", async (req, res, next) => {
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

app.get("/profile", userAuth, async (req, res, next) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;

  // Sending a connection request..
  console.log("Sending a connection request..");

  res.send(
    user.firstName + " " + user.lastName + " sent you a friend request !"
  );
});

connectDb()
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(1390, () => {
      console.log("Server is successfully listening on port no. 1390");
    });
  })
  .catch((err) => {
    console.error("Database connection failed.");
  });
