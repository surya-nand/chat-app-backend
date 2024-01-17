const {
  registerUser,
  loginUser,
  searchUsers,
  fetchUsers,
  updateUser,
  fetchUserById,
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/authmiddleware");
const { isAdmin } = require("../middleware/adminCheck");

const userRoutes = (app) => {
  app.route("/api/users/register").post(verifyToken, isAdmin, registerUser);
  app.route("/api/users/login").post(loginUser);
  app.route("/api/users").get(verifyToken, searchUsers);
  app.route("/api/users/fetch").get(verifyToken, isAdmin, fetchUsers);
  app.route("/api/users/fetch/:userId").put(verifyToken, isAdmin, updateUser);
  app.route("/api/users/fetch/:userId").get(verifyToken, isAdmin, fetchUserById);
};

module.exports = { userRoutes };
