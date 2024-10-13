const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Name of the task (e.g., "Follow on Twitter")
    description: { type: String, required: true },  // Description of the task (e.g., "Follow @MyGame on Twitter to earn points.")
    pointsReward: { type: Number, required: true },  // Points the player will earn upon completing the task
    isRepeatable: { type: Boolean, default: false },  // Whether the task can be completed multiple times
  });
  
  const Task = mongoose.model('Task', taskSchema);
  
  export default Task;
  