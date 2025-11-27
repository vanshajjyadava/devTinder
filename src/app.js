const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ firstName: "Vansh", lastName: "Yadav" });
});

app.post("/user", (req, res) => {
  // Saving data to the database..
  res.send("Data successfully saved to the database.");
});

app.delete("/user", (req, res) => {
  res.send("Data deleted successfully.");
});

app.use("/test", (req, res) => {
  res.send("Hello from the server.");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port no. 3000");
});
