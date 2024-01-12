const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addUserToGroup,
} = require("../controllers/chatController");
const { verifyToken } = require("../middleware/authmiddleware");

const chatRoutes = (app) => {
  app.route("/api/chat").post(verifyToken, accessChat);
  app.route("/api/chat").get(verifyToken, fetchChats);
  app.route("/api/chat/group").post(verifyToken, createGroupChat);
  app.route("/api/chat/group/rename").put(verifyToken, renameGroup);
  app.route("/api/chat/group/remove").put(verifyToken, removeFromGroup);
  app.route("/api/chat/group/add").put(verifyToken, addUserToGroup);
};

module.exports = { chatRoutes };
