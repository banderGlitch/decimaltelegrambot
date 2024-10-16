import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { verifyTask } from '../redux/playerSlice';
import { updatePlayerDataApi } from '../service/api';

const Tasks = () => {
    const playerData = useSelector(state => state.player);
    const tasks = useSelector(state => state.tasks);
    const dispatch = useDispatch();


    console.log("tasks---infront-->", tasks);
    console.log("playerData----intask---------->", playerData);

    useEffect(() => {
        console.log("playerData----->", playerData);
    }, [playerData]);

    // Function to format points
    const formatPoints = (points) => {
        const numPoints = Number(points);
        return Number.isInteger(numPoints) ? numPoints.toString() : numPoints.toFixed(2);
    };

    const isTaskEnabled = (taskId) => {
        const playerTask = playerData.tasks?.find(task => task.taskId === taskId);
        console.log("playerTask----->", playerTask);
        // console.log("playerTask.completed----->", playerTask.completed);
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
        console.log("updatedPlayerDaasdadasdta----->", updatedPlayerData);
        console.log("playerData----inhandleVerify->", playerData);
        await updatePlayerDataApi(updatedPlayerData);
    }




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
                                // disabled={!isTaskEnabled(task._id)}
                                className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'}`}
                            >
                                Let's Go
                            </button>
                            <button
                                onClick={() => handleVerify(task._id, task.reward)}
                                disabled={!isTaskEnabled(task._id)}
                                className={`bg-green-500 text-white py-2 px-4 rounded ${!isTaskEnabled(task._id) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
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