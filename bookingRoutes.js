const express = require('express');
const router = express.Router();
const {
    createBooking,
    getUserBookings,
    getProviderBookings,
    updateBookingStatus,
} = require('../controllers/bookingController');
const { cancelBooking } = require('../controllers/bookingLifecycleController');
const { protect } = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// User routes
router.post('/', protect, role(['USER']), createBooking);
router.get('/user', protect, role(['USER']), getUserBookings);
router.patch('/cancel', protect, role(['USER']), cancelBooking);

// Provider routes
router.get('/provider', protect, role(['PROVIDER']), getProviderBookings);
router.patch('/status', protect, role(['PROVIDER']), updateBookingStatus);

module.exports = router;

