const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res, next) => {
  // Creating a new instance of the user model.
  const user = new User({
    firstName: "Vansh",
    lastName: "Yadav",
    emailId: "vanshyadav@gmail.com",
    password: "Vansh@123",
  });
  try {
    await user.save();
    res.send("User added successfully.");
  } catch (err) {
    res.status(400).send("Error adding the user." + err.message);
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
