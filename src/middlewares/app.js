const express = require("express");

const app = express();

// Handling ADMIN Auth middleware for all the incoming requests such as GET, POST, PUT, PATCH or DELETE..
const { adminAuth } = require("./admin_auth");
app.use("/admin", adminAuth);

// Handling ADMIN Auth middleware for all the incoming requests such as GET, POST, PUT, PATCH or DELETE..
const { userAuth } = require("./user_auth");
app.use("/user", userAuth);

app.get("/user/getUserData", (req, res) => {
  console.log("fetching data...");
  res.send("User data sent.");
});

app.get("/user/deleteUser", (req, res) => {
  console.log("Admin permission required !!");
  res.send("Cannot delete user without Admin permission !!");
});

app.get("/admin/getAllData", (req, res) => {
  console.log("fetching data...");
  res.send("All data sent.");
});

app.get("/admin/deleteUser", (req, res) => {
  console.log("deleting data...");
  res.send("User deleted.");
});

// Handling ERRORS using '.use'
app.use("/", (err, req, res, next) => {
  if (err) {
    console.log(err);
    res.status(500).send("Something went wrong...");
  }
});
// Creating an error...
app.get("/getData", (req, res) => {
  throw new Error("ERROR !!");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port no. 3000");
});
