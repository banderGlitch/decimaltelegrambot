// import React, { useState, useRef, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { click } from '../service/api';
// import { updatePlayerData } from '../redux/playerSlice';

// const Game = () => {
//     const dispatch = useDispatch();
//     const playerData = useSelector(state => state.player);
//     const [clickComboCount, setClickComboCount] = useState(1);
//     const lastClickTime = useRef(null);
//     const [isClicking, setIsClicking] = useState(false);
//     const sessionStartTime = useRef(null);

//     // Add interval to check for combo expiration
//     useEffect(() => {
//         const checkComboInterval = setInterval(() => {
//             const currentTime = Date.now();
//             if (lastClickTime.current && (currentTime - lastClickTime.current) > 2000) {
//                 setClickComboCount(1);
//                 sessionStartTime.current = null;
//             }
//         }, 100); // Check every 100ms

//         return () => clearInterval(checkComboInterval);
//     }, []);

//     const getComboBasedOnTime = (elapsedTime) => {
//         const seconds = elapsedTime / 1000;  // Convert milliseconds to seconds
//         if (seconds <= 10) return 1;         // 0-10 seconds: 1x
//         if (seconds <= 20) return 2;         // 10-20 seconds: 2x
//         if (seconds <= 30) return 3;         // 20-30 seconds: 3x
//         if (seconds <= 40) return 4;         // 30-40 seconds: 4x
//         return 5;                            // 40+ seconds: stays at 4x
//     };


//     // const getComboBasedOnTime = (elapsedTime) => {
//     //     const minutes = elapsedTime / (1000 * 60);
//     //     if (minutes <= 1) return 1;
//     //     if (minutes <= 2) return 2;
//     //     if (minutes <= 3) return 3;
//     //     if (minutes <= 4) return 4;
//     //     return 4; // Max combo for 5+ minutes
//     // };


//     const handleClick = async () => {

//         setIsClicking(true);
//         setTimeout(() => setIsClicking(false), 300); // Reset clicking state after animation

//         const currentTime = Date.now();

//         // Start session if this is the first click
//         if (!sessionStartTime.current) {
//             sessionStartTime.current = currentTime;
//         }

//         // Calculate combo based on session duration
//         const elapsedTime = currentTime - sessionStartTime.current;
//         const newComboCount = getComboBasedOnTime(elapsedTime);
//         setClickComboCount(newComboCount);

//         // Update last click time
//         lastClickTime.current = currentTime;

//         try {
//             const response = await click(playerData.telegramId, clickComboCount);
//             console.log("clickComboCount----->", clickComboCount);
//             if (response) {
//                 dispatch(updatePlayerData(response));
//             }
//         } catch (error) {
//             console.error("Error during click:", error);
//         }
//     };

//     const formatPoints = (points) => {
//         const numPoints = Number(points);
//         return Number.isInteger(numPoints) ? numPoints.toString() : numPoints.toFixed(2);
//     };

//     return (
//         <div className="flex flex-col items-center">
//             <div className="w-full p-4 bg-blue-50 min-h-screen flex flex-col items-center justify-center">
//             <div className="flex items-center mb-4">
//                     <div className="flex flex-col">
//                         <p className="text-2xl mb-4">Points: {formatPoints(playerData.points)}</p>
//                         <p className="text-xl mb-4">Combo: {clickComboCount}x</p>
//                     </div>
//                 </div>
//                 <button 
//                     onClick={handleClick}
//                     className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                 >
//                     Click ({clickComboCount}x)
//                 </button>
//                    <ComboBar 
//                         clickComboCount={clickComboCount} 
//                         isClicking={isClicking}
//                     />
//             </div>
//         </div>
//     );
// };

// export default Game;

import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { click } from '../service/api';
import { updatePlayerData } from '../redux/playerSlice';

