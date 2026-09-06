const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    User cancels their own booking
// @route   PATCH /api/bookings/cancel
// @access  Private (USER)
const cancelBooking = asyncHandler(async (req, res) => {
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
        throw new Error('Not authorized to cancel this booking');
    }

    // Cancellation allowed only when status is PENDING
    if (booking.status !== 'PENDING') {
        res.status(400);
        throw new Error(
            `Cannot cancel a booking with status ${booking.status}. Only PENDING bookings can be cancelled.`
        );
    }

    booking.status = 'CANCELLED';
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
        .populate('serviceId', 'serviceName category price duration')
        .populate('providerId', 'name email phone')
        .populate('userId', 'name email phone');

    res.status(200).json(populatedBooking);
});

module.exports = {
    cancelBooking,
};
