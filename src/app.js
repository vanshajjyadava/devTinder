const express = require("express");
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

// Converts JSON into JS object.
app.use(express.json());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

// Used to parse cookies.
app.use(cookieParser());

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
