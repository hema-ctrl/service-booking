const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'ADMIN' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists:');
            console.log(`   Email : ${existingAdmin.email}`);
            console.log(`   Role  : ${existingAdmin.role}`);
            console.log('Seeder skipped. No changes made.');
            process.exit(0);
        }

        // Create default admin
        const adminData = {
            name: 'Super Admin',
            email: 'admin@servicebooking.com',
            password: 'Admin@1234',
            role: 'ADMIN',
            phone: '0000000000',
        };

        const admin = await User.create(adminData);

        console.log('✅ Admin user created successfully!');
        console.log('─────────────────────────────────');
        console.log(`   Name  : ${admin.name}`);
        console.log(`   Email : ${admin.email}`);
        console.log(`   Role  : ${admin.role}`);
        console.log('─────────────────────────────────');
        console.log('⚠️  IMPORTANT: Change the admin password after first login!');

        process.exit(0);
    } catch (error) {
        console.error(`❌ Seeder Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
