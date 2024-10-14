import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import Player from './models/Player.js';
import Task from './models/Task.js';
import ShopUpgrade from './models/ShopUpgrades.js';  // Import the ShopUpgrade model

dotenv.config();

const web_link = "https://11octfrontend.d202isk1www69l.amplifyapp.com/";

if (!process.env.TELEGRAM_TOKEN) {
  throw new Error("Telegram token not found in environment variables.");
}

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// Function to initialize purchasedUpgrades for new players
const initializePurchasedUpgrades = async () => {
  const shopUpgrades = await ShopUpgrade.find({});
  return shopUpgrades.map((upgrade) => ({
    upgradeId: upgrade._id,
    Costlevel: 0  // Initialize Costlevel to 0
  }));
};

const initializeTask = async () => {
    const Usertasks = await Task.find({});
    console.log("usertasks-------------->",Usertasks)
    return Usertasks.map((task) => ({
        taskId: task._id,
        completed: false
    }));
}



// Function to send game link
const sendGameLink = async (ctx, player) => {
    const userDataParams = new URLSearchParams({
        telegramId: player.telegramId,
        username: player.username,
        points: player.points || 0,
        level: player.level || 1,
        happinessIndex: player.happinessIndex || 50,
        maintenanceCost: player.maintenanceCost || 0,
        pointsPerClick: player.pointsPerClick || 1,
        clickComboCount: player.clickComboCount || 0,
        lastClickTimestamp: player.lastClickTimestamp?.toISOString() || new Date().toISOString(),
        createdAt: player.createdAt.toISOString(),
        purchasedUpgrades: JSON.stringify(player.purchasedUpgrades || []),
        tasks: JSON.stringify(player.tasks || []),
        activeBoosts: JSON.stringify(player.activeBoosts || []),
    }).toString();

    const welcomeMessage = player.isNew ? 'Welcome to the Clicker Game!' : 'Welcome back!';
    console.log(`web_link--------->: ${web_link}?${userDataParams}`);

    await ctx.reply(`${welcomeMessage}! Let's start the game.`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Open app', web_app: { url: `${web_link}?${userDataParams}` }}]
          ]
        }
    });
};

// Set up bot commands for the menu
bot.telegram.setMyCommands([
  { command: 'start', description: 'Start the game' },
  { command: 'click', description: 'Click to earn points' },
  { command: 'stats', description: 'View your game stats' },
]);

// bot start command
bot.start(async (ctx) => {
    console.log(`ctx.message.from: ${ctx.message.from}`);
    const { id: telegramId, username } = ctx.message.from;
    console.log(`telegramId: ${telegramId}, username: ${username}`);

    try {
        let player = await Player.findOne({ telegramId });

        if (!player) {
            // If player doesn't exist, initialize purchasedUpgrades and create a new player
            const purchasedUpgrades = await initializePurchasedUpgrades();
            const tasks = await initializeTask();
            player = new Player({ 
              telegramId, 
              username, 
              purchasedUpgrades,
              tasks
            });
            await player.save();
        }

        await sendGameLink(ctx, player);

        // Delete up to 10 previous messages
        const messageId = ctx.message.message_id;
        for (let i = messageId - 1; i > messageId - 50; i--) {
            try {
                await ctx.deleteMessage(i);
            } catch (deleteError) {
                console.log(`Could not delete message ${i}. It might be too old or already deleted.`);
                // Break the loop if we encounter an error, as older messages are likely to fail too
                break;
            }
        }
    } catch (error) {
        console.error('Error fetching or saving player data:', error);
        ctx.reply('Sorry, an error occurred while processing your request.');
    }
});


// bot click command
bot.command('click', async (ctx) => {
    try {
        const telegramId = ctx.from.id;
        let player = await Player.findOne({ telegramId });
        console.log("---------------", player);

        if (!player) {
            ctx.reply('Please start the game with /start');
            return;
        }

        player.points += player.pointsPerClick;
        await player.save();

        ctx.reply(`You clicked! Your points are now ${player.points}.`);
    } catch (error) {
        console.error(error);
        ctx.reply('An error occurred while processing your click. Please try again later.');
    }
});

