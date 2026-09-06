const express = require('express');
const router = express.Router();
const { processPayment, getPaymentDetails } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// User payment routes
router.post('/', protect, role(['USER']), processPayment);
router.get('/:bookingId', protect, role(['USER']), getPaymentDetails);

module.exports = router;
