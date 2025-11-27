const userAuth = (req, res, next) => {
  console.log("Validating the user...");
  const token = "user";
  const isUserAuthorized = token === "user";

  if (!isUserAuthorized) {
    console.log("User validation failed.");
    res.status(401).send("Used is not verified.");
  } else {
    console.log("User validation successful.");
    next();
  }
};

module.exports = {
  userAuth,
};
