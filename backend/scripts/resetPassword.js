import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';

async function main() {
  const email = process.argv[2] || 'shahdanyara@gmail.com';
  const newPassword = process.argv[3] || 'Admin@123';

  await connectDB();
  const user = await User.findOne({ email });

  if (!user) {
    console.error(`User not found with email: ${email}`);
    await disconnectDB();
    process.exit(1);
  }

  // Pre-save hook hashes passwordHash
  user.passwordHash = newPassword;
  await user.save();

  console.log(`Successfully updated password for ${user.email} (${user.fullName}) to: ${newPassword}`);
  await disconnectDB();
  process.exit(0);
}

main().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
});
