import mongoose from 'mongoose';
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },  // Name of the task (e.g., "Follow on Twitter")
    reward: { type: String, required: true },  // Description of the task (e.g., "Follow @MyGame on Twitter to earn points.")
    action: { type: String, required: true },  // Points the player will earn upon completing the task
    callbackUrl: { type: String, required: true },  // Whether the task can be completed multiple times
    ondisplay: { type: Boolean, default: true }  // Whether the task is currently displayed to the player
  });
  
  const Task = mongoose.model('Task', taskSchema);
  
  export default Task;
  