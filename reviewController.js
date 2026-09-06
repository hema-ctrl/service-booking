const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Review = require('../models/Review');
const Booking = require('../models/Booking');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private (USER)
const createReview = asyncHandler(async (req, res) => {
    const { serviceId, bookingId, rating, comment } = req.body;

    if (!serviceId || !bookingId || rating === undefined) {
        res.status(400);
        throw new Error('Please provide serviceId, bookingId, and rating');
    }

    if (!isValidId(serviceId) || !isValidId(bookingId)) {
        res.status(400);
        throw new Error('Invalid service or booking ID');
    }

    // Convert rating to number
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        res.status(400);
        throw new Error('Rating must be a number between 1 and 5');
    }

    // 1. Verify booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    // 2. Verify user owns the booking
    if (booking.userId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to review this booking');
    }

    // 3. Verify booking status is COMPLETED
    if (booking.status !== 'COMPLETED') {
        res.status(400);
        throw new Error('You can only review completed services');
    }

    // 4. Verify booking serviceId matches the provided serviceId
    if (booking.serviceId.toString() !== serviceId) {
        res.status(400);
        throw new Error('Service ID does not match the booking');
    }

    // 5. Prevent duplicate review
    const existingReview = await Review.findOne({ bookingId: booking._id });
    if (existingReview) {
        res.status(400);
        throw new Error('You have already reviewed this booking');
    }

    // Create review
    const review = await Review.create({
        userId: req.user._id,
        serviceId,
        bookingId,
        rating: numRating,
        comment: comment || '',
    });

    const populatedReview = await Review.findById(review._id).populate('userId', 'name');

    res.status(201).json(populatedReview);
});

// @desc    Get reviews for a service
// @route   GET /api/reviews/:serviceId
// @access  Public or Protected depending on use case (Authenticated users browsing services)
const getServiceReviews = asyncHandler(async (req, res) => {
    const { serviceId } = req.params;

    if (!isValidId(serviceId)) {
        res.status(400);
        throw new Error('Invalid service ID');
    }

    const reviews = await Review.find({ serviceId })
        .populate('userId', 'name')
        .sort({ createdAt: -1 });

    res.status(200).json(reviews);
});

module.exports = {
    createReview,
    getServiceReviews,
};
