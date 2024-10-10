import express from 'express';
import { getUser, updateCoins, getUserSpecific } from '../controllers/userController.js';
import { GetTasks, CreateTask, updateTaskStatus } from '../controllers/taskController.js';
import { addTaskToUser } from '../controllers/userTaskController.js';

const router = express.Router();

// post or check user when  apps is opened
router.post('/getUser', getUser);
// post user's coins 
router.post('/updateCoins', updateCoins);
// get  when user specific data is needed
router.get('/getUserSpecific/:telegramId', getUserSpecific);

// get tasks
router.get('/getTasks', GetTasks);
// create task
router.post('/createTask', CreateTask);
// update task status
router.post('/updateTaskStatus', updateTaskStatus);
// add task to user
router.post('/addTaskToUser', addTaskToUser);


export default router;

