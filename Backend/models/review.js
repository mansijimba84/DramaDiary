const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dramaId: {
      type: Number,
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
      enum: ["plan", "watching", "watched"],
      required: true,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },

    reviewText: {
      type: String,
      required: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Review", reviewSchema);