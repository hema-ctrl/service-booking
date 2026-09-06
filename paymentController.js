const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const crypto = require('crypto');
const Booking = require('../models/Booking');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Generate a demo payment ID
const generatePaymentId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `PAY-${timestamp}-${random}`;
};

// @desc    Process demo payment for a booking
// @route   POST /api/payments
// @access  Private (USER)
const processPayment = asyncHandler(async (req, res) => {
    const { bookingId } = req.body;

    if (!bookingId) {
        res.status(400);
        throw new Error('Please provide bookingId');
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

    // Verify the user owns this booking
    if (booking.userId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to pay for this booking');
    }

    // Booking must be CONFIRMED to accept payment
    if (booking.status !== 'CONFIRMED') {
        res.status(400);
        throw new Error(
            `Cannot process payment for a booking with status ${booking.status}. Only CONFIRMED bookings can be paid.`
        );
    }

    // Prevent duplicate payment
    if (booking.paymentStatus === 'PAID') {
        res.status(400);
        throw new Error('This booking has already been paid');
    }

    // Process demo payment
    const paymentId = generatePaymentId();
    const paymentDate = new Date();

    booking.paymentStatus = 'PAID';
    booking.paymentId = paymentId;
    booking.paymentDate = paymentDate;
    await booking.save();

    // Populate for response
    const populatedBooking = await Booking.findById(booking._id)
        .populate('serviceId', 'serviceName category price duration')
        .populate('providerId', 'name email phone')
        .populate('userId', 'name email phone');

    res.status(200).json({
        message: 'Payment processed successfully',
        paymentId,
        paymentDate,
        booking: populatedBooking,
    });
});

// @desc    Get payment details for a booking
// @route   GET /api/payments/:bookingId
// @access  Private (USER)
const getPaymentDetails = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    if (!isValidId(bookingId)) {
        res.status(400);
        throw new Error('Invalid booking ID');
    }

    const booking = await Booking.findById(bookingId)
        .populate('serviceId', 'serviceName category price duration')
        .populate('providerId', 'name email phone')
        .populate('userId', 'name email phone');

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    // Verify the user owns this booking
    if (booking.userId._id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view this payment');
    }

    if (booking.paymentStatus !== 'PAID') {
        res.status(400);
        throw new Error('No payment found for this booking');
    }

    res.status(200).json({
        paymentId: booking.paymentId,
        paymentDate: booking.paymentDate,
        paymentStatus: booking.paymentStatus,
        booking,
    });
});

module.exports = {
    processPayment,
    getPaymentDetails,
};
