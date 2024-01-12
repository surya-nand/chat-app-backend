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
  app.route("/chat").post(verifyToken, accessChat);
  app.route("/chat").get(verifyToken, fetchChats);
  app.route("/chat/group").post(verifyToken, createGroupChat);
  app.route("/chat/group/rename").put(verifyToken, renameGroup);
  app.route("/chat/group/remove").put(verifyToken, removeFromGroup);
  app.route("/chat/group/add").put(verifyToken, addUserToGroup);
};

module.exports = { chatRoutes };
