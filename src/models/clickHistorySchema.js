import mongoose from 'mongoose';

const clickHistorySchema = new mongoose.Schema({
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    timestamp: { type: Date, default: Date.now },
    pointsEarned: { type: Number, required: true }
});

export default mongoose.model('ClickHistory', clickHistorySchema);


