const jwt = require("jsonwebtoken");
const User = require('../models/userModel')

const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization");
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        res.status(401).send({
          message: "Unauthorized-invalid-token",
          error: err,
        });
      } else {
        req.user = await User.findById(decoded._id);
        next();
      }
    });
  } else {
    res.status(401).send({
      message: "Unauthorized-missing-token",
    });
  }
};

module.exports = { verifyToken };
