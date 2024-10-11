import mongoose from 'mongoose';

const upgradeLevelSchema = new mongoose.Schema({
    levelNumber: { type: Number, required: true },
    cost: { type: Number, required: true },           // Cost of this level
    effectValue: { type: Number, required: true },    // Value of the boost (e.g., 1.5x for earning, -10% for maintenance)
});

const upgradeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['earningBoost', 'maintenanceReduction', 'levelUp', 'happinessBoost', 'autoClicker'], required: true },
    levels: [upgradeLevelSchema],                     // Array of levels for this upgrade
    unlockLevel: { type: Number, default: 0 }         // Minimum player level required to purchase this upgrade
});

export default mongoose.model('Upgrade', upgradeSchema);