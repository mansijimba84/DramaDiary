const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewcontroller');
const authenticateUser = require('../middlewares/requireAuth'); 

router.post('/reviews', authenticateUser, reviewController.createReview);
router.get('/reviews/drama/:dramaId', reviewController.getReviewsByDrama);
router.get('/reviews', reviewController.getAllReviews);
router.get('/reviews/me', authenticateUser, reviewController.getMyReviews);
router.put('/reviews/:id', authenticateUser, reviewController.updateReview);
router.delete('/reviews/:id', authenticateUser, reviewController.deleteReview);

module.exports = router;