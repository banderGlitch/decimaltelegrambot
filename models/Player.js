import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    telegramId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    happinessIndex: { type: Number, default: 3 },
    maintenanceCost: { type: Number, default: 10 },
    pointsPerClick: { type: Number, default: 10 },  // Tracks the points earned per click
    lastClickTimestamp: { type: Date, default: Date.now },
    clickComboCount: { type: Number, default: 0 },
    completedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    purchasedUpgrades: [{ upgradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopUpgrade' },  Costlevel: { type: Number, default: 0 } }],
    activeBoosts: [{ effect: String, expiresAt: Date }],  // Track temporary boosts with expiration times
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  const Player = mongoose.model('Player', playerSchema);
  
  export default Player;
  