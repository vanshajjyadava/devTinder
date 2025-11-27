const express = require("express");

const app = express();

// '?' means that the letter "b" can exist or not.
app.get(/ab?c/, (req, res) => {
  res.send({ firstName: "Vansh", lastName: "Yadav" });
});

// '+' means that the letter "b" can repeat inself multiple times.
app.get(/ab+c/, (req, res) => {
  res.send({ firstName: "Vansh", lastName: "Yadav" });
});

// '*' means that you could write anything in b/w ab and cd, it will work.
app.get("/ab*cd/", (req, res) => {
  res.send({ firstName: "Vansh", lastName: "Yadav" });
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port no. 3000");
});
