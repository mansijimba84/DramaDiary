const Review = require("../models/Review");

/* CREATE REVIEW */
exports.createReview = async (req, res) => {
  const {
    dramaId,
    dramaTitle,
    dramaPoster,
    status,
    rating,
    reviewText,
  } = req.body;

  try {
    const newReview = await Review.create({
      userId: req.user._id,
      dramaId,
      dramaTitle,
      dramaPoster,
      status,
      rating,
      reviewText,
    });

    res.status(201).json({
      success: true,
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* GET ALL REVIEWS (COMMUNITY FEED) */
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "username email")
      .sort({ updatedAt: -1 }) // FIX
      .limit(50);

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* GET MY REVIEWS */
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      userId: req.user._id,
    })
      .populate("userId", "username")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* UPDATE REVIEW */
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      review: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* DELETE REVIEW */
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* GET REVIEWS BY DRAMA */
exports.getReviewsByDrama = async (req, res) => {
  try {
    const reviews = await Review.find({
      dramaId: req.params.dramaId,
    }).populate("userId", "username");

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};