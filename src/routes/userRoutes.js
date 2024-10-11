import express from 'express';
import Player from '../models/Player.js';
import Task from '../models/Task.js';
import Level from '../models/levelSchema.js';
import Upgrade from '../models/upgradeSchema.js';
import { GetTasks } from '../controllers/taskController.js';

const router = express.Router();

router.get('/getTasks', GetTasks);

router.post('/verify_task', async (req, res) => {
    const { telegramId, taskCode } = req.body;
    const player = await Player.findOne({ telegramId });
    const task = await Task.findOne({ taskCode });

    if (player && task && !player.completedTasks.includes(task._id)) {
        // Verification logic can go here (like API check for Twitter follow)
        player.points += task.pointsReward;
        player.completedTasks.push(task._id);
        await player.save();
        return res.status(200).json({ message: 'Task completed!', points: player.points });
    }
    res.status(400).json({ message: 'Task already completed or invalid' });
});


// POST /click
router.post('/click', async (req, res) => {
    try {
        const { telegramId } = req.body;
        console.log("telegramId---->",telegramId);
        let player = await Player.findOne({ telegramId });

        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        // Fetch current level details
        const currentLevel = await Level.findOne({ levelNumber: player.level });
        
        // Calculate the new points, taking into account combo bonuses
        const basePoints = 1; // Set base points per click
        const comboMultiplier = 1 + (player.comboBonus / 100); // Example: 5% bonus for combos
        const pointsEarned = Math.floor(basePoints * (currentLevel.earningBoost || 1) * comboMultiplier);
        
        // Update player’s points and click count
        player.points += pointsEarned;
        player.clickCount += 1;

        // Check if player qualifies for a level-up
        const nextLevel = await Level.findOne({ levelNumber: player.level + 1 });
        if (nextLevel && player.points >= nextLevel.pointsRequired) {
            player.level += 1;
        }

        // Check and update the happiness index based on maintenance costs and player’s funds
        const maintenanceCost = 10 + player.level * 2; // Example: maintenance cost increases with level
        if (player.points < maintenanceCost) {
            player.happinessIndex = Math.max(player.happinessIndex - 1, 1); // Decrease happiness, min of 1
        } else {
            player.points -= maintenanceCost; // Deduct maintenance cost
        }

        // Reset combo if last click was over a certain timeframe, otherwise increase combo
        const timeSinceLastClick = Date.now() - player.lastClickTimestamp;
        if (timeSinceLastClick > 60000) { // 60 seconds
            player.comboBonus = 0; // Reset combo if too much time has passed
        } else {
            player.comboBonus += 1; // Increment combo if clicks are fast
        }

        // Update the last click timestamp and save the player
        player.lastClickTimestamp = Date.now();
        await player.save();

        // Send response with updated player details
        res.status(200).json({
            message: `You clicked and earned ${pointsEarned} points!`,
            player: {
                points: player.points,
                level: player.level,
                happinessIndex: player.happinessIndex,
                comboBonus: player.comboBonus,
                clickCount: player.clickCount,
                lastClickTimestamp: player.lastClickTimestamp,
                createdAt: player.createdAt,
                streakCount : player.streakCount,
                purchasedUpgrades: player.purchasedUpgrades
            }
        });
    } catch (error) {
        console.error('Error in /click route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /purchase
router.post('/purchase', async (req, res) => {
    try {
        const { telegramId, upgradeId } = req.body;
        const player = await Player.findOne({ telegramId });
        const upgrade = await Upgrade.findById(upgradeId);

        if (!player || !upgrade) {
            return res.status(404).json({ message: 'Player or upgrade not found' });
        }

        // Find player's current level of the upgrade
        const playerUpgrade = player.purchasedUpgrades.find(u => u.upgradeId.toString() === upgradeId);
        const currentLevel = playerUpgrade ? playerUpgrade.currentLevel : 0;
        
        // Check if there's a next level available
        const nextLevelData = upgrade.levels.find(l => l.levelNumber === currentLevel + 1);
        if (!nextLevelData) {
            return res.status(400).json({ message: 'No higher level available for this upgrade' });
        }

        // Check if the player has enough points and meets level requirement
        if (player.level < upgrade.unlockLevel) {
            return res.status(400).json({ message: `You need to reach level ${upgrade.unlockLevel} to purchase this upgrade` });
        }
        
        if (player.points < nextLevelData.cost) {
            return res.status(400).json({ message: 'Not enough points to purchase this level of the upgrade' });
        }

        // Deduct points and update or add the upgrade level to player
        player.points -= nextLevelData.cost;

        if (playerUpgrade) {
            playerUpgrade.currentLevel += 1;
        } else {
            player.purchasedUpgrades.push({
                upgradeId: upgrade._id,
                currentLevel: 1,
                expirationDate: nextLevelData.duration ? new Date(Date.now() + nextLevelData.duration * 60000) : null
            });
        }

        await player.save();
        res.status(200).json({ message: `Purchased ${upgrade.name} Level ${nextLevelData.levelNumber}`, player });
    } catch (error) {
        console.error('Error in /purchase route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getUpgrades', async (req, res) => {
    try {
        const upgrades = await Upgrade.find();
        res.status(200).json({ upgrades });
    } catch (error) {
        console.error('Error in /getUpgrades route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;

// import express from 'express';
// import { getUser, updateCoins, getUserSpecific } from '../controllers/userController.js';
// import { GetTasks, CreateTask, updateTaskStatus } from '../controllers/taskController.js';
// import { addTaskToUser } from '../controllers/userTaskController.js';

// const router = express.Router();

// // post or check user when  apps is opened
// router.post('/getUser', getUser);
// // post user's coins 
// router.post('/updateCoins', updateCoins);
// // get  when user specific data is needed
// router.get('/getUserSpecific/:telegramId', getUserSpecific);

// // get tasks
// router.get('/getTasks', GetTasks);
// // create task
// router.post('/createTask', CreateTask);
// // update task status
// router.post('/updateTaskStatus', updateTaskStatus);
// // add task to user
// router.post('/addTaskToUser', addTaskToUser);


// export default router;

