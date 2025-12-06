const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 2,
      maxLength: 50,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Invalid email id !");
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value))
          throw new Error(
            "Weak password detected! TIP : Password must contain minimum length of 8, a lowercase letter, an uppercase letter and a special character. Entered password : " +
              value
          );
      },
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    gender: {
      type: String,
      required: true,
      lowercase: true,
      // Custom Validation Function.
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not valid !");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg",
      validate(value) {
        if (!validator.isURL(value)) throw new Error("Invalid image URL !");
      },
    },
    about: {
      type: String,
      default: "This is a default about for the user.",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

// NEVER use arrow functions in order to create these methods !!

userSchema.methods.getJWT = async function () {
  const user = this;

  try {
    const token = await jwt.sign({ _id: this._id }, "DEV@Tinder$139", {
      expiresIn: "1d",
    });

    return token;
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

userSchema.methods.validatePassword = async function (passwordEnteredByUser) {
  try {
    const user = this;
    const passHash = user.password;

    const isPasswordValid = await bcrypt.compare(
      passwordEnteredByUser,
      passHash
    );

    return isPasswordValid;
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

module.exports = mongoose.model("User", userSchema);
