const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        providerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Service',
        },
        date: {
            type: String,
            required: [true, 'Please add a booking date'],
        },
        time: {
            type: String,
            required: [true, 'Please add a booking time'],
        },
        location: {
            type: String,
            required: [true, 'Please add a location'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['PENDING', 'CONFIRMED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
            default: 'PENDING',
        },
        paymentStatus: {
            type: String,
            enum: ['UNPAID', 'PAID'],
            default: 'UNPAID',
        },
        paymentId: {
            type: String,
            default: null,
        },
        paymentDate: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for performance
bookingSchema.index({ userId: 1 });
bookingSchema.index({ providerId: 1 });
bookingSchema.index({ providerId: 1, date: 1, time: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
