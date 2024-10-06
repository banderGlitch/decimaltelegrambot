import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './stores/store';
import { registerOrUpdateUser, addCoins, updateCoinsOnServer } from './stores/slices/userSlice';
import { motion, AnimatePresence } from 'framer-motion';
import backgroundImage from './assets/cryptogame.jpg';
import { getUserData } from './services/api';

interface CoinParticle {
  id: string;
  x: number;
  y: number;
  value: number;
}

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const userStatus = useSelector((state: RootState) => state.user.status);
  const [activeNav, setActiveNav] = React.useState('Battle');
  const [coinParticles, setCoinParticles] = React.useState<CoinParticle[]>([]);
  const [particleCounter, setParticleCounter] = React.useState(0);
  
  const coinIncrement = 1; // Set this to your desired increment

  useEffect(() => {
    if (userStatus === 'idle') {
      const params = new URLSearchParams(window.location.search);
      const userData = {
        telegramId: params.get('id') || '',
        name: params.get('name') || '',
        username: params.get('username') || '',
        photoUrl: params.get('photo_url') || '',
      };
      dispatch(registerOrUpdateUser(userData));
    }
  }, [userStatus, dispatch]);

  useEffect(() => {
    if (user) {
      console.log('user-------------sdfsdfdfs------------------<', user)
      const telegramId = Number(user.telegramId);
      getUserData(telegramId).then(data => {
        dispatch(addCoins(data.coins));
      });
    }
  }, []);

  useEffect(() => {
    const updateCoins = () => {
      if (user) {
        dispatch(updateCoinsOnServer());
        console.log('user?.coins--------------->', user?.coins);
        console.log('api hit taken place!!');
      }
    };

    const intervalId = setInterval(updateCoins, 1000); // 10 seconds
    return () => clearInterval(intervalId);
  }, [dispatch, user]);

  const updateCoinsOnVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'hidden') {
      dispatch(updateCoinsOnServer());
    }
  }, [dispatch]);

  

  // window.addEventListener("beforeunload", (ev) => 
  //   {  
  //       ev.preventDefault();
  //       console.log('browser tab is closed');
  //       dispatch(updateCoinsOnServer());
  //   });


  useEffect(() => {
    console.log('useEffect [updateCoinsOnVisibilityChange] called');
    
    const handleVisibilityChange = () => {
      if (user && document.visibilityState === 'hidden') {
        updateCoinsOnVisibilityChange();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [ updateCoinsOnVisibilityChange]);

  // useEffect(() => {
  //   if (userStatus === 'idle') {
  //     const params = new URLSearchParams(window.location.search);
  //     const userData = {
  //       telegramId: params.get('id') || '',
  //       name: params.get('name') || '',
  //       username: params.get('username') || '',
  //       photoUrl: params.get('photo_url') || '',
  //     };
  //     dispatch(registerOrUpdateUser(userData));
  //   }
  // }, [userStatus, dispatch]);


  // useEffect(() => {
  //   if (user) {
  //     console.log('user-------------sdfsdfdfs------------------<', user)
  //     const telegramId = Number(user.telegramId);
  //     getUserData(telegramId).then(data => {
  //       dispatch(addCoins(data.coins));
  //     });
  //   }
  // }, []);





  // useEffect(() => {
  //   const updateCoins = () => {
  //     if (user) {
  //       dispatch(updateCoinsOnServer());
  //       console.log('user?.coins--------------->', user?.coins);
  //       console.log('api hit taken place!!');
  //     }
  //   };

  //   const intervalId = setInterval(updateCoins, 10000); // 10 seconds
  //   return () => clearInterval(intervalId);
  // }, [dispatch, user]);







  const handleTap = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!user) return;
     // Animation ---------------------//
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
     // Animation ---------------------//
    console.log('coinIncrement', coinIncrement)
    dispatch(addCoins(coinIncrement));
    // Animation ---------------------//
    setCoinParticles(prev => [
      ...prev,
      {
        id: `${Date.now()}-${particleCounter}`,
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 60,
        value: coinIncrement
      }
    ]);
    setParticleCounter(prevCounter => prevCounter + 1);
  };
  // Animation ---------------------//

  if (userStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (userStatus === 'failed') {
    return <div>Error loading user data</div>;
  }






  return (
    <div className="bg-black flex justify-center h-screen relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      <div className="w-full max-w-xl relative">
        <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
            <div className="px-4 mt-4 flex justify-center">
              <motion.div
                className="text-4xl text-white font-bold"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
              >
                {user?.coins} Coins
              </motion.div>
            </div>

            <div className="px-4 mt-4 flex justify-center">
              <div
                className="w-80 h-80 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer"
                onClick={handleTap}
              >
                <motion.div
                  className="w-72 h-72 bg-gray-700 rounded-full flex items-center justify-center"
                  whileTap={{ scale: 0.95 }}
                >
                  <span style={{ fontSize: '8rem' }}>🐹</span>
                </motion.div>
              </div>
            </div>
              <AnimatePresence>
        {coinParticles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute text-yellow-300 text-2xl pointer-events-none flex items-center"
            style={{ color: '#FFD700' }}
            initial={{ x: particle.x, y: particle.y, opacity: 1, scale: 0 }}
            animate={{ y: particle.y - 100, opacity: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            onAnimationComplete={() => {
              setCoinParticles(prev => prev.filter(p => p.id !== particle.id));
            }}
          >
            <span className="mr-1">🟡</span>
            <span className="text-white text-xl font-bold">+{particle.value}</span>
          </motion.div>
        ))}
      </AnimatePresence>
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-xl bg-[#1c1f24] bg-opacity-80 backdrop-blur-sm flex justify-around items-center z-50 py-2 px-4">
          <NavItem icon="🚀" label="Boosts" isActive={activeNav === 'Boosts'} onClick={() => setActiveNav('Boosts')} />
          <NavItem icon="👥" label="Invite" isActive={activeNav === 'Invite'} onClick={() => setActiveNav('Invite')} />
          <NavItem icon="⚔️" label="Battle" isActive={activeNav === 'Battle'} onClick={() => setActiveNav('Battle')} />
          <NavItem icon="🎁" label="Earn" isActive={activeNav === 'Earn'} onClick={() => setActiveNav('Earn')} badge="5" />
          <NavItem icon="≡" label="More" isActive={activeNav === 'More'} onClick={() => setActiveNav('More')} />
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  badge?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, badge }) => {
  return (
    <div className={`text-center ${isActive ? 'text-purple-500' : 'text-gray-400'}`} onClick={onClick}>
      <div className="relative inline-block">
        <span className="text-2xl">{icon}</span>
        {badge && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs">{label}</p>
    </div>
  );
};

export default App;































// import React, { useState, useEffect } from 'react';
// import './App.css';
// import backgroundImage from './assets/cryptogame.jpg';

// interface TelegramUser {
//   id: number;
//   first_name: string;
//   last_name?: string;
//   username?: string;
//   language_code?: string;
//   is_premium?: boolean;
// }

// interface TelegramWebApp {
//   initDataUnsafe: {
//     user?: TelegramUser;
//   };
//   initData: string;
//   ready: () => void;
// }

// // Declare the Telegram types globally
// declare global {
//   interface Window {
//     Telegram?: {
//       WebApp?: TelegramWebApp;
//     };
//   }
// }

// const App: React.FC = () => {
//   const [activeNav, setActiveNav] = useState('Battle');
//   const [user, setUser] = useState<TelegramUser | null>(null);
//   const [debugInfo, setDebugInfo] = useState<string>('');

//   useEffect(() => {
//     const tg = window.Telegram?.WebApp;
//     if (tg) {
//       setDebugInfo(prev => prev + "Telegram WebApp is available\n");
//       tg.ready();
//       setDebugInfo(prev => prev + `initData: ${tg.initData}\n`);
//       if (tg.initDataUnsafe.user) {
//         setUser(tg.initDataUnsafe.user);
//         setDebugInfo(prev => prev + "User data found in initDataUnsafe\n");
//       } else {
//         setDebugInfo(prev => prev + "No user data in initDataUnsafe\n");
//       }
//     } else {
//       setDebugInfo("Telegram WebApp iasdsads not available\n");
//     }
//   }, []);

//   return (
//     <div className="bg-black flex justify-center h-screen relative">
//       <div 
//         className="absolute inset-0 bg-cover bg-center opacity-80"
//         style={{ backgroundImage: `url(${backgroundImage})` }}
//       ></div>

//       <div className="w-full max-w-xl relative">
//         <div className="flex-grow p-4 text-white">
//           {user ? (
//             <div>
//               <h2 className="text-2xl mb-4">Welcome, {user.first_name}!</h2>
//               <p>User ID: {user.id}</p>
//               {user.username && <p>Username: @{user.username}</p>}
//               {user.language_code && <p>Language: {user.language_code}</p>}
//               {user.is_premium && <p>Premium User</p>}
//             </div>
//           ) : (
//             <div>
//               <p>Loading user data...</p>
//               {debugInfo && <pre className="mt-4 text-xs whitespace-pre-wrap">{debugInfo}</pre>}
//             </div>
//           )}
//         </div>

//         <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-xl bg-[#1c1f24] bg-opacity-80 backdrop-blur-sm flex justify-around items-center z-50 py-2 px-4">
//           <NavItem icon="🚀" label="Boosts" isActive={activeNav === 'Boosts'} onClick={() => setActiveNav('Boosts')} />
//           <NavItem icon="👥" label="Invite" isActive={activeNav === 'Invite'} onClick={() => setActiveNav('Invite')} />
//           <NavItem icon="⚔️" label="Battle" isActive={activeNav === 'Battle'} onClick={() => setActiveNav('Battle')} />
//           <NavItem icon="🎁" label="Earn" isActive={activeNav === 'Earn'} onClick={() => setActiveNav('Earn')} badge="5" />
//           <NavItem icon="≡" label="More" isActive={activeNav === 'More'} onClick={() => setActiveNav('More')} />
//         </div>
//       </div>
//     </div>
//   );
// };

// interface NavItemProps {
//   icon: string;
//   label: string;
//   isActive?: boolean;
//   onClick: () => void;
//   badge?: string;
// }

// const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, badge }) => {
//   return (
//     <div className={`text-center ${isActive ? 'text-purple-500' : 'text-gray-400'}`} onClick={onClick}>
//       <div className="relative inline-block">
//         <span className="text-2xl">{icon}</span>
//         {badge && (
//           <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
//             {badge}
//           </span>
//         )}
//       </div>
//       <p className="mt-1 text-xs">{label}</p>
//     </div>
//   );
// };

// export default App;




















// import React, { useState, useEffect } from 'react';
// import './App.css';
// import backgroundImage from './assets/cryptogame.jpg';

// // Define the TelegramUser interface
// interface TelegramUser {
//   id: number;
//   first_name: string;
//   last_name?: string;
//   username?: string;
//   language_code?: string;
//   is_premium?: boolean;
// }

// // Define the WebAppInitData interface
// interface WebAppInitData {
//   query_id?: string;
//   user?: TelegramUser;
//   auth_date?: number;
//   hash?: string;
// }

// // Declare the global Telegram object
// declare global {
//   interface Window {
//     Telegram?: {
//       WebApp?: {
//         initData: string;
//         initDataUnsafe: WebAppInitData;
//       };
//     };
//   }
// }

// const App: React.FC = () => {
//   const [activeNav, setActiveNav] = useState('Battle');
//   const [user, setUser] = useState<TelegramUser | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const tg = window.Telegram?.WebApp;
//     console.log(tg);
    
//     if (!tg) {
//       setError('Telegram WebApp is not available');
//       return;
//     }

//     if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
//       setUser(tg.initDataUnsafe.user);
//     } else {
//       setError('User data is not available');
//     }
//   }, []);

//   return (
//     <div className="bg-black flex justify-center h-screen relative">
//       {/* Background image */}
//       <div 
//         className="absolute inset-0 bg-cover bg-center opacity-80"
//         style={{ backgroundImage: `url(${backgroundImage})` }}
//       ></div>

//       <div className="w-full max-w-xl relative">
//         {/* Main content area */}
//         <div className="flex-grow p-4">
//           {error ? (
//             <div className="text-red-500">{error}</div>
//           ) : user ? (
//             <div className="text-white">
//               <h2 className="text-2xl mb-4">Welcome, {user.first_name}!</h2>
//               <p>User ID: {user.id}</p>
//               {user.username && <p>Username: @{user.username}</p>}
//               {user.language_code && <p>Language: {user.language_code}</p>}
//               {user.is_premium && <p>Premium User</p>}
//             </div>
//           ) : (
//             <div className="text-white">Loading user data...</div>
//           )}
//         </div>

//         {/* Bottom navbar */}
//         <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-xl bg-[#1c1f24] bg-opacity-80 backdrop-blur-sm flex justify-around items-center z-50 py-2 px-4">
//           <NavItem icon="🚀" label="Boosts" isActive={activeNav === 'Boosts'} onClick={() => setActiveNav('Boosts')} />
//           <NavItem icon="👥" label="Invite" isActive={activeNav === 'Invite'} onClick={() => setActiveNav('Invite')} />
//           <NavItem icon="⚔️" label="Battle" isActive={activeNav === 'Battle'} onClick={() => setActiveNav('Battle')} />
//           <NavItem icon="🎁" label="Earn" isActive={activeNav === 'Earn'} onClick={() => setActiveNav('Earn')} badge="5" />
//           <NavItem icon="≡" label="More" isActive={activeNav === 'More'} onClick={() => setActiveNav('More')} />
//         </div>
//       </div>
//     </div>
//   );
// };

// interface NavItemProps {
//   icon: string;
//   label: string;
//   isActive?: boolean;
//   onClick: () => void;
//   badge?: string;
// }

// const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, badge }) => {
//   return (
//     <div className={`text-center ${isActive ? 'text-purple-500' : 'text-gray-400'}`} onClick={onClick}>
//       <div className="relative inline-block">
//         <span className="text-2xl">{icon}</span>
//         {badge && (
//           <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
//             {badge}
//           </span>
//         )}
//       </div>
//       <p className="mt-1 text-xs">{label}</p>
//     </div>
//   );
// };

// export default App;
// import React, { useState , useEffect} from 'react';
// import './App.css';
// import backgroundImage from './assets/cryptogame.jpg';

// const App: React.FC = () => {
//   const [activeNav, setActiveNav] = useState('Battle');
//   return (
//     <div className="bg-black flex justify-center h-screen relative">
//       {/* Background image */}
//       <div 
//         className="absolute inset-0 bg-cover bg-center opacity-80"
//         style={{ backgroundImage: `url(${backgroundImage})` }}
//       ></div>

//       <div className="w-full max-w-xl relative">
//         {/* Main content area */}
//         <div className="flex-grow">
//           {/* You can add your main content here later */}
//         </div>

//         {/* Bottom navbar */}
//         <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-xl bg-[#1c1f24] bg-opacity-80 backdrop-blur-sm flex justify-around items-center z-50 py-2 px-4">
//         <NavItem icon="🚀" label="Boosts" isActive={activeNav === 'Boosts'} onClick={() => setActiveNav('Boosts')} />
//           <NavItem icon="👥" label="Invite" isActive={activeNav === 'Invite'} onClick={() => setActiveNav('Invite')} />
//           <NavItem icon="⚔️" label="Battle" isActive={activeNav === 'Battle'} onClick={() => setActiveNav('Battle')} />
//           <NavItem icon="🎁" label="Earn" isActive={activeNav === 'Earn'} onClick={() => setActiveNav('Earn')} badge="5" />
//           <NavItem icon="≡" label="More" isActive={activeNav === 'More'} onClick={() => setActiveNav('More')} />
//         </div>
//       </div>
//     </div>
//   );
// };

// interface NavItemProps {
//   icon: string;
//   label: string;
//   isActive?: boolean;
//   onClick: () => void;
//   badge?: string;
// }

// const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, badge }) => {
//   return (
//     <div className={`text-center ${isActive ? 'text-purple-500' : 'text-gray-400'}`}   onClick={onClick}>
//       <div className="relative inline-block">
//         <span className="text-2xl">{icon}</span>
//         {badge && (
//           <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
//             {badge}
//           </span>
//         )}
//       </div>
//       <p className="mt-1 text-xs">{label}</p>
//     </div>
//   );
// };

// export default App;
// import React, { useState, useEffect } from 'react';
// import './App.css';
// import Hamster from './icons/Hamster';
// import { binanceLogo, dailyCipher, dailyCombo, dailyReward, dollarCoin, hamsterCoin, mainCharacter } from './images';
// import Info from './icons/Info';
// import Settings from './icons/Settings';
// import Mine from './icons/Mine';
// import Friends from './icons/Friends';
// import Coins from './icons/Coins';

// const App: React.FC = () => {
//   const levelNames = [
//     "Bronze",    // From 0 to 4999 coins
//     "Silver",    // From 5000 coins to 24,999 coins
//     "Gold",      // From 25,000 coins to 99,999 coins
//     "Platinum",  // From 100,000 coins to 999,999 coins
//     "Diamond",   // From 1,000,000 coins to 2,000,000 coins
//     "Epic",      // From 2,000,000 coins to 10,000,000 coins
//     "Legendary", // From 10,000,000 coins to 50,000,000 coins
//     "Master",    // From 50,000,000 coins to 100,000,000 coins
//     "GrandMaster", // From 100,000,000 coins to 1,000,000,000 coins
//     "Lord"       // From 1,000,000,000 coins to ∞
//   ];

//   const levelMinPoints = [
//     0,        // Bronze
//     5000,     // Silver
//     25000,    // Gold
//     100000,   // Platinum
//     1000000,  // Diamond
//     2000000,  // Epic
//     10000000, // Legendary
//     50000000, // Master
//     100000000,// GrandMaster
//     1000000000// Lord
//   ];

//   const [levelIndex, setLevelIndex] = useState(6);
//   const [points, setPoints] = useState(22749365);
//   const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
//   const pointsToAdd = 11;
//   const profitPerHour = 126420;

//   const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
//   const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
//   const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

//   const calculateTimeLeft = (targetHour: number) => {
//     const now = new Date();
//     const target = new Date(now);
//     target.setUTCHours(targetHour, 0, 0, 0);

//     if (now.getUTCHours() >= targetHour) {
//       target.setUTCDate(target.getUTCDate() + 1);
//     }

//     const diff = target.getTime() - now.getTime();
//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

//     const paddedHours = hours.toString().padStart(2, '0');
//     const paddedMinutes = minutes.toString().padStart(2, '0');

//     return `${paddedHours}:${paddedMinutes}`;
//   };

//   useEffect(() => {
//     const updateCountdowns = () => {
//       setDailyRewardTimeLeft(calculateTimeLeft(0));
//       setDailyCipherTimeLeft(calculateTimeLeft(19));
//       setDailyComboTimeLeft(calculateTimeLeft(12));
//     };

//     updateCountdowns();
//     const interval = setInterval(updateCountdowns, 60000); // Update every minute

//     return () => clearInterval(interval);
//   }, []);

//   const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     const card = e.currentTarget;
//     const rect = card.getBoundingClientRect();
//     const x = e.clientX - rect.left - rect.width / 2;
//     const y = e.clientY - rect.top - rect.height / 2;
//     card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
//     setTimeout(() => {
//       card.style.transform = '';
//     }, 100);

//     setPoints(points + pointsToAdd);
//     setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
//   };

//   const handleAnimationEnd = (id: number) => {
//     setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
//   };

//   const calculateProgress = () => {
//     if (levelIndex >= levelNames.length - 1) {
//       return 100;
//     }
//     const currentLevelMin = levelMinPoints[levelIndex];
//     const nextLevelMin = levelMinPoints[levelIndex + 1];
//     const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
//     return Math.min(progress, 100);
//   };

//   useEffect(() => {
//     const currentLevelMin = levelMinPoints[levelIndex];
//     const nextLevelMin = levelMinPoints[levelIndex + 1];
//     if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
//       setLevelIndex(levelIndex + 1);
//     } else if (points < currentLevelMin && levelIndex > 0) {
//       setLevelIndex(levelIndex - 1);
//     }
//   }, [points, levelIndex, levelMinPoints, levelNames.length]);

//   const formatProfitPerHour = (profit: number) => {
//     if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
//     if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
//     if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
//     return `+${profit}`;
//   };

//   useEffect(() => {
//     const pointsPerSecond = Math.floor(profitPerHour / 3600);
//     const interval = setInterval(() => {
//       setPoints(prevPoints => prevPoints + pointsPerSecond);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [profitPerHour]);

//   return (
//     <div className="bg-black flex justify-center">
//       <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
//         <div className="px-4 z-10">
//           <div className="flex items-center space-x-2 pt-4">
//             <div className="p-1 rounded-lg bg-[#1d2025]">
//               <Hamster size={24} className="text-[#d4d4d4]" />
//             </div>
//             <div>
//               <p className="text-sm">Nikandr (CEO)</p>
//             </div>
//           </div>
//           <div className="flex items-center justify-between space-x-4 mt-1">
//             <div className="flex items-center w-1/3">
//               <div className="w-full">
//                 <div className="flex justify-between">
//                   <p className="text-sm">{levelNames[levelIndex]}</p>
//                   <p className="text-sm">{levelIndex + 1} <span className="text-[#95908a]">/ {levelNames.length}</span></p>
//                 </div>
//                 <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
//                   <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
//                     <div className="progress-gradient h-2 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64">
//               <img src={binanceLogo} alt="Exchange" className="w-8 h-8" />
//               <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
//               <div className="flex-1 text-center">
//                 <p className="text-xs text-[#85827d] font-medium">Profit per hour</p>
//                 <div className="flex items-center justify-center space-x-1">
//                   <img src={dollarCoin} alt="Dollar Coin" className="w-[18px] h-[18px]" />
//                   <p className="text-sm">{formatProfitPerHour(profitPerHour)}</p>
//                   <Info size={20} className="text-[#43433b]" />
//                 </div>
//               </div>
//               <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
//               <Settings className="text-white" />
//             </div>
//           </div>
//         </div>

//         <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
//           <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
//             <div className="px-4 mt-6 flex justify-between gap-2">
//               <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
//                 <div className="dot"></div>
//                 <img src={dailyReward} alt="Daily Reward" className="mx-auto w-12 h-12" />
//                 <p className="text-[10px] text-center text-white mt-1">Daily reward</p>
//                 <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyRewardTimeLeft}</p>
//               </div>
//               <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
//                 <div className="dot"></div>
//                 <img src={dailyCipher} alt="Daily Cipher" className="mx-auto w-12 h-12" />
//                 <p className="text-[10px] text-center text-white mt-1">Daily cipher</p>
//                 <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyCipherTimeLeft}</p>
//               </div>
//               <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
//                 <div className="dot"></div>
//                 <img src={dailyCombo} alt="Daily Combo" className="mx-auto w-12 h-12" />
//                 <p className="text-[10px] text-center text-white mt-1">Daily combo</p>
//                 <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyComboTimeLeft}</p>
//               </div>
//             </div>

//             <div className="px-4 mt-4 flex justify-center">
//               <div className="px-4 py-2 flex items-center space-x-2">
//                 <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
//                 <p className="text-4xl text-white">{points.toLocaleString()}</p>
//               </div>
//             </div>

//             <div className="px-4 mt-4 flex justify-center">
//               <div
//                 className="w-80 h-80 p-4 rounded-full circle-outer"
//                 onClick={handleCardClick}
//               >
//                 <div className="w-full h-full rounded-full circle-inner">
//                   <img src={mainCharacter} alt="Main Character" className="w-full h-full" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom fixed div */}
//       <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
//         <div className="text-center text-[#85827d] w-1/5 bg-[#1c1f24] m-1 p-2 rounded-2xl">
//           <img src={binanceLogo} alt="Exchange" className="w-8 h-8 mx-auto" />
//           <p className="mt-1">Exchange</p>
//         </div>
//         <div className="text-center text-[#85827d] w-1/5">
//           <Mine className="w-8 h-8 mx-auto" />
//           <p className="mt-1">Mine</p>
//         </div>
//         <div className="text-center text-[#85827d] w-1/5">
//           <Friends className="w-8 h-8 mx-auto" />
//           <p className="mt-1">Friends</p>
//         </div>
//         <div className="text-center text-[#85827d] w-1/5">
//           <Coins className="w-8 h-8 mx-auto" />
//           <p className="mt-1">Earn</p>
//         </div>
//         <div className="text-center text-[#85827d] w-1/5">
//           <img src={hamsterCoin} alt="Airdrop" className="w-8 h-8 mx-auto" />
//           <p className="mt-1">Airdrop</p>
//         </div>
//       </div>

//       {clicks.map((click) => (
//         <div
//           key={click.id}
//           className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
//           style={{
//             top: `${click.y - 42}px`,
//             left: `${click.x - 28}px`,
//             animation: `float 1s ease-out`
//           }}
//           onAnimationEnd={() => handleAnimationEnd(click.id)}
//         >
//           {pointsToAdd}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default App;


// import React, { useEffect,  useCallback, useRef  } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from './stores/store';
// import { registerOrUpdateUser, addCoins, updateCoinsOnServer } from './stores/slices/userSlice';
// import { motion, AnimatePresence } from 'framer-motion';
// import backgroundImage from './assets/cryptogame.jpg';
// import debounce from 'lodash/debounce';
// import { use } from 'framer-motion/client';

// interface CoinParticle {
//   id: string;
//   x: number;
//   y: number;
//   value: number;
// }

// const App: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const user = useSelector((state: RootState) => state.user.user);
//   // const isNewUser = useSelector((state: RootState) => state.user.isNewUser);
//   const userStatus = useSelector((state: RootState) => state.user.status);
//   const [activeNav, setActiveNav] = React.useState('Battle');
//   const [coinParticles, setCoinParticles] = React.useState<CoinParticle[]>([]);
//   const [particleCounter, setParticleCounter] = React.useState(0);
  
//   const coinIncrement = 1; // Set this to your desired increment
//     // Create a ref to store the current coin count
//     // const currentCoinsRef = useRef(user?.coins || 0);
//       // Create a ref to store the current coin count
//   const currentCoinsRef = useRef(0);

//   useEffect(() => {
//     if (userStatus === 'idle') {
//       const params = new URLSearchParams(window.location.search);
//       const userData = {
//         telegramId: params.get('id') || '',
//         name: params.get('name') || '',
//         username: params.get('username') || '',
//         photoUrl: params.get('photo_url') || '',
//       };
//       dispatch(registerOrUpdateUser(userData));
//     }
//   }, [userStatus, dispatch]);




//   // Update the ref whenever the user's coins change
//   useEffect(() => {
//     console.log('user?.coins', user?.coins)
    
//   }, [user?.coins]);


 

//   const debouncedUpdateCoins = setTimeout(() => {
//     if (user) {
//       dispatch(updateCoinsOnServer(user?.coins));
//       console.log('user?.coins--------------->', user?.coins)
//       // console.log('currentCoinsRef.current', currentCoinsRef.current)
//       console.log('api hit taken place!!')
//     }
//   }, 10000) // 10 seconds delay



  
//    // const debouncedUpdateCoins = useCallback(

//   //   debounce(() => {
//   //     if (user) {
//   //       dispatch(updateCoinsOnServer(user?.coins));
//   //       console.log('currentCoinsRef.current', currentCoinsRef.current)
//   //       console.log('api hit taken place!!')
//   //     }
//   //   }, 10000), // 0 seconds delay
//   //   [dispatch]
//   // );

  






//   const handleTap = (event: React.MouseEvent<HTMLDivElement>) => {
//     if (!user) return;

//     const rect = event.currentTarget.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;
//     console.log('coinIncrement', coinIncrement)
//     dispatch(addCoins(coinIncrement));
//     currentCoinsRef.current += coinIncrement;

//     setCoinParticles(prev => [
//       ...prev,
//       {
//         id: `${Date.now()}-${particleCounter}`,
//         x: x + (Math.random() - 0.5) * 60,
//         y: y + (Math.random() - 0.5) * 60,
//         value: coinIncrement
//       }
//     ]);
//     setParticleCounter(prevCounter => prevCounter + 1);
//     // Call the debounced function to update coins on the server
//     debouncedUpdateCoins();
//   };

//   if (userStatus === 'loading') {
//     return <div>Loading...</div>;
//   }

//   if (userStatus === 'failed') {
//     return <div>Error loading user data</div>;
//   }
//   return (
//     <div className="bg-black flex justify-center h-screen relative">
//       <div 
//         className="absolute inset-0 bg-cover bg-center opacity-80"
//         style={{ backgroundImage: `url(${backgroundImage})` }}
//       ></div>

//       <div className="w-full max-w-xl relative">
//         <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
//           <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
//             <div className="px-4 mt-4 flex justify-center">
//               <motion.div
//                 className="text-4xl text-white font-bold"
//                 initial={{ scale: 1 }}
//                 animate={{ scale: [1, 1.2, 1] }}
//                 transition={{ duration: 0.3 }}
//               >
//                 {user?.coins} Coins
//               </motion.div>
//             </div>

//             <div className="px-4 mt-4 flex justify-center">
//               <div
//                 className="w-80 h-80 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer"
//                 onClick={handleTap}
//               >
//                 <motion.div
//                   className="w-72 h-72 bg-gray-700 rounded-full flex items-center justify-center"
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <span style={{ fontSize: '8rem' }}>🐹</span>
//                 </motion.div>
//               </div>
//             </div>
//               <AnimatePresence>
//         {coinParticles.map(particle => (
//           <motion.div
//             key={particle.id}
//             className="absolute text-yellow-300 text-2xl pointer-events-none flex items-center"
//             style={{ color: '#FFD700' }}
//             initial={{ x: particle.x, y: particle.y, opacity: 1, scale: 0 }}
//             animate={{ y: particle.y - 100, opacity: 0, scale: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 1 }}
//             onAnimationComplete={() => {
//               setCoinParticles(prev => prev.filter(p => p.id !== particle.id));
//             }}
//           >
//             <span className="mr-1">🟡</span>
//             <span className="text-white text-xl font-bold">+{particle.value}</span>
//           </motion.div>
//         ))}
//       </AnimatePresence>
//           </div>
//         </div>

//         <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-xl bg-[#1c1f24] bg-opacity-80 backdrop-blur-sm flex justify-around items-center z-50 py-2 px-4">
//           <NavItem icon="🚀" label="Boosts" isActive={activeNav === 'Boosts'} onClick={() => setActiveNav('Boosts')} />
//           <NavItem icon="👥" label="Invite" isActive={activeNav === 'Invite'} onClick={() => setActiveNav('Invite')} />
//           <NavItem icon="⚔️" label="Battle" isActive={activeNav === 'Battle'} onClick={() => setActiveNav('Battle')} />
//           <NavItem icon="🎁" label="Earn" isActive={activeNav === 'Earn'} onClick={() => setActiveNav('Earn')} badge="5" />
//           <NavItem icon="≡" label="More" isActive={activeNav === 'More'} onClick={() => setActiveNav('More')} />
//         </div>
//       </div>
//     </div>
//   );
// };

// interface NavItemProps {
//   icon: string;
//   label: string;
//   isActive?: boolean;
//   onClick: () => void;
//   badge?: string;
// }

// const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, badge }) => {
//   return (
//     <div className={`text-center ${isActive ? 'text-purple-500' : 'text-gray-400'}`} onClick={onClick}>
//       <div className="relative inline-block">
//         <span className="text-2xl">{icon}</span>
//         {badge && (
//           <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
//             {badge}
//           </span>
//         )}
//       </div>
//       <p className="mt-1 text-xs">{label}</p>
//     </div>
//   );
// };

// export default App;































// // import React, { useState, useEffect } from 'react';
// // import './App.css';
// // import backgroundImage from './assets/cryptogame.jpg';

// // interface TelegramUser {
// //   id: number;
// //   first_name: string;
// //   last_name?: string;
// //   username?: string;
// //   language_code?: string;
// //   is_premium?: boolean;
// // }

// // interface TelegramWebApp {
// //   initDataUnsafe: {
// //     user?: TelegramUser;
// //   };
// //   initData: string;
// //   ready: () => void;
// // }

// // // Declare the Telegram types globally
// // declare global {
// //   interface Window {
// //     Telegram?: {
// //       WebApp?: TelegramWebApp;
// //     };
// //   }
// // }

// // const App: React.FC = () => {
// //   const [activeNav, setActiveNav] = useState('Battle');
// //   const [user, setUser] = useState<TelegramUser | null>(null);
// //   const [debugInfo, setDebugInfo] = useState<string>('');

// //   useEffect(() => {
// //     const tg = window.Telegram?.WebApp;
// //     if (tg) {
// //       setDebugInfo(prev => prev + "Telegram WebApp is available\n");
// //       tg.ready();
// //       setDebugInfo(prev => prev + `initData: ${tg.initData}\n`);
// //       if (tg.initDataUnsafe.user) {
// //         setUser(tg.initDataUnsafe.user);
// //         setDebugInfo(prev => prev + "User data found in initDataUnsafe\n");
// //       } else {
// //         setDebugInfo(prev => prev + "No user data in initDataUnsafe\n");
// //       }
// //     } else {
// //       setDebugInfo("Telegram WebApp iasdsads not available\n");
// //     }
// //   }, []);

// //   return (
// //     <div className="bg-black flex justify-center h-screen relative">
// //       <div 
// //         className="absolute inset-0 bg-cover bg-center opacity-80"
// //         style={{ backgroundImage: `url(${backgroundImage})` }}
// //       ></div>

// //       <div className="w-full max-w-xl relative">
// //         <div className="flex-grow p-4 text-white">
// //           {user ? (
// //             <div>
// //               <h2 className="text-2xl mb-4">Welcome, {user.first_name}!</h2>
// //               <p>User ID: {user.id}</p>
// //               {user.username && <p>Username: @{user.username}</p>}
// //               {user.language_code && <p>Language: {user.language_code}</p>}
// //               {user.is_premium && <p>Premium User</p>}
// //             </div>
// //           ) : (
// //             <div>
// //               <p>Loading user data...</p>
// //               {debugInfo && <pre className="mt-4 text-xs whitespace-pre-wrap">{debugInfo}</pre>}
// //             </div>
// //           )}
// //         </div>

// //         <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-xl bg-[#1c1f24] bg-opacity-80 backdrop-blur-sm flex justify-around items-center z-50 py-2 px-4">
// //           <NavItem icon="🚀" label="Boosts" isActive={activeNav === 'Boosts'} onClick={() => setActiveNav('Boosts')} />
// //           <NavItem icon="👥" label="Invite" isActive={activeNav === 'Invite'} onClick={() => setActiveNav('Invite')} />
// //           <NavItem icon="⚔️" label="Battle" isActive={activeNav === 'Battle'} onClick={() => setActiveNav('Battle')} />
// //           <NavItem icon="🎁" label="Earn" isActive={activeNav === 'Earn'} onClick={() => setActiveNav('Earn')} badge="5" />
// //           <NavItem icon="≡" label="More" isActive={activeNav === 'More'} onClick={() => setActiveNav('More')} />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // interface NavItemProps {
// //   icon: string;
// //   label: string;
// //   isActive?: boolean;
// //   onClick: () => void;
// //   badge?: string;
// // }

// // const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, badge }) => {
// //   return (
// //     <div className={`text-center ${isActive ? 'text-purple-500' : 'text-gray-400'}`} onClick={onClick}>
// //       <div className="relative inline-block">
// //         <span className="text-2xl">{icon}</span>
// //         {badge && (
// //           <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
// //             {badge}
// //           </span>
// //         )}
// //       </div>
// //       <p className="mt-1 text-xs">{label}</p>
// //     </div>
// //   );
// // };

// // export default App;




















// import React, { useState, useEffect } from 'react';
// import './App.css';
// import backgroundImage from './assets/cryptogame.jpg';

// // Define the TelegramUser interface
// interface TelegramUser {
//   id: number;
//   first_name: string;
//   last_name?: string;
//   username?: string;
//   language_code?: string;
//   is_premium?: boolean;
// }

// // Define the WebAppInitData interface
// interface WebAppInitData {
//   query_id?: string;
//   user?: TelegramUser;
//   auth_date?: number;
//   hash?: string;
// }

// // Declare the global Telegram object
// declare global {
//   interface Window {
//     Telegram?: {
//       WebApp?: {
//         initData: string;
//         initDataUnsafe: WebAppInitData;
//       };
//     };
//   }
// }

// const App: React.FC = () => {
//   const [activeNav, setActiveNav] = useState('Battle');
//   const [user, setUser] = useState<TelegramUser | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const tg = window.Telegram?.WebApp;
//     console.log(tg);
    
//     if (!tg) {
//       setError('Telegram WebApp is not available');
//       return;
//     }

//     if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
//       setUser(tg.initDataUnsafe.user);
//     } else {
//       setError('User data is not available');
//     }
//   }, []);

//   return (
//     <div className="bg-black flex justify-center h-screen relative">
//       {/* Background image */}
//       <div 
//         className="absolute inset-0 bg-cover bg-center opacity-80"
//         style={{ backgroundImage: `url(${backgroundImage})` }}
//       ></div>

//       <div className="w-full max-w-xl relative">
//         {/* Main content area */}
//         <div className="flex-grow p-4">
//           {error ? (
//             <div className="text-red-500">{error}</div>
//           ) : user ? (
//             <div className="text-white">
//               <h2 className="text-2xl mb-4">Welcome, {user.first_name}!</h2>
//               <p>User ID: {user.id}</p>
//               {user.username && <p>Username: @{user.username}</p>}
//               {user.language_code && <p>Language: {user.language_code}</p>}
//               {user.is_premium && <p>Premium User</p>}
//             </div>
//           ) : (
//             <div className="text-white">Loading user data...</div>
//           )}
//         </div>

//         {/* Bottom navbar */}
//         <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-xl bg-[#1c1f24] bg-opacity-80 backdrop-blur-sm flex justify-around items-center z-50 py-2 px-4">
//           <NavItem icon="🚀" label="Boosts" isActive={activeNav === 'Boosts'} onClick={() => setActiveNav('Boosts')} />
//           <NavItem icon="👥" label="Invite" isActive={activeNav === 'Invite'} onClick={() => setActiveNav('Invite')} />
//           <NavItem icon="⚔️" label="Battle" isActive={activeNav === 'Battle'} onClick={() => setActiveNav('Battle')} />
//           <NavItem icon="🎁" label="Earn" isActive={activeNav === 'Earn'} onClick={() => setActiveNav('Earn')} badge="5" />
//           <NavItem icon="≡" label="More" isActive={activeNav === 'More'} onClick={() => setActiveNav('More')} />
//         </div>
//       </div>
//     </div>
//   );
// };

// interface NavItemProps {
//   icon: string;
//   label: string;
//   isActive?: boolean;
//   onClick: () => void;
//   badge?: string;
// }

// const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, badge }) => {
//   return (
//     <div className={`text-center ${isActive ? 'text-purple-500' : 'text-gray-400'}`} onClick={onClick}>
//       <div className="relative inline-block">
//         <span className="text-2xl">{icon}</span>
//         {badge && (
//           <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
//             {badge}
//           </span>
//         )}
//       </div>
//       <p className="mt-1 text-xs">{label}</p>
//     </div>
//   );
// };

// export default App;
// import React, { useState , useEffect} from 'react';
// import './App.css';
// import backgroundImage from './assets/cryptogame.jpg';

// const App: React.FC = () => {
//   const [activeNav, setActiveNav] = useState('Battle');
//   return (
//     <div className="bg-black flex justify-center h-screen relative">
//       {/* Background image */}
//       <div 
//         className="absolute inset-0 bg-cover bg-center opacity-80"
//         style={{ backgroundImage: `url(${backgroundImage})` }}
//       ></div>

//       <div className="w-full max-w-xl relative">
//         {/* Main content area */}
//         <div className="flex-grow">
//           {/* You can add your main content here later */}
//         </div>

//         {/* Bottom navbar */}
//         <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-xl bg-[#1c1f24] bg-opacity-80 backdrop-blur-sm flex justify-around items-center z-50 py-2 px-4">
//         <NavItem icon="🚀" label="Boosts" isActive={activeNav === 'Boosts'} onClick={() => setActiveNav('Boosts')} />
//           <NavItem icon="👥" label="Invite" isActive={activeNav === 'Invite'} onClick={() => setActiveNav('Invite')} />
//           <NavItem icon="⚔️" label="Battle" isActive={activeNav === 'Battle'} onClick={() => setActiveNav('Battle')} />
//           <NavItem icon="🎁" label="Earn" isActive={activeNav === 'Earn'} onClick={() => setActiveNav('Earn')} badge="5" />
//           <NavItem icon="≡" label="More" isActive={activeNav === 'More'} onClick={() => setActiveNav('More')} />
//         </div>
//       </div>
//     </div>
//   );
// };

// interface NavItemProps {
//   icon: string;
//   label: string;
//   isActive?: boolean;
//   onClick: () => void;
//   badge?: string;
// }

// const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, badge }) => {
//   return (
//     <div className={`text-center ${isActive ? 'text-purple-500' : 'text-gray-400'}`}   onClick={onClick}>
//       <div className="relative inline-block">
//         <span className="text-2xl">{icon}</span>
//         {badge && (
//           <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
//             {badge}
//           </span>
//         )}
//       </div>
//       <p className="mt-1 text-xs">{label}</p>
//     </div>
//   );
// };

// export default App;
// import React, { useState, useEffect } from 'react';
// import './App.css';
// import Hamster from './icons/Hamster';
// import { binanceLogo, dailyCipher, dailyCombo, dailyReward, dollarCoin, hamsterCoin, mainCharacter } from './images';
// import Info from './icons/Info';
// import Settings from './icons/Settings';
// import Mine from './icons/Mine';
// import Friends from './icons/Friends';
// import Coins from './icons/Coins';

// const App: React.FC = () => {
//   const levelNames = [
//     "Bronze",    // From 0 to 4999 coins
//     "Silver",    // From 5000 coins to 24,999 coins
//     "Gold",      // From 25,000 coins to 99,999 coins
//     "Platinum",  // From 100,000 coins to 999,999 coins
//     "Diamond",   // From 1,000,000 coins to 2,000,000 coins
//     "Epic",      // From 2,000,000 coins to 10,000,000 coins
//     "Legendary", // From 10,000,000 coins to 50,000,000 coins
//     "Master",    // From 50,000,000 coins to 100,000,000 coins
//     "GrandMaster", // From 100,000,000 coins to 1,000,000,000 coins
//     "Lord"       // From 1,000,000,000 coins to ∞
//   ];

//   const levelMinPoints = [
//     0,        // Bronze
//     5000,     // Silver
//     25000,    // Gold
//     100000,   // Platinum
//     1000000,  // Diamond
//     2000000,  // Epic
//     10000000, // Legendary
//     50000000, // Master
//     100000000,// GrandMaster
//     1000000000// Lord
//   ];

//   const [levelIndex, setLevelIndex] = useState(6);
//   const [points, setPoints] = useState(22749365);
//   const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
//   const pointsToAdd = 11;
//   const profitPerHour = 126420;

//   const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
//   const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
//   const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

//   const calculateTimeLeft = (targetHour: number) => {
//     const now = new Date();
//     const target = new Date(now);
//     target.setUTCHours(targetHour, 0, 0, 0);

//     if (now.getUTCHours() >= targetHour) {
//       target.setUTCDate(target.getUTCDate() + 1);
//     }

//     const diff = target.getTime() - now.getTime();
//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

//     const paddedHours = hours.toString().padStart(2, '0');
//     const paddedMinutes = minutes.toString().padStart(2, '0');

//     return `${paddedHours}:${paddedMinutes}`;
//   };

//   useEffect(() => {
//     const updateCountdowns = () => {
//       setDailyRewardTimeLeft(calculateTimeLeft(0));
//       setDailyCipherTimeLeft(calculateTimeLeft(19));
//       setDailyComboTimeLeft(calculateTimeLeft(12));
//     };

//     updateCountdowns();
//     const interval = setInterval(updateCountdowns, 60000); // Update every minute

//     return () => clearInterval(interval);
//   }, []);

//   const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     const card = e.currentTarget;
//     const rect = card.getBoundingClientRect();
//     const x = e.clientX - rect.left - rect.width / 2;
//     const y = e.clientY - rect.top - rect.height / 2;
//     card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
//     setTimeout(() => {
//       card.style.transform = '';
//     }, 100);

//     setPoints(points + pointsToAdd);
//     setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
//   };

//   const handleAnimationEnd = (id: number) => {
//     setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
//   };

//   const calculateProgress = () => {
//     if (levelIndex >= levelNames.length - 1) {
//       return 100;
//     }
//     const currentLevelMin = levelMinPoints[levelIndex];
//     const nextLevelMin = levelMinPoints[levelIndex + 1];
//     const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
//     return Math.min(progress, 100);
//   };

//   useEffect(() => {
//     const currentLevelMin = levelMinPoints[levelIndex];
//     const nextLevelMin = levelMinPoints[levelIndex + 1];
//     if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
//       setLevelIndex(levelIndex + 1);
//     } else if (points < currentLevelMin && levelIndex > 0) {
//       setLevelIndex(levelIndex - 1);
//     }
//   }, [points, levelIndex, levelMinPoints, levelNames.length]);

//   const formatProfitPerHour = (profit: number) => {
//     if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
//     if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
//     if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
//     return `+${profit}`;
//   };

//   useEffect(() => {
//     const pointsPerSecond = Math.floor(profitPerHour / 3600);
//     const interval = setInterval(() => {
//       setPoints(prevPoints => prevPoints + pointsPerSecond);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [profitPerHour]);

//   return (
//     <div className="bg-black flex justify-center">
//       <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
//         <div className="px-4 z-10">
//           <div className="flex items-center space-x-2 pt-4">
//             <div className="p-1 rounded-lg bg-[#1d2025]">
//               <Hamster size={24} className="text-[#d4d4d4]" />
//             </div>
//             <div>
//               <p className="text-sm">Nikandr (CEO)</p>
//             </div>
//           </div>
//           <div className="flex items-center justify-between space-x-4 mt-1">
//             <div className="flex items-center w-1/3">
//               <div className="w-full">
//                 <div className="flex justify-between">
//                   <p className="text-sm">{levelNames[levelIndex]}</p>
//                   <p className="text-sm">{levelIndex + 1} <span className="text-[#95908a]">/ {levelNames.length}</span></p>
//                 </div>
//                 <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
//                   <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
//                     <div className="progress-gradient h-2 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64">
//               <img src={binanceLogo} alt="Exchange" className="w-8 h-8" />
//               <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
//               <div className="flex-1 text-center">
//                 <p className="text-xs text-[#85827d] font-medium">Profit per hour</p>
//                 <div className="flex items-center justify-center space-x-1">
//                   <img src={dollarCoin} alt="Dollar Coin" className="w-[18px] h-[18px]" />
//                   <p className="text-sm">{formatProfitPerHour(profitPerHour)}</p>
//                   <Info size={20} className="text-[#43433b]" />
//                 </div>
//               </div>
//               <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
//               <Settings className="text-white" />
//             </div>
//           </div>
//         </div>

//         <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
//           <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
//             <div className="px-4 mt-6 flex justify-between gap-2">
//               <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
//                 <div className="dot"></div>
//                 <img src={dailyReward} alt="Daily Reward" className="mx-auto w-12 h-12" />
//                 <p className="text-[10px] text-center text-white mt-1">Daily reward</p>
//                 <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyRewardTimeLeft}</p>
//               </div>
//               <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
//                 <div className="dot"></div>
//                 <img src={dailyCipher} alt="Daily Cipher" className="mx-auto w-12 h-12" />
//                 <p className="text-[10px] text-center text-white mt-1">Daily cipher</p>
//                 <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyCipherTimeLeft}</p>
//               </div>
//               <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
//                 <div className="dot"></div>
//                 <img src={dailyCombo} alt="Daily Combo" className="mx-auto w-12 h-12" />
//                 <p className="text-[10px] text-center text-white mt-1">Daily combo</p>
//                 <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyComboTimeLeft}</p>
//               </div>
//             </div>

//             <div className="px-4 mt-4 flex justify-center">
//               <div className="px-4 py-2 flex items-center space-x-2">
//                 <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
//                 <p className="text-4xl text-white">{points.toLocaleString()}</p>
//               </div>
//             </div>

//             <div className="px-4 mt-4 flex justify-center">
//               <div
//                 className="w-80 h-80 p-4 rounded-full circle-outer"
//                 onClick={handleCardClick}
//               >
//                 <div className="w-full h-full rounded-full circle-inner">
//                   <img src={mainCharacter} alt="Main Character" className="w-full h-full" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom fixed div */}
//       <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
//         <div className="text-center text-[#85827d] w-1/5 bg-[#1c1f24] m-1 p-2 rounded-2xl">
//           <img src={binanceLogo} alt="Exchange" className="w-8 h-8 mx-auto" />
//           <p className="mt-1">Exchange</p>
//         </div>
//         <div className="text-center text-[#85827d] w-1/5">
//           <Mine className="w-8 h-8 mx-auto" />
//           <p className="mt-1">Mine</p>
//         </div>
//         <div className="text-center text-[#85827d] w-1/5">
//           <Friends className="w-8 h-8 mx-auto" />
//           <p className="mt-1">Friends</p>
//         </div>
//         <div className="text-center text-[#85827d] w-1/5">
//           <Coins className="w-8 h-8 mx-auto" />
//           <p className="mt-1">Earn</p>
//         </div>
//         <div className="text-center text-[#85827d] w-1/5">
//           <img src={hamsterCoin} alt="Airdrop" className="w-8 h-8 mx-auto" />
//           <p className="mt-1">Airdrop</p>
//         </div>
//       </div>

//       {clicks.map((click) => (
//         <div
//           key={click.id}
//           className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
//           style={{
//             top: `${click.y - 42}px`,
//             left: `${click.x - 28}px`,
//             animation: `float 1s ease-out`
//           }}
//           onAnimationEnd={() => handleAnimationEnd(click.id)}
//         >
//           {pointsToAdd}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default App;
