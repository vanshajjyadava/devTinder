const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");

const app = express();

// Converts JSON into JS object.
app.use(express.json());

// POST API - adds user to the database.
app.post("/signup", async (req, res, next) => {
  // Creating a new instance of the user model.
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully.");
  } catch (err) {
    res.status(400).send("Error adding the user." + err.message);
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
app.patch("/user", async (req, res) => {
  const userId = req.body.id;
  const userData = req.body;
  console.log(userData);

  try {
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
