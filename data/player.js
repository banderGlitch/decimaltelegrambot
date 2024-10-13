import mongoose from 'mongoose';

// Create the ObjectId values separately
const upgradeId1 = new mongoose.Types.ObjectId('6526fa5f0d1b89a8f47d1dfb');
const upgradeId2 = new mongoose.Types.ObjectId('6526fa5f0d1b89a8f47d1dfc');

const players = [
    {
      "telegramId": "123456789",
      "username": "PlayerOne",
      "points": 450,
      "level": 3,
      "happinessIndex": 4,
      "maintenanceCost": 20,
      "pointsPerClick": 12,
      "lastClickTimestamp": new Date("2024-10-11T09:00:00Z"),
      "clickComboCount": 10,
      "completedTasks": [],
      "purchasedUpgrades": [
        {
          upgrade: upgradeId1,  // Correct ObjectId reference
          level: 2              // The level of the upgrade purchased
        },
        {
          upgrade: upgradeId2,  // Correct ObjectId reference
          level: 1              // The level of the upgrade purchased
        }
      ],
      "activeBoosts": [],
      "createdAt": new Date("2024-10-10T12:00:00Z"),
      "updatedAt": new Date("2024-10-11T09:00:00Z")
    },
];

export default players;
