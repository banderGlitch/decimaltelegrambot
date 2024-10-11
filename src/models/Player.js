import mongoose from 'mongoose';

const purchasedUpgradeSchema = new mongoose.Schema({
    upgradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Upgrade', required: true },
    currentLevel: { type: Number, default: 1 },       // The current level of this upgrade the player owns
    expirationDate: { type: Date }                    // Optional for temporary upgrades
});

const playerSchema = new mongoose.Schema({
    telegramId: { type: String, required: true, unique: true },
    name: { type: String },
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    clickCount: { type: Number, default: 0 },
    streakCount: { type: Number, default: 0 },
    happinessIndex: { type: Number, default: 3 },
    comboBonus: { type: Number, default: 0 },
    lastClickTimestamp: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    purchasedUpgrades: [purchasedUpgradeSchema]
});



const Player = mongoose.model('Player', playerSchema)

export default Player;