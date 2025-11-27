const express = require("express");

const app = express();

app.use("/user", [
  (req, res, next) => {
    // Route Handler 1
    console.log("Route handler 1");
    // res.send("Response 1");
    next();
  },
  (req, res, next) => {
    // Route Handler 2
    console.log("Route Handler 2");
    // res.send("Response 2");
    next();
  },
  (req, res, next) => {
    // Route Handler 3
    console.log("Route Handler 3");
    // res.send("Response 3");
    next();
  },
  (req, res, next) => {
    // Route Handler 4
    console.log("Route Handler 4");
    // res.send("Response 4");
    next();
  },
  (req, res) => {
    // Route Handler 5
    console.log("Route Handler 5");
    res.send("Response 5");
  },
]);

app.listen(3000, () => {
  console.log("Server is successfully listening on port no. 3000");
});
