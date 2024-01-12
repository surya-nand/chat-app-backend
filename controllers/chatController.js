const { json } = require("body-parser");
const Chat = require("../models/chatModel");

const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).send({
      message: "user not selected",
    });
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    users: { $all: [req.user._id, userId] },
  })
    .populate("users", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "latestMessage.sender",
        select: "name picture email",
      },
    });

  if (isChat.length > 0) {
    res.send({
      message: "chat accessed successfully",
      details: isChat[0],
    });
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    // console.log(chatData)
    try {
      const createdChat = await Chat.create(chatData);
      const populatedCreatedChat = await Chat.findById(
        createdChat._id
      ).populate("users", "-password");
      res.status(200).send({
        message: "New chat created successfully",
        details: populatedCreatedChat,
      });
    } catch (error) {
      res.status(500).send({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
};

const fetchChats = async (req, res) => {
  try {
    // Find all chats where the logged-in user's ID is present in the users array
    const userChats = await Chat.find({
      users: req.user._id,
    })
      .populate({
        path: "users",
        select: "-password",
      })
      .populate({
        path: "groupAdmin",
        select: "-password",
      })
      .populate({
        path: "latestMessage",
        populate: {
          path: "latestMessage.sender",
          select: "name picture email",
        },
      })
      .sort({ updatedAt: -1 });

    res.status(200).send({
      message: "Chats retrieved successfully",
      chats: userChats,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.chatName) {
    return res.status(400).send({
      message: "Please fill the required fields",
    });
  }
  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.status(400).send({
      message: "More than 2 users are required to create a group",
    });
  }
  users.push(req.user);
  try {
    const groupChatData = {
      chatName: req.body.chatName,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user._id,
    };
    const groupChat = await Chat.create(groupChatData);
    const populatedGroupChat = await Chat.findById(groupChat._id)
      .populate({
        path: "users",
        select: "-password",
      })
      .populate({
        path: "groupAdmin",
        select: "-password",
      });

    res.status(200).send({
      message: "Group chat created successfully",
      details: populatedGroupChat,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName: chatName },
      { new: true }
    )
      .populate({
        path: "users",
        select: "name picture email",
      })
      .populate("groupAdmin", "-password");
    if (!updatedChat) {
      res.status(404).send({
        message: "Group not found",
      });
    }
    else{
        res.status(200).send({
            message: "Group rename successful",
            details: updatedChat,
        })
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const userRemoved = await Chat.findByIdAndUpdate(
      chatId,
      { $pull : {users: userId}},
      { new: true }
    )
      .populate("users","-password")
      .populate("groupAdmin", "-password");
    if (!userRemoved) {
      res.status(404).send({
        message: "Group not found",
      });
    } else {
      res.status(200).send({
        message: "User removed from group successfully",
        details: userRemoved,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const addUserToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const chat = await Chat.findOne({
        _id: chatId,
        users: userId
    })

    if(chat){
        res.status(400).send({
            message:"user is already in group"
        })
        return;
    }
    const userAdded = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!userAdded) {
      res.status(404).send({
        message: "Group not found",
      });
    } else {
      res.status(200).send({
        message: "User added to group successfully",
        details: userAdded,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup,removeFromGroup, addUserToGroup };
