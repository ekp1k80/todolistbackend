import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_DATABASE_URL as string);
    console.log('Connecting to MongoDB');
  } catch (error) {
    console.error('Connection error with MongoDB:', error);
    throw new Error('Connection error with MongoDB');
  }
};
