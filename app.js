import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import playerRoutes from './routes/playerRoutes.js';
import connectDB_upgrades from './data/datascript.js';
import bot from './bot.js';

const app = express();
app.use(express.json());
app.use(cors({
    origin: [
        'https://11octfrontend.d2tn8votwbjk0l.amplifyapp.com',
        'http://localhost:9000'  // for local development
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

connectDB();
// connectDB_upgrades();

// Connect to the bot
bot.launch();
app.use('/api', playerRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));

app.get('/', (req, res) => {
    res.send('Telegram Bot is running');
});

app.get('/health', (req, res) => {
    res.send('OK Telegram server is running');
});
