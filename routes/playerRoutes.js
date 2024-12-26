import express from 'express';
import Player from '../models/Player.js';
import Task from '../models/Task.js';
import ShopUpgrade from '../models/ShopUpgrades.js';

const router = express.Router();
// router.get('/player/:telegramId', async (req, res) => {
//   try {
//     const player = await Player.findOne({ telegramId: req.params.telegramId });
//     res.status(200).json(player);
//   } catch (error) {
//     res.status(500).json({ message: 'Error retrieving player data' });
//   }
// });

// router.post('/purchase-upgrade', async (req, res) => {
//     const { telegramId, upgradeId, costLevel } = req.body;
//     console.log("telegramId----->", telegramId);
//     console.log("upgradeId----->", upgradeId);
//     console.log("costLevel----->", costLevel);
//     try {
//         const updatedPlayer = await Player.findOneAndUpdate(
//           {
//             telegramId: telegramId,  // Filter by telegramId
//             'purchasedUpgrades.upgradeId': upgradeId  // Match the upgradeId in purchasedUpgrades
//           },
//           {
//             $set: {
//               'purchasedUpgrades.$.Costlevel': costLevel,  // Update the Costlevel of the specific upgrade
//               updatedAt: Date.now()  // Update the updatedAt timestamp
//             }
//           },
//           { new: true }  // Return the updated document
//         );
//         res.status(200).json(updatedPlayer);
//       } catch (error) {
//         console.error('Error updating upgrade Costlevel:', error);
//         throw error;
//       }
//     // try {
//     //     const updatedPlayer = await Player.findOneAndUpdate(
//     //       { telegramId: telegramId },  // Filter by telegramId
//     //       {
//     //         $set: { 
//     //           'purchasedUpgrades.$[upgrade].upgradeId': upgradeId,  // Update the upgradeId for a specific upgrade
//     //           'purchasedUpgrades.$[upgrade].Costlevel': costLevel,   // Update the upgrade level
//     //           updatedAt: Date.now()  // Update the updatedAt field
//     //         },
//     //       },
//     //       { 
//     //         new: true,  // Return the updated document
//     //         arrayFilters: [{ 'upgrade.upgradeId': upgradeId }]  // Ensure we target the correct upgrade in the array
//     //       }
//     //     );
//     //     res.status(200).json(updatedPlayer);
//     //   } catch (error) {
//     //     res.status(500).json({ message: 'Error updating player level and upgrade' });
//     //     console.error('Error updating player level and upgrade:', error);
//     //     throw error;
//     //   }


//     // const player = await Player.findOne({telegramId});
//     // const upgrade = await ShopUpgrade.findById(upgradeId);

//     // console.log("points-----1", player.points);
//     // console.log("upgrade----------------->", upgrade);

//     // const playerUpgrade = player.purchasedUpgrades.find(p => p.upgradeId.equals(upgradeId));
//     // console.log("playerUpgrade----------------->", playerUpgrade);
//     // const currentLevel = playerUpgrade ? playerUpgrade.Costlevel  : 0;
//     // console.log("currentLevel----------------->", currentLevel);

//     // const nextLevelCost = upgrade.costs.find(c => c.level === (currentLevel + 1))?.cost;
//     // console.log("nextLevelCost----------------->", nextLevelCost);
//     const nextLevel = currentLevel + 1;
//     console.log("nextLevel----------------->", nextLevel);
//     if (player.points < nextLevelCost) {
//         return res.status(400).json({ message: 'Not enough points to purchase this level of the upgrade' });
//     } 
//     if (upgrade.effect === 'reduce_maintenance') {
//         player.maintenanceCost *= (1 - (0.05 * nextLevel));
//     } else if (upgrade.effect === 'click_efficiency') {
//         player.pointsPerClick *= (1 + (0.02 * nextLevel));
//     }

//     player.points -= nextLevelCost;
//     player.purchasedUpgrades.push({ upgradeId, Costlevel: nextLevel });
//     await player.save();
//     res.status(200).json(player);




//     //         await player.save();
//     //         await upgrade.save();
//     //         res.status(200).json(player);
//     //     } else {
//     //         console.log("Not enough points to purchase this upgrade");
//     //         res.status(400).json({ message: 'something went wrong' });
//     //     }
//     // } else {
//     //     console.log('Upgrade is at max level');
//     // }
// })




// router.post('/purchaseMultiLevelUpgrade', async (req, res) => {
//     const { telegramId, upgradeId } = req.body;
//     try {
//         // Find the player and upgrade from the database
//         const player = await Player.findOne({telegramId});
//         const upgrade = await ShopUpgrade.findById({upgradeId});

//         if (!player || !upgrade) {
//             throw new Error('Player or upgrade not found');
//         }

//         // Check if the upgrade can still be leveled up
//         // if (upgrade.upgradeLevel >= upgrade.maxLevel) {
//         //     console.log('Upgrade is already at max level');
//         //     return;
//         // }

//         // Get the cost for the current upgrade level
//         const currentLevelCost = upgrade.costs.find(costObj => costObj.level === upgrade.upgradeLevel)?.cost;
//         if (!currentLevelCost) {
//             throw new Error('Cost for current level not found');
//         }

//         // Check if the player has enough points
//         if (player.points < currentLevelCost) {
//             console.log('Not enough points to purchase this upgrade');
//             return;
//         }

//         // Deduct the cost from the player's points
//         player.points -= currentLevelCost;

//         // Apply the effect based on the upgrade type
//         if (upgrade.effect === 'reduce_maintenance') {
//             // Reduce maintenance by 5% per level
//             player.maintenanceCost *= (1 - (0.05 * upgrade.upgradeLevel));
//         } else if (upgrade.effect === 'click_efficiency') {
//             // Increase points per click by 2% per level
//             player.pointsPerClick *= (1 + (0.02 * upgrade.upgradeLevel));
//         }

//         // Increment the upgrade's level
//         upgrade.upgradeLevel += 1;

//         // Save the player and the updated upgrade back to the database
//         player.purchasedUpgrades.push(upgradeId);
//         player.updatedAt = new Date();
//         await player.save();
//         await upgrade.save();

//         console.log('Upgrade purchased and applied successfully');
//     } catch (error) {
//         console.error('Error purchasing upgrade:', error.message);
//     }

// })


// clicker api route

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

// router.post('/click', async (req, res) => {
//     const { telegramId } = req.body;
//     const player = await Player.findOne({telegramId});
//     console.log("pointsperclick----->", player.pointsPerClick);
//     player.points += player.pointsPerClick;
//     await player.save();
//     res.status(200).json(player);
// })
// router.post('/updatedplayer', async (req, res) => {

//     try {

//     } catch (error) {

//     }
// })


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





// router.post('/updatedplayerdata', async (req, res) => {
//     try {
//         const { playerdata } = req.body;
//         console.log("playerdata----->", playerdata);

//     } catch (error) {

//     }

// })

export default router;