const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.status(200).send({
      message: "messages retrieved successfully",
      details: messages,
    });
  } catch (error) {
    res.status(400).send({
      message: "INternal server error",
      error: error.message,
    });
  }
};
const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data");
    return res.status(400).send({
        message: "Please fill the message"
    });
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name picture")
    message = await message.populate("chat")
    message = await User.populate(message, {
      path: "chat.users",
      select: "name picture email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.send({
        message: 'message successfully sent',
        details: message,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};


const updateReactions = async (req, res) => {
  try {
    const { messageId, newReactionType } = req.body;
    const { userId } = req.user._id;

    const message = await Message.findById(messageId)
      .populate("sender", "name picture")
      .populate("chat");

    if (!message) {
      return res.status(404).send({ error: "Message not found" });
    }

    const existingReaction = message.reactions.find(
      (reaction) => reaction.user === userId
    );

    if (existingReaction) {
      existingReaction.type = newReactionType;
    } else {
      message.reactions.push({ user: userId, type: newReactionType });
    }

    const updatedMessage = await message.save();
    const populatedMessage = await Message.populate(updatedMessage, [
      { path: "sender", select: "name picture" },
      { path: "chat" },
      { path: "chat.users", select: "name picture email" },
    ]);

    res.send({
      message: "Reaction updated successfully",
      updatedMessage: populatedMessage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getReactionsCountForMessage = async (req, res) => {
  try {
    const {messageId} = req.params;
    console.log(messageId)

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).send({ error: "Message not found" });
    }

    const reactionsCount = {
      like: 0,
      love: 0,
      laugh: 0,
    };

    message.reactions.forEach((reaction) => {
      if (reaction.type === "like") {
        reactionsCount.like += 1;
      } else if (reaction.type === "love") {
        reactionsCount.love += 1;
      } else if (reaction.type === "laugh") {
        reactionsCount.laugh += 1;
      }
    });

    res.status(200).send({
      message: "Reactions count retrieved successfully",
      details: reactionsCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = { getAllMessages, sendMessage, updateReactions,getReactionsCountForMessage };
