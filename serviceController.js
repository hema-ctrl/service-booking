const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Service = require('../models/Service');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (PROVIDER)
const createService = asyncHandler(async (req, res) => {
    const { serviceName, category, description, price, duration } = req.body;

    if (!serviceName || !category || !description || !price || !duration) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    const service = await Service.create({
        providerId: req.user._id,
        serviceName,
        category,
        description,
        price,
        duration,
        approvalStatus: 'PENDING', // Always default to PENDING
    });

    res.status(201).json(service);
});

// @desc    Get all services by logged-in provider
// @route   GET /api/services/provider
// @access  Private (PROVIDER)
const getProviderServices = asyncHandler(async (req, res) => {
    const services = await Service.find({ providerId: req.user._id }).sort({
        createdAt: -1,
    });

    res.status(200).json(services);
});

// @desc    Update provider's own service
// @route   PUT /api/services/:id
// @access  Private (PROVIDER)
const updateService = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        res.status(400);
        throw new Error('Invalid service ID');
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
        res.status(404);
        throw new Error('Service not found');
    }

    // Validate ownership
    if (service.providerId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this service');
    }

    // Prevent provider from changing approvalStatus or isActive
    const { approvalStatus, rejectionReason, providerId, isActive, ...updateData } = req.body;

    // If service was rejected and provider re-edits, reset to PENDING for re-review
    if (service.approvalStatus === 'REJECTED') {
        updateData.approvalStatus = 'PENDING';
        updateData.rejectionReason = '';
    }

    const updatedService = await Service.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
    );

    res.status(200).json(updatedService);
});

// @desc    Delete provider's own service
// @route   DELETE /api/services/:id
// @access  Private (PROVIDER)
const deleteService = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        res.status(400);
        throw new Error('Invalid service ID');
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
        res.status(404);
        throw new Error('Service not found');
    }

    // Validate ownership
    if (service.providerId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this service');
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({ id: req.params.id, message: 'Service deleted' });
});

// @desc    Get all approved & active services (public listing)
// @route   GET /api/services
// @access  Public (any authenticated user)
const getApprovedServices = asyncHandler(async (req, res) => {
    const services = await Service.find({
        approvalStatus: 'APPROVED',
        isActive: true,
    })
        .populate('providerId', 'name email phone')
        .sort({ createdAt: -1 });

    res.status(200).json(services);
});

module.exports = {
    createService,
    getProviderServices,
    updateService,
    deleteService,
    getApprovedServices,
};
