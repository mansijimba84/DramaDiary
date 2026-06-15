const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  dramaId: {
    type: String,
    required: true,
  },

  dramaTitle: {
    type: String,
    required: true,
  },

  dramaPoster: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["Watching", "Watched", "Plan"],
    required: true,
  },

rating: {
  type: Number,
  min: 0,
  max: 5,
  default: 0,
},

reviewText: {
  type: String,
  default: "",
},

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);