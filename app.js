import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import playerRoutes from './routes/playerRoutes.js';
import connectDB_upgrades from './data/datascript.js';
import bot from './bot.js';

const app = express();
app.use(express.json());

// CORS configuration - updated with more comprehensive settings

if (process.env.NODE_ENV !== 'production') {
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));
    console.log('CORS enabled for development');
} else {
    // In production, CORS is handled by Nginx
    console.log('Running in production - CORS handled by Nginx');
}
// Additional security headers

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
