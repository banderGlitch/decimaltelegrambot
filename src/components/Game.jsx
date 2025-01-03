import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { click } from "../service/api";
import { updatePlayerData } from "../redux/playerSlice";
import { gsap } from "gsap";
import bitcoinCoin from "../assets/pngegg.png";
import backgroundImage from "../assets/Designer.jpeg";

const Game = () => {
  const dispatch = useDispatch();
  const playerData = useSelector((state) => state.player);

  // Local state
  const [combo, setCombo] = useState(1); // Combo multiplier
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false); // Prevent simultaneous API calls
  const bitcoinRef = useRef(null); // Bitcoin reference
  const scoreContainerRef = useRef(null); // Floating score container reference

  // Handle the tap event
  const handleTap = async () => {
    // Prevent overlapping API calls

    triggerHapticFeedback();
    
    if (isApiCallInProgress) return;

    setCombo((prevCombo) => Math.min(5, prevCombo + 1)); // Increment combo

    // Add visual effects
    animateBitcoin();
    showFloatingScore(Math.round(combo)); // Round off the combo value before displaying

    // Call the API
    setIsApiCallInProgress(true);
    try {
      const response = await click(playerData.telegramId, Math.round(combo)); // Round off combo value for API
      if (response) {
        dispatch(updatePlayerData(response)); // Update Redux with latest data
      }
    } catch (error) {
      console.error("Error syncing points:", error);
    } finally {
      setIsApiCallInProgress(false); // Allow further API calls
    }
  };

    // Haptic feedback function
    const triggerHapticFeedback = () => {
      if (navigator.vibrate) {
        navigator.vibrate(50); // Vibrate for 50 milliseconds
      }
    };
  

  // Animate Bitcoin (rotate and scale)
  const animateBitcoin = () => {
    gsap.to(bitcoinRef.current, {
      scale: 1.3,
      rotation: 360,
      duration: 0.5,
      ease: "power3.out",
      onComplete: () => gsap.to(bitcoinRef.current, { scale: 1, rotation: 0, duration: 0.2 }),
    });
  };

  // Show floating score effect
  const showFloatingScore = (points) => {
    const floatingScore = document.createElement("div");
    floatingScore.className = "floating-score";
    floatingScore.innerText = `+${points}`;
    floatingScore.style.left = "50%";
    floatingScore.style.top = "50%";
    scoreContainerRef.current.appendChild(floatingScore);

    const randomX = Math.random() * 100 - 50;
    const randomY = -Math.random() * 100 - 50;

    gsap.to(floatingScore, {
      x: randomX,
      y: randomY,
      opacity: 0,
      duration: 1.5,
      ease: "power2.out",
      onComplete: () => floatingScore.remove(),
    });
  };

  // Gradually decrease combo
  useEffect(() => {
    const comboInterval = setInterval(() => {
      setCombo((prevCombo) => Math.max(1, prevCombo - 0.1));
    }, 200);

    return () => clearInterval(comboInterval); // Cleanup on unmount
  }, []);

  return (
    <div className="game-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Total points */}
      <div className="points-display">
        <span className="points-label">Points:</span>
        <span className="points-value">{Math.floor(playerData.points)}</span>
      </div>

      {/* Bitcoin image */}
      <div className="bitcoin-container">
        <img
          src={bitcoinCoin}
          alt="Bitcoin"
          className="bitcoin"
          ref={bitcoinRef}
          onClick={handleTap}
          style={{ width: "200px", height: "200px" }}
        />
      </div>

      {/* Floating scores */}
      <div ref={scoreContainerRef} className="floating-scores-container"></div>

      {/* Combo bar */}
      <div className="combo-bar-container">
        <div
          className="combo-bar"
          style={{
            height: `${(combo / 5) * 100}%`,
            background: "linear-gradient(to top, green, yellow, red)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Game;






// import React, { useState, useEffect, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { click } from "../service/api";
// import { updatePlayerData } from "../redux/playerSlice";
// import { gsap } from "gsap";
// import bitcoinCoin from "../assets/pngegg.png"; // Bitcoin image
// import backgroundImage from "../assets/Designer.jpeg"; // Background image

// const Game = () => {
//   const dispatch = useDispatch();
//   const playerData = useSelector((state) => state.player);


//   useEffect(() => {
//     setTotalPoints(playerData.points || 0);
//   }, [playerData.points]);

//   // Local game state
//   const [combo, setCombo] = useState(1);
//   const [localPoints, setLocalPoints] = useState(0); // Points gained locally (not yet synced)
//   const [totalPoints, setTotalPoints] = useState(playerData.points || 0); // Total points from Redux

//   // Refs for animations and batching
//   const bitcoinRef = useRef(null);
//   const scoreContainerRef = useRef(null);
//   const syncIntervalRef = useRef(null);

//   // Handle tap event
//   const handleTap = (e) => {
//     // Update combo
//     setCombo((prevCombo) => Math.min(5, prevCombo + 1));

//     // Add points locally
//     setLocalPoints((prevPoints) => prevPoints + combo);

//     // Animate Bitcoin (rotate and scale)
//     gsap.to(bitcoinRef.current, {
//       scale: 1.3,
//       rotation: 360,
//       duration: 0.5,
//       ease: "power3.out",
//       onComplete: () => gsap.to(bitcoinRef.current, { scale: 1, rotation: 0, duration: 0.2 }),
//     });

//     // Add floating score effect
//     const floatingScore = document.createElement("div");
//     floatingScore.className = "floating-score";
//     floatingScore.innerText = `+${combo}`;
//     floatingScore.style.left = "50%";
//     floatingScore.style.top = "50%";
//     scoreContainerRef.current.appendChild(floatingScore);

//     const randomX = Math.random() * 100 - 50; // Random X position
//     const randomY = -Math.random() * 100 - 50; // Random Y position

//     gsap.to(floatingScore, {
//       x: randomX,
//       y: randomY,
//       opacity: 0,
//       duration: 1.5,
//       ease: "power2.out",
//       onComplete: () => floatingScore.remove(),
//     });
//   };

//   // Sync points with the server every 1 second
//   useEffect(() => {
//     syncIntervalRef.current = setInterval(async () => {
//       if (localPoints > 0) {
//         try {
//           const response = await click(playerData.telegramId, localPoints);
//           if (response) {
//             // Update Redux and total points
//             dispatch(updatePlayerData(response));
//             setTotalPoints(response.points); // Update total points from server
//             setLocalPoints(0); // Reset local points after sync
//           }
//         } catch (error) {
//           console.error("Error syncing points:", error);
//         }
//       }
//     }, 1000);

//     return () => clearInterval(syncIntervalRef.current);
//   }, [localPoints, playerData.telegramId, dispatch]);

//   // Gradually decrease combo
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCombo((prevCombo) => Math.max(1, prevCombo - 0.1));
//     }, 200);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="game-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
//       {/* Total points */}
//       <div className="points-display">
//         <span className="points-label">Points:</span>
//         <span className="points-value">{totalPoints.toFixed(2)}</span>
//       </div>

//       {/* Bitcoin image */}
//       <div className="bitcoin-container">
//         <img
//           src={bitcoinCoin}
//           alt="Bitcoin"
//           className="bitcoin"
//           ref={bitcoinRef}
//           onClick={handleTap}
//           style={{ width: "200px", height: "200px" }} // Larger coin size
//         />
//       </div>

//       {/* Floating scores */}
//       <div ref={scoreContainerRef} className="floating-scores-container"></div>

//       {/* Combo bar */}
//       <div className="combo-bar-container">
//         <div
//           className="combo-bar"
//           style={{
//             height: `${(combo / 5) * 100}%`,
//             background: "linear-gradient(to top, green, yellow, red)",
//           }}
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default Game;





// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import Phaser from 'phaser';
// import { click } from '../service/api';
// import { updatePlayerData } from '../redux/playerSlice';
// import bitcoinBackground from '../assets/Designer.jpeg';
// import bitcoinCoin from '../assets/pngegg.png';

// class BitcoinScene extends Phaser.Scene {
//     constructor() {
//         super('BitcoinScene');
//     }

//     init(data) {
//         this.combo = 1;
//         this.lastClickTime = Date.now();
//         this.sessionStartTime = Date.now();
//         this.points = 0;
//         this.clickCallback = data.clickCallback;
//     }

//     preload() {
//         // Create loading bar
//         const width = this.cameras.main.width;
//         const height = this.cameras.main.height;
//         const progressBar = this.add.graphics();
//         const progressBox = this.add.graphics();
//         progressBox.fillStyle(0x222222, 0.8);
//         progressBox.fillRect(width/2 - 160, height/2 - 25, 320, 50);
        
//         // Loading text
//         const loadingText = this.add.text(width/2, height/2 - 50, 'Loading...', {
//             font: '20px monospace',
//             fill: '#ffffff'
//         });
//         loadingText.setOrigin(0.5, 0.5);
        
//         // Percentage text
//         const percentText = this.add.text(width/2, height/2, '0%', {
//             font: '18px monospace',
//             fill: '#ffffff'
//         });
//         percentText.setOrigin(0.5, 0.5);

//         // Loading event handlers
//         this.load.on('progress', (value) => {
//             progressBar.clear();
//             progressBar.fillStyle(0xffffff, 1);
//             progressBar.fillRect(width/2 - 150, height/2 - 15, 300 * value, 30);
//             percentText.setText(parseInt(value * 100) + '%');
//         });

//         this.load.on('complete', () => {
//             progressBar.destroy();
//             progressBox.destroy();
//             loadingText.destroy();
//             percentText.destroy();
//         });

//         // Load game assets
//         try {
//             this.load.image('background', bitcoinBackground);
//             this.load.image('bitcoin', bitcoinCoin);
//         } catch (error) {
//             console.error('Asset loading error:', error);
//         }
//     }

//     create() {
//         console.log('Scene created'); // Debug log

//         // Set up background
//         this.background = this.add.image(
//             this.cameras.main.centerX,
//             this.cameras.main.centerY,
//             'background'
//         )
//         .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

//         // Create Bitcoin sprite
//         this.bitcoin = this.add.sprite(
//             this.cameras.main.centerX,
//             this.cameras.main.centerY,
//             'bitcoin'
//         )
//         .setInteractive()
//         .setScale(0.5);

//         // Setup combo text
//         this.comboText = this.add.text(16, 16, 'Combo: 1x', {
//             fontSize: '32px',
//             fill: '#fff',
//             stroke: '#000',
//             strokeThickness: 4
//         });

//         // Handle clicks/taps
//         this.bitcoin.on('pointerdown', this.handleTap.bind(this));

//         // Setup particle system
//         this.particles = this.add.particles('bitcoin');

//         console.log('Setup complete'); // Debug log
//     }

//     handleTap(pointer) {
//         console.log('Tap detected'); // Debug log
//         const currentTime = Date.now();
        
//         if (currentTime - this.lastClickTime > 2000) {
//             this.combo = 1;
//             this.sessionStartTime = currentTime;
//         }

//         // Update combo
//         const elapsedTime = currentTime - this.sessionStartTime;
//         this.combo = Math.min(5, Math.floor(elapsedTime / 10000) + 1);

//         // Visual feedback
//         this.bitcoin.setScale(0.45);
//         this.time.delayedCall(100, () => this.bitcoin.setScale(0.5));

//         // Update UI
//         this.comboText.setText(`Combo: ${this.combo}x`);

//         // Call external callback
//         if (this.clickCallback) {
//             this.clickCallback(this.combo).catch(console.error);
//         }

//         this.lastClickTime = currentTime;
//     }
// }

// const Game = () => {
//     const dispatch = useDispatch();
//     const playerData = useSelector(state => state.player);

//     useEffect(() => {
//         const handleClick = async (combo) => {
//             try {
//                 const response = await click(playerData.telegramId, combo);
//                 if (response) {
//                     dispatch(updatePlayerData(response));
//                 }
//             } catch (error) {
//                 console.error("Error during click:", error);
//             }
//         };

//         const config = {
//             type: Phaser.AUTO,
//             parent: 'game-container',
//             width: window.innerWidth,
//             height: window.innerHeight,
//             backgroundColor: '#000000',
//             scene: BitcoinScene,
//             scale: {
//                 mode: Phaser.Scale.RESIZE,
//                 autoCenter: Phaser.Scale.CENTER_BOTH
//             }
//         };

//         console.log('Creating game instance'); // Debug log
//         const game = new Phaser.Game(config);

//         // Pass the click callback to the scene
//         const scene = game.scene.getScene('BitcoinScene');
//         if (scene) {
//             scene.clickCallback = handleClick;
//         }

//         return () => {
//             console.log('Cleaning up game'); // Debug log
//             game.destroy(true);
//         };
//     }, [dispatch, playerData.telegramId]);

//     return (
//         <div 
//             id="game-container" 
//             style={{ 
//                 width: '100vw', 
//                 height: '100vh',
//                 backgroundColor: '#000' 
//             }} 
//         />
//     );
// };

// export default Game;
// import React, { useState, useRef, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { click } from '../service/api';
// import { updatePlayerData } from '../redux/playerSlice';
// import img from '../assets/Designer.jpeg';

// const Game = () => {
//     const dispatch = useDispatch();
//     const playerData = useSelector(state => state.player);
//     const [clickComboCount, setClickComboCount] = useState(1);
//     const [isClicking, setIsClicking] = useState(false);
//     const lastClickTime = useRef(null);
//     const sessionStartTime = useRef(null);
//     const currentComboRef = useRef(1);  // Track the actual combo level

//     const getComboBasedOnTime = (elapsedTime) => {
//         const seconds = elapsedTime / 1000;  
//         if (seconds <= 10) return 1;         
//         if (seconds <= 20) return 2;         
//         if (seconds <= 30) return 3;         
//         if (seconds <= 40) return 4;         
//         return 5;                            
//     };

//     useEffect(() => {
//         const checkInactivity = () => {
//             const currentTime = Date.now();
            
//             if (lastClickTime.current && (currentTime - lastClickTime.current) > 2000) {
//                 setClickComboCount(prevCount => {
//                     const newCount = Math.max(1, prevCount - 1);
//                     currentComboRef.current = newCount; // Update the ref
//                     return newCount;
//                 });
//             }
//         };

//         const decrementInterval = setInterval(checkInactivity, 2000);
//         return () => clearInterval(decrementInterval);
//     }, []);

//     const handleClick = async () => {
//         const currentTime = Date.now();
//         setIsClicking(true);
//         setTimeout(() => setIsClicking(false), 300);

//         // Reset session if there's been a long break
//         if (lastClickTime.current && (currentTime - lastClickTime.current) > 2000) {
//             sessionStartTime.current = currentTime; // Reset session time
//             currentComboRef.current = 1;  // Reset to 1x
//             setClickComboCount(1);
//         } 
//         // Start new session if first click
//         else if (!sessionStartTime.current) {
//             sessionStartTime.current = currentTime;
//         }

//         lastClickTime.current = currentTime;

//         // Only calculate new combo if we're not in a reset state
//         if (sessionStartTime.current) {
//             const elapsedTime = currentTime - sessionStartTime.current;
//             const newComboCount = getComboBasedOnTime(elapsedTime);
//             currentComboRef.current = newComboCount;
//             setClickComboCount(newComboCount);
//         }

//         try {
//             const response = await click(
//                 playerData.telegramId, 
//                 currentComboRef.current // Use current combo value
//             );
//             if (response) {
//                 dispatch(updatePlayerData(response));
//             }
//         } catch (error) {
//             console.error("Error during click:", error);
//         }
//     };

//     const formatPoints = (points) => {
//         return Number.isInteger(points) ? points.toString() : points.toFixed(2);
//     };

//     return (
//         <div className="flex flex-col items-center">
//             <div className="w-full p-4 bg-blue-50 min-h-screen flex flex-col items-center justify-center">
//                 <div className="flex items-center mb-4">
//                     {/* <ComboBar 
//                         clickComboCount={clickComboCount} 
//                         isClicking={isClicking}
//                     /> */}
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

//                 <ComboBar 
//                         clickComboCount={clickComboCount} 
//                         isClicking={isClicking}
//                     />
//             </div>
//         </div>
//     );
// };

// export default Game;


// const ComboBar = ({ clickComboCount, isClicking }) => {
//     const comboColors = {
//         1: ['bg-green-500', 'bg-green-300'],
//         2: ['bg-blue-500', 'bg-blue-300'],
//         3: ['bg-purple-500', 'bg-purple-300'],
//         4: ['bg-red-500', 'bg-red-300'],
//         5: ['bg-yellow-500', 'bg-yellow-300']
//     };

//     const comboLevels = [5, 4, 3, 2, 1];
//     const adjustedCombo = Math.max(0, clickComboCount - 1);

//     const getBarStyle = (level) => {
//         // For the next level to be achieved
//         if (level === adjustedCombo + 1) {
//             const pulseHeight = level === 5 ? 'h-full' : 'h-1/4';
//             return `${comboColors[level][1]} ${
//                 isClicking ? 'animate-tap-pulse' : 'animate-pulse-next'
//             } ${pulseHeight} opacity-90`;
//         }
//         // For already achieved levels
//         else if (level <= adjustedCombo) {
//             return `${comboColors[level][0]} h-full animate-maintain`;
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
