const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewcontroller");
const authenticateUser = require("../middlewares/requireAuth");


router.post("/", authenticateUser, reviewController.createReview);

router.get("/all", reviewController.getAllReviews);

router.get("/drama/:dramaId", reviewController.getReviewsByDrama);

router.get("/me", authenticateUser, reviewController.getMyReviews);

router.put("/:id", authenticateUser, reviewController.updateReview);

router.delete("/:id", authenticateUser, reviewController.deleteReview);

module.exports = router;