const Game = () => {
    const dispatch = useDispatch();
    const playerData = useSelector(state => state.player);
    const [clickComboCount, setClickComboCount] = useState(1);
    const [isClicking, setIsClicking] = useState(false);
    const lastClickTime = useRef(null);
    const sessionStartTime = useRef(null);
    const currentComboRef = useRef(1);  // Track the actual combo level

    const getComboBasedOnTime = (elapsedTime) => {
        const seconds = elapsedTime / 1000;  
        if (seconds <= 10) return 1;         
        if (seconds <= 20) return 2;         
        if (seconds <= 30) return 3;         
        if (seconds <= 40) return 4;         
        return 5;                            
    };

    useEffect(() => {
        const checkInactivity = () => {
            const currentTime = Date.now();
            
            if (lastClickTime.current && (currentTime - lastClickTime.current) > 2000) {
                setClickComboCount(prevCount => {
                    const newCount = Math.max(1, prevCount - 1);
                    currentComboRef.current = newCount; // Update the ref
                    return newCount;
                });
            }
        };

        const decrementInterval = setInterval(checkInactivity, 2000);
        return () => clearInterval(decrementInterval);
    }, []);

    const handleClick = async () => {
        const currentTime = Date.now();
        setIsClicking(true);
        setTimeout(() => setIsClicking(false), 300);

        // Reset session if there's been a long break
        if (lastClickTime.current && (currentTime - lastClickTime.current) > 2000) {
            sessionStartTime.current = currentTime; // Reset session time
            currentComboRef.current = 1;  // Reset to 1x
            setClickComboCount(1);
        } 
        // Start new session if first click
        else if (!sessionStartTime.current) {
            sessionStartTime.current = currentTime;
        }

        lastClickTime.current = currentTime;

        // Only calculate new combo if we're not in a reset state
        if (sessionStartTime.current) {
            const elapsedTime = currentTime - sessionStartTime.current;
            const newComboCount = getComboBasedOnTime(elapsedTime);
            currentComboRef.current = newComboCount;
            setClickComboCount(newComboCount);
        }

        try {
            const response = await click(
                playerData.telegramId, 
                currentComboRef.current // Use current combo value
            );
            if (response) {
                dispatch(updatePlayerData(response));
            }
        } catch (error) {
            console.error("Error during click:", error);
        }
    };

    const formatPoints = (points) => {
        return Number.isInteger(points) ? points.toString() : points.toFixed(2);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="w-full p-4 bg-blue-50 min-h-screen flex flex-col items-center justify-center">
                <div className="flex items-center mb-4">
                    {/* <ComboBar 
                        clickComboCount={clickComboCount} 
                        isClicking={isClicking}
                    /> */}
                    <div className="flex flex-col">
                        <p className="text-2xl mb-4">Points: {formatPoints(playerData.points)}</p>
                        <p className="text-xl mb-4">Combo: {clickComboCount}x</p>
                    </div>
                </div>
                <button 
                    onClick={handleClick}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Click ({clickComboCount}x)
                </button>

                <ComboBar 
                        clickComboCount={clickComboCount} 
                        isClicking={isClicking}
                    />
            </div>
        </div>
    );
};

export default Game;


const ComboBar = ({ clickComboCount, isClicking }) => {
    const comboColors = {
        1: ['bg-green-500', 'bg-green-300'],
        2: ['bg-blue-500', 'bg-blue-300'],
        3: ['bg-purple-500', 'bg-purple-300'],
        4: ['bg-red-500', 'bg-red-300'],
        5: ['bg-yellow-500', 'bg-yellow-300']
    };

    const comboLevels = [5, 4, 3, 2, 1];
    const adjustedCombo = Math.max(0, clickComboCount - 1);

    const getBarStyle = (level) => {
        // For the next level to be achieved
        if (level === adjustedCombo + 1) {
            const pulseHeight = level === 5 ? 'h-full' : 'h-1/4';
            return `${comboColors[level][1]} ${
                isClicking ? 'animate-tap-pulse' : 'animate-pulse-next'
            } ${pulseHeight} opacity-90`;
        }
        // For already achieved levels
        else if (level <= adjustedCombo) {
            return `${comboColors[level][0]} h-full animate-maintain`;
        }
        // For future levels
        return 'h-0';
    };

    return (
        <div className="flex flex-col items-center w-8 h-80 bg-gray-200 rounded-t-lg mr-4">
            {comboLevels.map((level) => (
                <div 
                    key={level} 
                    className="w-full h-1/5 border-b border-gray-300 relative overflow-hidden"
                >
                    <div 
                        className={`
                            absolute bottom-0 left-0 w-full
                            transition-all duration-300 ease-out
                            ${getBarStyle(level)}
                        `}
                        style={{ transformOrigin: 'bottom' }}
                    />
                    <span className={`
                        absolute -right-6 top-1/2 transform -translate-y-1/2 text-sm
                        ${level === adjustedCombo + 1 ? 'text-blue-600 font-bold animate-pulse-text' : ''}
                    `}>
                        {level}x
                    </span>
                </div>
            ))}
        </div>
    );
};


