import mongoose from 'mongoose';
import User from '@/models/User.model';
import config from '@/config/config';

const seedAdmin = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: config.defaultAdmin.email });
    if (existingAdmin) {
      console.log('⚠️ Default admin user already exists');
      process.exit(0);
    }

    const admin = new User({
      username: config.defaultAdmin.username,
      email: config.defaultAdmin.email,
      password: config.defaultAdmin.password,
      role: 'admin',
      isActive: true,
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        department: 'Management'
      }
    });

    await admin.save();

    console.log(`
==============================
✅ Default Admin User Created!
==============================
Username: ${admin.username}
Email: ${admin.email}
Password: ${config.defaultAdmin.password}
==============================
⚠️ Please change this password ASAP on first login.
==============================
`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
