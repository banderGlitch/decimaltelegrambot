import mongoose from 'mongoose';

const shopUpgradeSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Name of the upgrade
    description: { type: String, required: true },  // Description of the upgrade
    effect: { type: String, required: true },  // Effect (e.g., "level_up", "double_points", "reduce_maintenance")
    duration: { type: Number, default: 0 },  // Duration in minutes (0 means permanent)
    upgradeLevel: { type: Number, default: 1 },  // The current level of the upgrade
    maxLevel: { type: Number, default: 1 },  // Maximum level for this upgrade
    costs: [{ level: Number, cost: Number }],  // Array of costs for each upgrade level
    active: { type: Boolean, default: true }  // Whether the upgrade is currently active
  });
  
  const ShopUpgrade = mongoose.model('ShopUpgrade', shopUpgradeSchema);
  
  export default ShopUpgrade;
  