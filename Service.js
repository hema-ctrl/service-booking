const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
    {
        providerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        serviceName: {
            type: String,
            required: [true, 'Please add a service name'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            min: [0, 'Price cannot be negative'],
        },
        duration: {
            type: String,
            required: [true, 'Please add a duration'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        approvalStatus: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
            default: 'PENDING',
        },
        rejectionReason: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for performance
serviceSchema.index({ providerId: 1 });
serviceSchema.index({ approvalStatus: 1, isActive: 1 });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
