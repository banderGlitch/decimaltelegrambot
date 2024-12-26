import express from 'express';
import Player from '../models/Player.js';
import Task from '../models/Task.js';
import ShopUpgrade from '../models/ShopUpgrades.js';

const router = express.Router();


router.post('/click', async (req, res) => {
    try {
        const { telegramId, clickComboCount } = req.body;
        console.log("clickComboCount----->", clickComboCount);
        const player = await Player.findOne({ telegramId });

        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        // Update clickComboCount in the database
        player.clickComboCount = clickComboCount || 1;

        // Calculate points with combo multiplier
        const pointsToAdd = player.pointsPerClick * player.clickComboCount;
        console.log("pointsPerClick----->", player.pointsPerClick);
        console.log("clickComboCount----->", player.clickComboCount);
        console.log("pointsToAdd----->", pointsToAdd);

        // Add points with combo multiplier
        player.points += pointsToAdd;

        // Update lastClickTimestamp
        player.lastClickTimestamp = new Date();

        // Save all updates
        await player.save();

        res.status(200).json(player);
    } catch (error) {
        console.error('Error processing click:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.get('/shop-upgrades', async (req, res) => {
    try {
        const shopUpgrade = await ShopUpgrade.find();
        res.status(200).json(shopUpgrade);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving shop upgrades' });
    }
})

router.get('/gettasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tasks' });
    }
})


router.post('/updatedplayerdata', async (req, res) => {
    try {
        const { playerData } = req.body;
        console.log("playerdata-------->", playerData);

        if (!playerData || !playerData.telegramId) {
            return res.status(400).json({ message: 'Invalid player data or missing telegramId' });
        }

        const updatedPlayer = await Player.findOneAndUpdate(
            { telegramId: playerData.telegramId },
            {
                $set: {
                    points: playerData.points,
                    level: playerData.level,
                    happinessIndex: playerData.happinessIndex,
                    maintenanceCost: playerData.maintenanceCost,
                    pointsPerClick: playerData.pointsPerClick,
                    lastClickTimestamp: playerData.lastClickTimestamp,
                    purchasedUpgrades: playerData.purchasedUpgrades,
                    tasks: playerData.tasks,
                    updatedAt: new Date(),
                    // Add other fields you want to update
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedPlayer) {
            return res.status(404).json({ message: 'Player not found' });
        }

        res.status(200).json(updatedPlayer);
    } catch (error) {
        console.error('Error updating player data:', error);
        res.status(500).json({ message: 'Error updating player data', error: error.message });
    }
});



router.post('/streaks', async (req, res) => {
    try {
        const { telegramId } = req.body;
        const player = await Player.findOne({ telegramId });

        const now = new Date();
        const utcNow = Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds()
        );


        const lastLogin = new Date(player.lastLoginDate);
        const utcLastLogin = Date.UTC(
            lastLogin.getUTCFullYear(),
            lastLogin.getUTCMonth(),
            lastLogin.getUTCDate(),
            lastLogin.getUTCHours(),
            lastLogin.getUTCMinutes(),
            lastLogin.getUTCSeconds()
        );


        // Calculate hours difference using UTC times

        const hoursDiff = (utcNow - utcLastLogin) / (1000 * 60 * 60);



        // Check if it's a new day (24 hours) but not more than 48 hours

        if (hoursDiff >= 24 && hoursDiff < 48) {
            // Increment streak
            player.streakCount += 1;
        }

        // If more than 48 hours have passed, reset streak
        else if (hoursDiff >= 48) {
            player.streakCount = 1;
        }
        // If less than 24 hours, keep current streak

        // Store UTC timestamp
        player.lastLoginDate = new Date(utcNow);
        await player.save();
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ message: 'Error updating streak' });
    }
})



export default router;