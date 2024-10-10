import User from '../models/User.js';
import Task from '../models/Task.js';

export const addTaskToUser = async (req, res) => {
  const { telegramId, taskId, is_completed } = req.body;
  console.log("telegramId ----------------->", telegramId);
  try {
    
    const user = await User.findOne({ telegramId });

    // const task = await Task.findById(taskId);
    // if (!task) {
    //     return res.status(404).json({ error: 'Task not found' });
    // }
   
    const existingTaskIndex = user.tasks.findIndex(t => t.task_id.toString() === taskId);
    if (existingTaskIndex !== -1) {
        // Update existing task
        user.tasks[existingTaskIndex].is_completed = is_completed;
        // if (is_completed) {
        //     user.tasks[existingTaskIndex].completion_date = new Date();
        // } else {
        //     user.tasks[existingTaskIndex].completion_date = null;
        // }
    } else {
        // Add new task
        user.tasks.push({
            task_id: taskId,
            is_completed: true
            // completion_date: is_completed ? new Date() : null
        });
    }
    await user.save();
    res.status(200).json({
        message: 'Task added to user successfully',
        user: {
            telegramId: user.telegramId,
            tasks: user.tasks
        }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
