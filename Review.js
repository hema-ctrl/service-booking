const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Service',
        },
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Booking',
        },
        rating: {
            type: Number,
            required: [true, 'Please add a rating between 1 and 5'],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate review: one review per user per booking
reviewSchema.index({ userId: 1, bookingId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
