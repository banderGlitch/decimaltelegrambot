import { Telegraf } from 'telegraf';
import Player from './src/models/Player.js';
import Task from './src/models/Task.js';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes.js';
import connectDB from './src/config/database.js';
import connectDB_upgrades from './data/datascript.js';
dotenv.config();

connectDB();
// testing the upgrades data
// connectDB_upgrades();

const app = express();

app.use(cors());

app.use(express.json()); 


app.use('/api/users', userRoutes);



const bot = new Telegraf(process.env.BOT_TOKEN);

const web_link = "https://hippofrontend.d46o2iybsl4di.amplifyapp.com/";

bot.start(async (ctx) => {
    const telegramId = ctx.from.id;
    console.log("telegramId----->",telegramId);
    let player = await Player.findOne({ telegramId });

    console.log("player----->",player);

    if (!player) {
        console.log("player not found");
        player = new Player({ telegramId, name: ctx.from.first_name });
        console.log("player----->1st",player);
        await player.save();
        console.log("player----->2nd",player);
        const userDataParams = new URLSearchParams({
            id: player.telegramId,
            name: player.name,
            points: player.points,
            level: player.level,
            clickCount: player.clickCount,
            streakCount: player.streakCount,
            happinessIndex: player.happinessIndex,
            comboBonus: player.comboBonus,
            lastClickTime: player.lastClickTime,
            createdAt: player.createdAt,
            purchasedUpgrades: player.purchasedUpgrades
          }).toString();
      
          const webAppUrlWithParams = `${web_link}?${userDataParams}`;
          console.log("webAppUrlWithParams----->",webAppUrlWithParams);
      
          await ctx.reply(`Welcome, ${ctx.from.first_name}! Let's start the game.`, {
            reply_markup: {
              inline_keyboard: [
                [{ text: 'Open hippo', web_app: { url: webAppUrlWithParams } }]
              ]
            }
          });
        
    } else {
        const userDataParams = new URLSearchParams({
            id: player.telegramId,
            name: player.name,
            points: player.points,
            level: player.level,
            clickCount: player.clickCount,
            streakCount: player.streakCount,
            happinessIndex: player.happinessIndex,
            comboBonus: player.comboBonus,
            lastClickTime: player.lastClickTime,
            createdAt: player.createdAt,
            purchasedUpgrades: player.purchasedUpgrades
          }).toString();
      
          const webAppUrlWithParams = `${web_link}?${userDataParams}`;
          console.log("webAppUrlWithParams----->",webAppUrlWithParams);
      
          await ctx.reply(`Welcome, ${ctx.from.first_name}!. welcome back`, {
            reply_markup: {
              inline_keyboard: [
                [{ text: 'Open hippo', web_app: { url: webAppUrlWithParams } }]
              ]
            }
          });
    }
});

bot.command('click', async (ctx) => {
    try {
        const telegramId = ctx.from.id;
        let player = await Player.findOne({ telegramId });
        console.log("---------------",player);

    if (!player) {
        ctx.reply('Please start the game with /start');
        return;
    }

    player.points += player.level;
    player.clickCount += 1;
    await player.save();

        ctx.reply(`You clicked! Your points are now ${player.points}.`);
    } catch (error) {
        console.error(error);
        ctx.reply('An error occurred while processing your click. Please try again later.');
    }
});

bot.launch();

app.listen(9000, () => {
    console.log('Server is running on port 9000');
});
app.get('/', (req, res) => {
    res.send('Hello World');
});

