const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId,ref:"User"},
  type: {type:String, enum:["like","love","laugh"]}
})

const messageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    reactions:[reactionSchema],
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageModel);
module.exports = Message;
