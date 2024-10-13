import { Telegraf } from "telegraf";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import userRoutes from './src/routes/userRoutes.js';

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json()); // for parsing application/json
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// const web_link = "https://b6a4-205-254-167-236.ngrok-free.app/";
const web_link = "https://frontcode.d1wqsm42h1qj4c.amplifyapp.com/";
// const web_link = "http://localhost:5173/";
const port = process.env.PORT || 9000;


// Connect to MongoDB
connectDB();

// Use user routes
app.use('/api/users', userRoutes);



 

// Express route
app.get('/', (req, res) => {
  res.send('This is your telegram bot server!');
});

// Start Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




// Bot command handlers
bot.command('start', async (ctx) => {
  try {
    const user = ctx.from;
    console.log("------>",user);
    // Get user's profile photos
    const photos = await ctx.telegram.getUserProfilePhotos(user.id, 0, 1);
    const photoUrl = photos.photos.length > 0 
      ? await ctx.telegram.getFileLink(photos.photos[0][0].file_id)
      : '';

    // Encode user data as URL parameters
    console.log(photoUrl);
    const userDataParams = new URLSearchParams({
      id: user.id.toString(),
      name: user.first_name + (user.last_name ? ` ${user.last_name}` : ''),
      username: user.username || '',
      photo_url: photoUrl.toString(),
    }).toString();

    const webAppUrlWithParams = `${web_link}?${userDataParams}`;

    await ctx.reply('Welcome to OctaClick! Open the mini app using the button below:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Open OctaClick', web_app: { url: webAppUrlWithParams } }]
        ]
      }
    });
   
  } catch (error) {
    console.error('Error in start command:', error);
    await ctx.reply('Sorry, there was an error. Please try again later.');
  }
}

);


// Launch bot
bot.launch().then(() => {
  console.log('Bot is running!');
}).catch((error) => {
  console.error('Failed to start the bot:', error);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));



