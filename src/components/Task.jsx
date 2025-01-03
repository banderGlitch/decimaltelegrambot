import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { verifyTask } from '../redux/playerSlice';
import { updatePlayerDataApi } from '../service/api';

const Tasks = () => {
    const playerData = useSelector(state => state.player);
    const tasks = useSelector(state => state.tasks);
    const dispatch = useDispatch();

    // Log player data
    useEffect(() => {
        console.log("playerData----->", playerData);
    }, [playerData]);

    // Format points to integers
    const formatPoints = (points) => {
        return Math.round(points); // Round to nearest integer
    };

    const isTaskEnabled = (taskId) => {
        const playerTask = playerData.tasks?.find(task => task.taskId === taskId);
        return !playerTask || !playerTask.completed;
    };

    const handleLetsGoClick = (callbackUrl) => {
        window.open(callbackUrl, '_blank', 'noopener,noreferrer');
    };

    const handleVerify = async (taskId, reward) => {
        dispatch(verifyTask({ taskId, reward }));
        const updatedPlayerData = {
            ...playerData,
            points: playerData.points + reward,
            tasks: playerData.tasks.map(task =>
                task.taskId === taskId
                    ? { ...task, completed: true }
                    : task
            )
        };
        await updatePlayerDataApi(updatedPlayerData);
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-b from-green-100 to-green-50">
            {/* Header */}
            <div className="p-6 bg-white shadow-md flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-3xl font-bold text-green-700">Tasks</h1>
                <p className="text-lg font-semibold text-gray-700">
                    Points: <span className="text-green-700">{formatPoints(playerData.points)}</span>
                </p>
            </div>

            {/* Tasks Grid */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks && tasks.map((task) => (
                        <div
                            key={task.id}
                            className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105"
                        >
                            {/* Task Title */}
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{task.title}</h2>
                            <p className="text-gray-600">Reward: <span className="font-semibold">{task.reward} points</span></p>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center mt-6">
                                <button
                                    onClick={() => handleLetsGoClick(task.callbackUrl)}
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                >
                                    Let's Go
                                </button>
                                <button
                                    onClick={() => handleVerify(task._id, task.reward)}
                                    disabled={!isTaskEnabled(task._id)}
                                    className={`py-2 px-4 rounded text-white font-bold ${
                                        isTaskEnabled(task._id)
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {isTaskEnabled(task._id) ? 'Verify' : 'Completed'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tasks;
