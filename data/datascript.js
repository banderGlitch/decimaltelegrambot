import mongoose from 'mongoose';
import ShopUpgrade from '../models/ShopUpgrades.js';  // Import your ShopUpgrade model
import Player from '../models/Player.js';  // Import your Player model
import players from './player.js';  // Import players data
import tasks from './taskdata.js';  // Import tasks data
import Task from '../models/Task.js';


const connectDB_upgrades = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');

    // Fetch all upgrades from ShopUpgrade collection
    const shopUpgrades = await ShopUpgrade.find({});
    const upgradesWithCostLevel = shopUpgrades.map((upgrade) => ({
      upgradeId: upgrade._id,
      Costlevel: 0,  // Initialize Costlevel to 0 for all upgrades
    }));

    // Iterate through each player and add the initialized purchasedUpgrades
    const playersWithUpgrades = players.map((player) => ({
      ...player,
      purchasedUpgrades: upgradesWithCostLevel,  // Add the initialized purchasedUpgrades array to each player
    }));

    // Clear existing players collection
    await Player.deleteMany({});
    console.log('Existing players data cleared successfully');

    // Insert new players with initialized upgrades
    await Player.insertMany(playersWithUpgrades);
    console.log('Players data inserted successfully with initialized upgrades');
    await Task.deleteMany({})
    await Task.insertMany(tasks);
    // await Task.deleteMany({});
    console.log('Tasks data inserted successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB_upgrades;

// import mongoose from 'mongoose';
// import ShopUpgrade from '../models/ShopUpgrades.js';
// import Upgrades from './data.js';
// import Player from '../models/Player.js';
// import players from './player.js';
// const connectDB_upgrades = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('MongoDB connected successfully');
//     await Player.deleteMany({});
//     await Player.insertMany(players);
//     console.log('Players data inserted successfully');
//     mongoose.connection.close();
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1);
//   }
// };

// export default connectDB_upgrades;