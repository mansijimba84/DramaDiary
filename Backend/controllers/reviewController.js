const Review = require('../models/Review');

exports.createReview = async (req, res) => {
    const { dramaId, dramaTitle, dramaPoster, status, rating, reviewText } = req.body;
    try {
        const newReview = await Review.create({
            userId: req.user._id,
            dramaId,
            dramaTitle,
            dramaPoster,
            status,
            rating,
            reviewText
        });
        return res.status(201).json({ message: 'Review created successfully', review: newReview });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }           
};

exports.getReviewsByDrama = async (req, res) => {
    const { dramaId } = req.params;     
    try {
        const reviews = await Review.find({ dramaId }).populate('userId', 'username');
        return res.status(200).json({ reviews });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.getAllReviews = async (req, res) => {
    try {
    const reviews = await Review.find()
      .populate("userId", "username email")
      .populate("dramaId")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
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
      .populate("dramaId");

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
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

    // Check ownership
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own reviews",
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        rating: req.body.rating,
        reviewText: req.body.reviewText,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update review",
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

    // Check ownership
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own reviews",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};