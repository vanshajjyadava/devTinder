const express = require("express");

const app = express();

// Handling ADMIN Auth middleware for all the incoming requests such as GET, POST, PUT, PATCH or DELETE..
const { adminAuth } = require("./middlewares/admin_auth");
app.use("/admin", adminAuth);

// Handling ADMIN Auth middleware for all the incoming requests such as GET, POST, PUT, PATCH or DELETE..
const { userAuth } = require("./middlewares/user_auth");
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

app.listen(3000, () => {
  console.log("Server is successfully listening on port no. 3000");
});
