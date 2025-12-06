const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

const app = express();

// Converts JSON into JS object.
app.use(express.json());

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

app.post("/login", async (req, res, next) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("Invalid credentials !");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    // console.log(password);
    // console.log(user.password);

    if (isPasswordValid) {
      res.send("User login successful.");
    } else {
      throw new Error("Invalid credentials !");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// GET API - gets user from database using email.
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (user.length === 0) res.status(404).send("User not found");
    else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong !");
  }
});

// GET API - gets all the data from the database.
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong !");
  }
});

// GET API - get user by id from the database.
app.get("/userbyid", async (req, res) => {
  const userID = req.body.id;

  try {
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).send("User not found !");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send("Invalid ID format !");
  }
});

// DELETE API - deletes user by id from the database.
app.delete("/user", async (req, res) => {
  const userId = req.body.id;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) return res.status(404).send("User not found !");
    else {
      res.send("User deletion successfull.");
    }
  } catch (err) {
    res.status(404).send("User not found !");
  }
});

// PATCH API - updates the user data in the database.
app.patch("/user/:_id", async (req, res) => {
  const userId = req.params?._id;
  const userData = req.body;
  console.log(userData);

  try {
    const ALLOWED_UPDATES = [
      "password",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(userData).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) throw new Error("Update not allowed");

    if (userData?.skills?.length > 5)
      throw new Error("There can only be 5 skills at max.");

    const user = await User.findByIdAndUpdate(userId, userData, {
      // options..
      runValidators: true,
    });
    console.log(user);
    res.send("User updated successfully.");
  } catch (err) {
    res.status(404).send("Update failed: " + err.message);
  }
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
