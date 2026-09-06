const express = require('express');
const router = express.Router();
const { createReview, getServiceReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Get all reviews for a specific service (Authenticated users can view)
router.get('/:serviceId', protect, getServiceReviews);

// Create a review (Only USER role can submit reviews)
router.post('/', protect, role(['USER']), createReview);

module.exports = router;
