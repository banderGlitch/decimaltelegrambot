import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  name: String,
  username: String,
  photoUrl: String,
  coins: { type: Number, default: 0 },
  tasks: [{
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task'  },
    is_completed: { type: Boolean, default: false },
  }],
});

const User = mongoose.model('User', userSchema);

export default User;