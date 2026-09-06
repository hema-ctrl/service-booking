const express = require('express');
const router = express.Router();
const {
    createService,
    getProviderServices,
    updateService,
    deleteService,
    getApprovedServices,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Public (authenticated) - Get approved services
router.get('/', protect, getApprovedServices);

// Provider routes
router.post('/', protect, role(['PROVIDER']), createService);
router.get('/provider', protect, role(['PROVIDER']), getProviderServices);
router.put('/:id', protect, role(['PROVIDER']), updateService);
router.delete('/:id', protect, role(['PROVIDER']), deleteService);

module.exports = router;
