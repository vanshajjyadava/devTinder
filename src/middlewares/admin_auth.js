const adminAuth = (req, res, next) => {
  console.log("Validating the admin...");
  const token = "admin";
  const isAdminAuthorized = token === "admin";

  if (!isAdminAuthorized) {
    console.log("Admin validation failed.");
    res.status(401).send("Unauthorized User.");
  } else {
    console.log("Admin authorization successful.");
    next();
  }
};

module.exports = {
  adminAuth,
};
