const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Service = require('../models/Service');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all services (admin view - all statuses)
// @route   GET /api/admin/services
// @access  Private (ADMIN)
const getAllServices = asyncHandler(async (req, res) => {
    const services = await Service.find()
        .populate('providerId', 'name email phone')
        .sort({ createdAt: -1 });

    res.status(200).json(services);
});

// @desc    Approve a service
// @route   PATCH /api/admin/services/:id/approve
// @access  Private (ADMIN)
const approveService = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        res.status(400);
        throw new Error('Invalid service ID');
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
        res.status(404);
        throw new Error('Service not found');
    }

    service.approvalStatus = 'APPROVED';
    service.rejectionReason = '';

    const updatedService = await service.save();

    res.status(200).json(updatedService);
});

// @desc    Reject a service
// @route   PATCH /api/admin/services/:id/reject
// @access  Private (ADMIN)
const rejectService = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        res.status(400);
        throw new Error('Invalid service ID');
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
        res.status(404);
        throw new Error('Service not found');
    }

    service.approvalStatus = 'REJECTED';
    service.rejectionReason = req.body.rejectionReason || '';

    const updatedService = await service.save();

    res.status(200).json(updatedService);
});

module.exports = {
    getAllServices,
    approveService,
    rejectService,
};
