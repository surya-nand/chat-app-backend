const {
  getAllMessages,
  sendMessage,updateReactions,getReactionsCountForMessage
} = require("../controllers/messageController");
const { verifyToken } = require("../middleware/authmiddleware");

const messageRoutes = (app) => {
  app.route("/api/message").post(verifyToken, sendMessage);
  app.route("/api/message/:chatId").get(verifyToken, getAllMessages);
  app.route("/api/message/reactions").put(verifyToken,updateReactions)
  app.route("/api/message/reactions/:messageId").get(verifyToken, getReactionsCountForMessage);
};

module.exports = { messageRoutes };
