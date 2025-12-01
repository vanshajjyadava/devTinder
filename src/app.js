const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");

const app = express();

// Converts JSON into JS obj
app.use(express.json());

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

// Get user by Email.
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

// Feed API - get all the data from the database.
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong !");
  }
});

// Id API - get user by id.
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