// const ComboBar = ({ clickComboCount, isClicking }) => {
//     const comboColors = {
//         1: ['bg-green-400', 'bg-green-200'],
//         2: ['bg-blue-400', 'bg-blue-200'],
//         3: ['bg-purple-400', 'bg-purple-200'],
//         4: ['bg-red-400', 'bg-red-200'],
//         5: ['bg-yellow-400', 'bg-yellow-200']
//     };

//     const comboLevels = [5, 4, 3, 2, 1];
//     const adjustedCombo = Math.max(0, clickComboCount - 1); // Adjust combo count

//     const getBarStyle = (level) => {
//         // For the next level to be achieved
//         if (level === adjustedCombo + 1) {
//               // Special height for 5x level pulse
//             const pulseHeight = level === 5 ? 'h-full' : 'h-1/4';
//             return `${comboColors[level][1]} ${isClicking ? 'animate-tap-pulse' : 'animate-pulse-next'} ${pulseHeight}`;
//         }
//         // For already achieved levels
//         else if (level <= adjustedCombo) {
//             return `${comboColors[level][0]} h-full`;
//         }
//         // For future levels
//         return 'h-0';
//     };

//     return (
//         <div className="flex flex-col items-center w-8 h-80 bg-gray-200 rounded-t-lg mr-4">
//             {comboLevels.map((level) => (
//                 <div 
//                     key={level} 
//                     className="w-full h-1/5 border-b border-gray-300 relative overflow-hidden"
//                 >
//                     <div 
//                         className={`
//                             absolute bottom-0 left-0 w-full
//                             transition-all duration-300 ease-out
//                             ${getBarStyle(level)}
//                         `}
//                         style={{ transformOrigin: 'bottom' }}
//                     />
//                     <span className={`
//                         absolute -right-6 top-1/2 transform -translate-y-1/2 text-sm
//                         ${level === adjustedCombo + 1 ? 'text-blue-600 font-bold animate-pulse-text' : ''}
//                     `}>
//                         {level}x
//                     </span>
//                 </div>
//             ))}
//         </div>
//     );
// };




// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { click } from '../service/api';
// import { updatePlayerData  } from '../redux/playerSlice';

// const Game = () => {
//     const dispatch = useDispatch();
//     const playerData = useSelector(state => state.player);

//     const handleClick = async () => {

//         try {
//             const response = await click(playerData.telegramId);
//             console.log("response----->", response);
//             if (response) {
//                 dispatch(updatePlayerData(response));
//             }
//         } catch (error) {
//             console.error("Error during click:", error);
//         }
//     };

//     // Round points to 2 decimal places
//     // const roundedPoints = Number(playerData.points).toFixed(2);

//        // Function to format points
//        const formatPoints = (points) => {
//         const numPoints = Number(points);
//         return Number.isInteger(numPoints) ? numPoints.toString() : numPoints.toFixed(2);
//     };

//     return (
//         <div className="flex flex-col items-center">
//             <div className="w-full p-4 bg-blue-50 min-h-screen flex flex-col items-center justify-center">
//                 <p className="text-2xl mb-4">Points: {formatPoints(playerData.points)}</p>
//                 <button 
//                 onClick={handleClick}
//                 className="px-6 py-2 bg-blue-500 text-white rounded-md"
//                 >
//                    Click
//                 </button>
//             </div>
            
//         </div>
//     );
// };

// export default Game;
