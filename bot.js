import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import Player from './models/Player.js';
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

// bot start command
bot.start(async (ctx) => {
    console.log(`ctx.message.from: ${ctx.message.from}`);
    const { id: telegramId, username } = ctx.message.from;
    console.log(`telegramId: ${telegramId}, username: ${username}`);

    try {
        // Find player by telegramId
        let player = await Player.findOne({ telegramId });

        if (!player) {
            // If player doesn't exist, initialize purchasedUpgrades and create a new player
            const purchasedUpgrades = await initializePurchasedUpgrades();
            player = new Player({ 
              telegramId, 
              username, 
              purchasedUpgrades  // Add initialized upgrades to the player
            });
            await player.save();
        }

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
            activeBoosts: JSON.stringify(player.activeBoosts || []),
        }).toString();

        const welcomeMessage = player.isNew ? 'Welcome to the Clicker Game!' : 'Welcome back!';
        console.log(`web_link--------->: ${web_link}?${userDataParams}`);

        // Send message with the inline button linking to your app
        await ctx.reply(`${welcomeMessage}! Let's start the game.`, {
            reply_markup: {
              inline_keyboard: [
                [{ text: 'Open app', web_app: { url: `${web_link}?${userDataParams}` } }]
              ]
            }
        });
        
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

export default bot;


// import { Telegraf } from 'telegraf';
// import dotenv from 'dotenv';
// import Player from './models/Player.js';

// dotenv.config();

// const web_link = "https://11octfrontend.d202isk1www69l.amplifyapp.com/";

// if (!process.env.TELEGRAM_TOKEN) {
//   throw new Error("Telegram token not found in environment variables.");
// }

// const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// // bot start command
// bot.start(async (ctx) => {
//     console.log(`ctx.message.from: ${ctx.message.from}`);
//     const { id: telegramId, username } = ctx.message.from;
//     console.log(`telegramId: ${telegramId}, username: ${username}`);

//     try {
//         let player = await Player.findOne({ telegramId });
        
//         if (!player) {
//             player = new Player({ telegramId, username });
//             await player.save();
//         }

//         const userDataParams = new URLSearchParams({
//             telegramId: player.telegramId,
//             username: player.username,
//             points: player.points || 0,
//             level: player.level || 1,
//             happinessIndex: player.happinessIndex || 50, // to be discussed
//             maintenanceCost: player.maintenanceCost || 0,
//             pointsPerClick: player.pointsPerClick || 1,
//             clickComboCount: player.clickComboCount || 0,
//             lastClickTimestamp: player.lastClickTimestamp?.toISOString() || new Date().toISOString(),
//             createdAt: player.createdAt.toISOString(),
//             purchasedUpgrades: JSON.stringify(player.purchasedUpgrades || []),
//             activeBoosts: JSON.stringify(player.activeBoosts || [])
//         }).toString();

//         const welcomeMessage = player.isNew ? 'Welcome to the Clicker Game!' : 'Welcome back!';
//         // ctx.reply(`${welcomeMessage} ${web_link}?${userDataParams}`);
//         console.log(`web_link--------->: ${web_link}?${userDataParams}`);

//         await ctx.reply(`${welcomeMessage}! Let's start the game.`, {
//             reply_markup: {
//               inline_keyboard: [
//                 [{ text: 'Open app', web_app: { url:  `${web_link}?${userDataParams}` } }]
//               ]
//             }
//           });
        
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
//         console.log("---------------",player);

//     if (!player) {
//         ctx.reply('Please start the game with /start');
//         return;
//     }

//     player.points += player.pointsPerClick;
//     // player.clickCount += player.pointsPerClick;
//     await player.save();

//         ctx.reply(`You clicked! Your points are now ${player.points}.`);
//     } catch (error) {
//         console.error(error);
//         ctx.reply('An error occurred while processing your click. Please try again later.');
//     }
// });


// export default bot;







// import { Telegraf } from 'telegraf';
// import dotenv from 'dotenv';
// import Player from './models/Player.js';

// dotenv.config();

// const web_link = "https://hippofrontend.d46o2iybsl4di.amplifyapp.com/";

// const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// bot.start(async (ctx) => {
//     const telegramId = ctx.message.from.id;
//     let player = await Player.findOne({ telegramId });
//     if (!player) {
//         player = new Player({ telegramId });
//         await player.save();
//         const userDataParams = new URLSearchParams({
//             telegramId: player.telegramId,
//             username: player.username,
//             points: player.points,
//             level: player.level,
//             happinessIndex: player.happinessIndex,
//             maintenanceCost: player.maintenanceCost,
//             pointsPerClick: player.pointsPerClick,
//             clickComboCount: player.clickComboCount,
//             lastClickTimestamp: player.lastClickTimestamp,
//             createdAt: player.createdAt,
//             purchasedUpgrades: player.purchasedUpgrades,
//             activeBoosts: player.activeBoosts,
//             updatedAt: player.updatedAt
//         }).toString();
//         ctx.reply(`Welcome to the Clicker Game! ${web_link}?${userDataParams}`);
//     } else {
//         const userDataParams = new URLSearchParams({
//             telegramId: player.telegramId,
//             username: player.username,
//             points: player.points,
//             level: player.level,
//             happinessIndex: player.happinessIndex,
//             maintenanceCost: player.maintenanceCost,
//             pointsPerClick: player.pointsPerClick,
//             clickComboCount: player.clickComboCount,
//             lastClickTimestamp: player.lastClickTimestamp,
//             createdAt: player.createdAt,
//             purchasedUpgrades: player.purchasedUpgrades,
//             activeBoosts: player.activeBoosts,
//             updatedAt: player.updatedAt
//         }).toString();
//         ctx.reply(`Welcome back! ${web_link}?${userDataParams}`);
//     }
// });

// bot.launch();

// export default bot;
