const mongoose = require('mongoose');
const User = require('../models/User');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed default admin user if not present
    const adminExists = await User.findOne({ email: 'admin@ecommerce.com' });
    if (!adminExists) {
      await User.create({
        name: 'Administrator',
        email: 'admin@ecommerce.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('Seeded default admin user (admin@ecommerce.com / password123)');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
