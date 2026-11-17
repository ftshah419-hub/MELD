import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is missing.');
  }

  // Safely sanitize URI for logs (hide password)
  const sanitizedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} | Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] Failed connecting to ${sanitizedUri}`);
    console.error(`[MongoDB Error Details] ${error.message}`);
    throw error;
  }
};

/**
 * Event listeners for MongoDB connection state
 */
mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Connection disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[MongoDB Event Error] ${err.message}`);
});

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected successfully.');
  }
};

export default connectDB;
