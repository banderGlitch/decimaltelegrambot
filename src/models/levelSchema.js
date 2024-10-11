
import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema({
    levelNumber: { type: Number, required: true, unique: true },
    pointsRequired: { type: Number, required: true },
    earningBoost: { type: Number, default: 1 },         // Multiplier for points earned per click
    maintenanceReduction: { type: Number, default: 0 }, // Percentage reduction in maintenance cost
    additionalPerks: { type: String }                   // Optional: Any other perks or descriptions for this level
});

export default mongoose.model('Level', levelSchema);
