const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/user_auth");
const cookieParser = require("cookie-parser");
const { validateEditProfileData } = require("../utils/validation");
const { validatePassword } = require("../models/user");
const bcrypt = require("bcrypt");

profileRouter.use(cookieParser());

// GET API - view user profile
profileRouter.get("/profile/view", userAuth, async (req, res, next) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// PATCH API - edit user profile
profileRouter.patch("/profile/edit", userAuth, async (req, res, next) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request !");
    }

    // after validating the edit data successfully
    const loggedInUser = req.user; // from user_auth
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile was updated successfully.`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// PATCH API - change password
profileRouter.patch(
  "/profile/changepassword",
  userAuth,
  async (req, res, next) => {
    try {
      const loggedInUser = req.user;
      const { existingPassword, newPassword } = req.body;

      // Validate existing password
      const isPasswordValid = await loggedInUser.validatePassword(
        existingPassword
      );

      if (!isPasswordValid) {
        throw new Error("Existing password is not correct !");
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      loggedInUser.password = hashedNewPassword;

      // Save user
      await loggedInUser.save();

      res.send("Password updated successfully!");
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);

module.exports = profileRouter;
