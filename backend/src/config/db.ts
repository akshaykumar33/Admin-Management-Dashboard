import mongoose from 'mongoose';
import config from '@/config/config';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log(`
✅ MongoDB Connected: ${mongoose.connection.host}
`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
