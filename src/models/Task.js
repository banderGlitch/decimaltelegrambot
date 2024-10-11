import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  pointsReward: { type: Number, required: true },
  verificationURL: { type: String, required: true },
  taskCode: { type: String, unique: true, required: true } // Unique code to identify the task
});

export default mongoose.model('Task', taskSchema);

// import mongoose from 'mongoose';

// const taskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   type: { type: String, required: true },
//   reward: { type: Number, required: true },
//   action: { type: String, required: true },
//   callbackUrl: { type: String, required: true },
//   status: { type: Boolean, required: true, default: false },
// });

// const Task = mongoose.model('Task', taskSchema);

// export default Task;


