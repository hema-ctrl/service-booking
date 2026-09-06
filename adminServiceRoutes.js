const express = require('express');
const router = express.Router();
const {
    getAllServices,
    approveService,
    rejectService,
} = require('../controllers/adminServiceController');
const { protect } = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// All admin routes require ADMIN role
router.get('/services', protect, role(['ADMIN']), getAllServices);
router.patch('/services/:id/approve', protect, role(['ADMIN']), approveService);
router.patch('/services/:id/reject', protect, role(['ADMIN']), rejectService);

module.exports = router;
