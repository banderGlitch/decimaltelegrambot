import mongoose from 'mongoose';
import Upgrade from '../src/models/upgradeSchema.js';
import Upgrades from './upgradesdata.js';
const connectDB_upgrades = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
    await Upgrade.deleteMany({});
    await Upgrade.insertMany(Upgrades);
    console.log('Upgrades data inserted successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB_upgrades;