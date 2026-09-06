const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Valid status transitions
const VALID_TRANSITIONS = {
    PENDING: ['CONFIRMED', 'REJECTED'],
    CONFIRMED: ['COMPLETED'],
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (USER)
const createBooking = asyncHandler(async (req, res) => {
    const { serviceId, date, time, location } = req.body;

    if (!serviceId || !date || !time || !location) {
        res.status(400);
        throw new Error('Please provide serviceId, date, time, and location');
    }

    if (!isValidId(serviceId)) {
        res.status(400);
        throw new Error('Invalid service ID');
    }

    // Verify service exists, is approved, and is active
    const service = await Service.findById(serviceId);

    if (!service) {
        res.status(404);
        throw new Error('Service not found');
    }

    if (service.approvalStatus !== 'APPROVED' || !service.isActive) {
        res.status(400);
        throw new Error('This service is not available for booking');
    }

    // Get providerId from the service (do NOT trust client input)
    const providerId = service.providerId;

    // Double booking prevention
    // Check if provider already has a PENDING or CONFIRMED booking at same date & time
    const conflictingBooking = await Booking.findOne({
        providerId,
        date,
        time,
        status: { $in: ['PENDING', 'CONFIRMED'] },
    });

    if (conflictingBooking) {
        res.status(409);
        throw new Error('This time slot is already booked. Please choose a different date or time.');
    }

    const booking = await Booking.create({
        userId: req.user._id,
        providerId,
        serviceId,
        date,
        time,
        location,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
    });

    // Populate the response for immediate display
    const populatedBooking = await Booking.findById(booking._id)
        .populate('serviceId', 'serviceName category price duration')
        .populate('providerId', 'name email phone')
        .populate('userId', 'name email phone');

    res.status(201).json(populatedBooking);
});

// @desc    Get bookings for logged-in user
// @route   GET /api/bookings/user
// @access  Private (USER)
const getUserBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ userId: req.user._id })
        .populate('serviceId', 'serviceName category price duration')
        .populate('providerId', 'name email phone')
        .sort({ createdAt: -1 });

    res.status(200).json(bookings);
});

// @desc    Get booking requests for logged-in provider
// @route   GET /api/bookings/provider
// @access  Private (PROVIDER)
const getProviderBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ providerId: req.user._id })
        .populate('serviceId', 'serviceName category price duration')
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 });

    res.status(200).json(bookings);
});

// @desc    Update booking status (Provider accepts/rejects/completes)
// @route   PATCH /api/bookings/status
// @access  Private (PROVIDER)
const updateBookingStatus = asyncHandler(async (req, res) => {
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
        res.status(400);
        throw new Error('Please provide bookingId and status');
    }

    if (!isValidId(bookingId)) {
        res.status(400);
        throw new Error('Invalid booking ID');
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    // Verify the provider owns this booking
    if (booking.providerId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this booking');
    }

    // Validate status transition
    const allowedTransitions = VALID_TRANSITIONS[booking.status];

    if (!allowedTransitions || !allowedTransitions.includes(status)) {
        res.status(400);
        throw new Error(
            `Cannot change status from ${booking.status} to ${status}. Allowed: ${allowedTransitions ? allowedTransitions.join(', ') : 'none'}`
        );
    }

    booking.status = status;
    const updatedBooking = await booking.save();

    // Populate for response
    const populatedBooking = await Booking.findById(updatedBooking._id)
        .populate('serviceId', 'serviceName category price duration')
        .populate('userId', 'name email phone')
        .populate('providerId', 'name email phone');

    res.status(200).json(populatedBooking);
});

module.exports = {
    createBooking,
    getUserBookings,
    getProviderBookings,
    updateBookingStatus,
};
