const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');

// @desc    Get all bookings (admin view)
// @route   GET /api/admin/bookings
// @access  Private (ADMIN)
const getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find()
        .populate('userId', 'name email phone')
        .populate('providerId', 'name email phone')
        .populate('serviceId', 'serviceName category price duration')
        .sort({ createdAt: -1 });

    res.status(200).json(bookings);
});

// @desc    Get all users (admin view)
// @route   GET /api/admin/users
// @access  Private (ADMIN)
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find()
        .select('name email role phone createdAt')
        .sort({ createdAt: -1 });

    res.status(200).json(users);
});

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (ADMIN)
const getAnalytics = asyncHandler(async (req, res) => {
    const [totalUsers, totalProviders, totalBookings, totalServices] = await Promise.all([
        User.countDocuments({ role: 'USER' }),
        User.countDocuments({ role: 'PROVIDER' }),
        Booking.countDocuments(),
        Service.countDocuments({ approvalStatus: 'APPROVED', isActive: true }),
    ]);

    const bookingsByStatus = await Booking.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statusCounts = {};
    bookingsByStatus.forEach((item) => {
        statusCounts[item._id] = item.count;
    });

    res.status(200).json({
        totalUsers,
        totalProviders,
        totalBookings,
        totalServices,
        bookingsByStatus: statusCounts,
    });
});

module.exports = {
    getAllBookings,
    getAllUsers,
    getAnalytics,
};