// Add a new stats command
bot.command('stats', async (ctx) => {
    const telegramId = ctx.from.id;
    try {
        const player = await Player.findOne({ telegramId });
        if (player) {
            const stats = `
                      Your Stats:
                     Points: ${player.points}
                     Level: ${player.level}
Happiness Index: ${player.happinessIndex}
Points Per Click: ${player.pointsPerClick}
                       `;
            ctx.reply(stats);
        } else {
            ctx.reply('Please start the game with /start first.');
        }
    } catch (error) {
        console.error('Error fetching player stats:', error);
        ctx.reply('An error occurred while fetching your stats. Please try again.');
    }
});

export default bot;
// import { Telegraf } from 'telegraf';
// import dotenv from 'dotenv';
// import Player from './models/Player.js';
// import ShopUpgrade from './models/ShopUpgrades.js';  // Import the ShopUpgrade model

// dotenv.config();

// const web_link = "https://11octfrontend.d202isk1www69l.amplifyapp.com/";

// if (!process.env.TELEGRAM_TOKEN) {
//   throw new Error("Telegram token not found in environment variables.");
// }

// const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// // Function to initialize purchasedUpgrades for new players
// const initializePurchasedUpgrades = async () => {
//   const shopUpgrades = await ShopUpgrade.find({});
//   return shopUpgrades.map((upgrade) => ({
//     upgradeId: upgrade._id,
//     Costlevel: 0  // Initialize Costlevel to 0
//   }));
// };



// // bot start command
// bot.start(async (ctx) => {
//     console.log(`ctx.message.from: ${ctx.message.from}`);
//     const { id: telegramId, username } = ctx.message.from;
//     console.log(`telegramId: ${telegramId}, username: ${username}`);

//     try {
//         let player = await Player.findOne({ telegramId });

//         if (!player) {
//             // If player doesn't exist, initialize purchasedUpgrades and create a new player
//             const purchasedUpgrades = await initializePurchasedUpgrades();
//             player = new Player({ 
//               telegramId, 
//               username, 
//               purchasedUpgrades  // Add initialized upgrades to the player
//             });
//             await player.save();
//         }

//         const userDataParams = new URLSearchParams({
//             telegramId: player.telegramId,
//             username: player.username,
//             points: player.points || 0,
//             level: player.level || 1,
//             happinessIndex: player.happinessIndex || 50,
//             maintenanceCost: player.maintenanceCost || 0,
//             pointsPerClick: player.pointsPerClick || 1,
//             clickComboCount: player.clickComboCount || 0,
//             lastClickTimestamp: player.lastClickTimestamp?.toISOString() || new Date().toISOString(),
//             createdAt: player.createdAt.toISOString(),
//             purchasedUpgrades: JSON.stringify(player.purchasedUpgrades || []),
//             activeBoosts: JSON.stringify(player.activeBoosts || []),
//         }).toString();

//         const welcomeMessage = player.isNew ? 'Welcome to the Clicker Game!' : 'Welcome back!';
//         console.log(`web_link--------->: ${web_link}?${userDataParams}`);

//         // Send message with the inline button linking to your app
//         await ctx.reply(`${welcomeMessage}! Let's start the game.`, {
//             reply_markup: {
//               inline_keyboard: [
//                 [{ text: 'Open app', web_app: { url: `${web_link}?${userDataParams}` }}]
//               ]
//             }
//         });

//           // Find player by telegramId
//           const messageId = ctx.message.message_id;
        
//           // Delete up to 10 previous messages
//           for (let i = messageId - 1; i > messageId - 11; i--) {
//               try {
//                   await ctx.deleteMessage(i);
//               } catch (deleteError) {
//                   console.log(`Could not delete message ${i}. It might be too old or already deleted.`);
//                   // Break the loop if we encounter an error, as older messages are likely to fail too
//                   break;
//               }
//           }

        
//     } catch (error) {
//         console.error('Error fetching or saving player data:', error);
//         ctx.reply('Sorry, an error occurred while processing your request.');
//     }
// });

// // bot click command
// bot.command('click', async (ctx) => {
//     try {
//         const telegramId = ctx.from.id;
//         let player = await Player.findOne({ telegramId });
//         console.log("---------------", player);

//         if (!player) {
//             ctx.reply('Please start the game with /start');
//             return;
//         }

//         player.points += player.pointsPerClick;
//         await player.save();

//         ctx.reply(`You clicked! Your points are now ${player.points}.`);
//     } catch (error) {
//         console.error(error);
//         ctx.reply('An error occurred while processing your click. Please try again later.');
//     }
// });



// export default bot;
