const express = require('express');
const router = express.Router();
const {
    getAllBookings,
    getAllUsers,
    getAnalytics,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// All routes require ADMIN role
router.get('/bookings', protect, role(['ADMIN']), getAllBookings);
router.get('/users', protect, role(['ADMIN']), getAllUsers);
router.get('/analytics', protect, role(['ADMIN']), getAnalytics);

module.exports = router;
