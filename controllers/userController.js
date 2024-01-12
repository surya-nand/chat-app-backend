const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        message: "Email already registered",
      });
    } else if (password !== confirmPassword) {
      return res.send({
        message: "Passwords do not match",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        salt,
      });
      await newUser
        .save()
        .then((new_user) => {
          res.send({
            message: "Registration Successful. Please Login",
            newUserDetails: new_user,
          });
        })
        .catch((error) => {
          res.status(400).send({
            message: "New User Registration failed",
            error: error.message,
          });
        });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid Credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.SECRET_KEY
      );
      return res.status(200).send({
        message: "Login Successful",
        token: token,
        userDetails: user,
      });
    } else {
      return res.status(400).send({ message: "Invalid Credentials" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { email: { $regex: new RegExp(req.query.search, "i") } },
            { name: { $regex: new RegExp(req.query.search, "i") } },
          ],
        }
      : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.status(200).send({
      message: "search successful",
      userDetails: users,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { registerUser, loginUser, searchUsers };
