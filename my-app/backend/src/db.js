import mongoose from 'mongoose';

export async function connectDB(uri) {
  await mongoose.connect(uri, { autoIndex: true });
  console.log('✅ MongoDB connected');
}

export function disconnectDB() {
  return mongoose.disconnect();
}
