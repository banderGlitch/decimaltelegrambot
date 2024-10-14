import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyTask } from '../redux/playerSlice';
import { updatePlayerDataApi } from '../service/api';

const Tasks = () => {
    const playerData = useSelector(state => state.player);
    const tasks = useSelector(state => state.tasks);
    const dispatch = useDispatch();


    console.log("tasks----->", tasks);
    console.log("playerData----->", playerData);

       // Function to format points
       const formatPoints = (points) => {
        const numPoints = Number(points);
        return Number.isInteger(numPoints) ? numPoints.toString() : numPoints.toFixed(2);
    };

    const isTaskEnabled = (taskId) => {
        const playerTask = playerData.tasks?.find(task => task.taskId === taskId);
        console.log("playerTask----->", playerTask);
        return !playerTask || !playerTask.completed;
    };

    const handleLetsGoClick = (callbackUrl) => {
        window.open(callbackUrl, '_blank', 'noopener,noreferrer');
    };

    const handleVerify = async (taskId, reward) => {
        dispatch(verifyTask({ taskId, reward }));
            // Get the updated state after the dispatch
            const updatedPlayerData = {
                ...playerData,
                points: playerData.points + reward,
                tasks: playerData.tasks.map(task => 
                    task.taskId === taskId 
                        ? { ...task, completed: true }
                        : task
                )
            };
            console.log("updatedPlayerDaasdadasdta----->", updatedPlayerData);
        // await updatePlayerDataApi(playerData);
        // You might want to add an API call here to update the server
        // For example: updateTaskOnServer(taskId, playerData.telegramId);
    };



    
    return (
        <div className="p-4 bg-green-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Tasks</h1>
            <p className="mb-4">Points: {formatPoints(playerData.points)}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks && tasks.map((task) => (
                    <div key={task.id} className="bg-white shadow-md rounded-lg p-4">
                        <h2 className="text-lg font-semibold mb-2">{task.title}</h2>
                        <p className="mb-2">Reward: {task.reward} points</p>
                        <div className="flex justify-between items-center mt-4">
                        <button
                                onClick={() => handleLetsGoClick(task.callbackUrl)}
                                disabled={!isTaskEnabled(task.id)}
                                className={`bg-blue-500 text-white py-2 px-4 rounded ${!isTaskEnabled(task.id) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                            >
                                Let's Go
                            </button>
                            <button
                                onClick={() => handleVerify(task.taskId, task.reward)}
                                disabled={!isTaskEnabled(task.taskId)}
                                className={`bg-green-500 text-white py-2 px-4 rounded ${!isTaskEnabled(task.taskId) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
                            >
                                Verify
                            </button>
                            {/* <Link
                                to={`/verify-task/${task.id}`}
                                className={`bg-green-500 text-white py-2 px-4 rounded ${!isTaskEnabled(task.id) && 'opacity-50 cursor-not-allowed'}`}
                                onClick={(e) => !isTaskEnabled(task.id) && e.preventDefault()}
                            >
                                Verify
                            </Link> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tasks;