import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { click } from '../service/api';
import { updatePlayerData  } from '../redux/playerSlice';

const Game = () => {
    const dispatch = useDispatch();
    const playerData = useSelector(state => state.player);

    const handleClick = async () => {

        try {
            const response = await click(playerData.telegramId);
            console.log("response----->", response);
            if (response) {
                dispatch(updatePlayerData(response));
            }
        } catch (error) {
            console.error("Error during click:", error);
        }
    };

    // Round points to 2 decimal places
    // const roundedPoints = Number(playerData.points).toFixed(2);

       // Function to format points
       const formatPoints = (points) => {
        const numPoints = Number(points);
        return Number.isInteger(numPoints) ? numPoints.toString() : numPoints.toFixed(2);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="w-full p-4 bg-blue-50 min-h-screen flex flex-col items-center justify-center">
                <p className="text-2xl mb-4">Points: {formatPoints(playerData.points)}</p>
                <button 
                onClick={handleClick}
                className="px-6 py-2 bg-blue-500 text-white rounded-md"
                >
                   Click
                </button>
            </div>
            
        </div>
    );
};

export default Game;
