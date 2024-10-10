import Task from '../models/Task.js';

export const GetTasks = async (req, res) => {
    try {
        // Fetch tasks from the database where status is true
        const tasks = await Task.find({ status: true });
        ;
        if (tasks.length === 0) {
            return res.status(404).json({ message: "No active tasks found" });
        }
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



export const CreateTask = async (req, res) => {
    try {
        const { title, type, reward, action, callbackUrl } = req.body;

        // Validate required fields
        // if (!title || !type || !description || !action || !callbackUrl) {
        //     return res.status(400).json({ error: 'Missing required fields' });
        // }

        // Create a new task
        const newTask = new Task({
            title,
            type,
            reward,
            action,
            callbackUrl,
            status: false // Setting status to false by default as per the schema
        });

        // Save the task to the database
        const savedTask = await newTask.save();

        res.status(201).json(savedTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const updateTaskStatus = async (req, res) => {
    try {
        const { taskId, status } = req.body;

        // Validate input
        if (status === undefined) {
            return res.status(400).json({ error: 'Status is required' });
        }

        // Find the task and update its status
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { status: status },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




