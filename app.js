import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import playerRoutes from './routes/playerRoutes.js';
import connectDB_upgrades from './data/datascript.js';
import bot from './bot.js';

const app = express();
app.use(express.json());
app.use(cors());

connectDB();
// connectDB_upgrades();

// Connect to the bot
bot.launch();
app.use('/api', playerRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/', (req, res) => {
    res.send('Telegram Bot is running');
});
