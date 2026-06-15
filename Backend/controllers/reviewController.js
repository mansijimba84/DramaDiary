const Review = require("../models/Review");

exports.createReview = async (req, res) => {
  try {
    const { dramaId, dramaTitle, dramaPoster, status, rating, reviewText } =
      req.body;

    if (!dramaId || !status) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ CHECK IF REVIEW ALREADY EXISTS
    let review = await Review.findOne({
      userId: req.user._id,
      dramaId,
    });

    // =========================
    // UPDATE EXISTING REVIEW
    // =========================
    if (review) {
      review.status = status;

      if (rating !== undefined) review.rating = rating;
      if (reviewText !== undefined) review.reviewText = reviewText;

      await review.save();

      return res.status(200).json({
        success: true,
        message: "Review updated successfully",
        review,
      });
    }

    // =========================
    // CREATE NEW REVIEW
    // =========================
    const newReview = await Review.create({
      userId: req.user._id,
      dramaId,
      dramaTitle,
      dramaPoster,
      status,
      rating: rating || 0,
      reviewText: reviewText || "",
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      review: newReview,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

exports.getReviewsByDrama = async (req, res) => {
  try {
    const { dramaId } = req.params;

    const reviews = await Review.find({ dramaId })
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch drama reviews",
      error: error.message,
    });
  }
};

exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      userId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("userId", "username");

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch your reviews",
      error: error.message,
    });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        rating: req.body.rating,
        reviewText: req.body.reviewText,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      review: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
};