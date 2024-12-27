import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import playerRoutes from './routes/playerRoutes.js';
import connectDB_upgrades from './data/datascript.js';
import bot from './bot.js';

const app = express();
app.use(express.json());
// CORS configuration - updated with more comprehensive settings
app.use(cors({
    origin: ['https://11octfrontend.d2tn8votwbjk0l.amplifyapp.com', 'http://51.20.124.35', 'https://51.20.124.35'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Additional security headers
app.use((req, res, next) => {
    // Allow both your frontend domain and IP
    const allowedOrigins = ['https://11octfrontend.d2tn8votwbjk0l.amplifyapp.com', 'http://51.20.124.35', 'https://51.20.124.35'];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    next();
});

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
