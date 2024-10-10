import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './stores/store';
import Battle from './component/Battle';
import Boosts from './component/Boosts';
import Earn from './component/Earn';
import backgroundImage from './assets/cryptogame.jpg';
import { User } from './services/api';

interface CoinParticle {
  id: string;
  x: number;
  y: number;
  value: number;
}

interface UserData {
  telegramId: string;
  name: string;
  points: string;
  level: string;
  clickCount: string;
  streakCount: string;
  happinessIndex: string;
}
const App: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const userStatus = useSelector((state: RootState) => state.user.status);
  const [activeNav, setActiveNav] = React.useState('Battle');
  const [coinParticles, setCoinParticles] = React.useState<CoinParticle[]>([]);
  const [particleCounter, setParticleCounter] = React.useState(0);
  const [showStrength, setShowStrength] = useState(false);
  const [strength, setStrength] = useState(0)
  const [tapCount, setTapCount] = useState(0);
  const [isTapping, setIsTapping] = useState(false);
  const [coinIncrement, setCoinIncrement] = useState(1);
  const [userData, setUserData] = useState<UserData | null>(null);

  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userData = {
      telegramId: params.get('id') || '',
      name: params.get('name') || '',
      points: params.get('points') || '',
      level: params.get('level') || '',
      clickCount: params.get('clickCount') || '',
      streakCount: params.get('streakCount') || '',
      happinessIndex: params.get('happinessIndex') || '',
      comboBonus: params.get('comboBonus') || '',
      lastClickTime: params.get('lastClickTime') || '',
      createdAt: params.get('createdAt') || '',
    };
    console.log('userData-------------->', userData)
    setUserData(userData);
  }, []);








  const handleTap = async (event: React.MouseEvent<HTMLDivElement>) => {
    // await click(Number(telegramId))
     // Animation ---------------------//
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
     // Animation ---------------------//
    // console.log('coinIncrement', coinIncrement
    // dispatch(addCoins(coinIncrement));
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

    setStrength(prev => {
      const newStrength = Math.min(100, prev + 10);
      if (newStrength >= 90 && coinIncrement === 1) {
        setCoinIncrement(2);
        console.log('coinIncrement', coinIncrement)
      }
      return newStrength;
    });

    setShowStrength(!showStrength);

    setTapCount(prev => prev + 1);

    setIsTapping(true);
    if (tapCount % 5 === 4) {
      setStrength(prev => Math.min(100, prev + 10));
    }
    setTimeout(() => setIsTapping(false), 100);
  };
  // Animation ---------------------//


  const renderMainContent = () => {
    switch (activeNav) {
      case 'Battle':
        return (
          <Battle 
            user={user as User | null}
            strength={strength}
            isTapping={isTapping}
            coinParticles={coinParticles}
            handleTap={handleTap}
            userData={userData}
            setCoinParticles={setCoinParticles}
          />
        );
      case 'Boosts':
        return <Boosts />;
      case 'Earn':
        return <Earn />;
      default:
        return <Battle 
        user={user as User | null}
          strength={strength}
          isTapping={isTapping}
          coinParticles={coinParticles}
          handleTap={handleTap}
          setCoinParticles={setCoinParticles}
        />;
    }
  };

  const handleNavClick = (navItem: string) => {
    setActiveNav(navItem);
  };


  if (userStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (userStatus === 'failed') {
    return <div>Error loading user data</div>;
  }






  return (
    <div className="bg-black flex justify-center h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-80 z-0"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      <div className="w-full max-w-xl relative z-10">
        {renderMainContent()}
    

        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-xl bg-[#1c1f24] bg-opacity-80 backdrop-blur-sm flex justify-around items-center z-50 py-2 px-4">
          <NavItem icon="🚀" label="Boosts" isActive={activeNav === 'Boosts'} onClick={() => handleNavClick('Boosts')} />
          <NavItem icon="⚔️" label="Battle" isActive={activeNav === 'Battle'} onClick={() => handleNavClick('Battle')} />
          <NavItem icon="🎁" label="Earn" isActive={activeNav === 'Earn'} onClick={() => handleNavClick('Earn')} badge="5" />
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, badge }) => {
  return (
    <div  className={`
      text-center cursor-pointer transition-all duration-300 ease-in-out
      ${isActive ? 'text-purple-500' : 'text-gray-400'}
      hover:bg-gray-700 hover:rounded-xl p-2
    `} 
    onClick={onClick}
  >
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



// Existing code we have
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from './stores/store';
// import { registerOrUpdateUser, addCoins, updateCoinsOnServer } from './stores/slices/userSlice';
// import { motion, AnimatePresence } from 'framer-motion';
// import backgroundImage from './assets/cryptogame.jpg';
// import { getUserData } from './services/api';

// interface CoinParticle {
//   id: string;
//   x: number;
//   y: number;
//   value: number;
// }

// const App: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const user = useSelector((state: RootState) => state.user.user);
//   const userStatus = useSelector((state: RootState) => state.user.status);
//   const [activeNav, setActiveNav] = React.useState('Battle');
//   const [coinParticles, setCoinParticles] = React.useState<CoinParticle[]>([]);
//   const [particleCounter, setParticleCounter] = React.useState(0);
//   const [showStrength, setShowStrength] = useState(false);
//   const [strength, setStrength] = useState(0)
//   const [tapCount, setTapCount] = useState(0);
//   const [isTapping, setIsTapping] = useState(false);
//   const [coinIncrement, setCoinIncrement] = useState(1);

  
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


//   useEffect(() => {
//     if (user) {
//       console.log('user-----------------------------<', user)
//       const telegramId = Number(user.telegramId);
//       getUserData(telegramId).then(data => {
//         dispatch(addCoins(data.coins));
//       });
//     }
//   }, []);

//   const previousCoinsRef = useRef(user?.coins);

//   useEffect(() => {
//     const updateCoins = () => {
//       if (user && user.coins !== previousCoinsRef.current) {
//         dispatch(updateCoinsOnServer());
//         console.log('user?.coins--------------->', user?.coins);
//         console.log('api hit taken place!!');
//         previousCoinsRef.current = user.coins;
//       } else {
//         console.log('Coins unchanged, skipping API call');
//       }
//     };

//     const intervalId = setInterval(updateCoins, 1000); // 10 seconds
//     return () => clearInterval(intervalId);
//   }, [dispatch, user]);

//   const updateCoinsOnVisibilityChange = useCallback(() => {
//     if (document.visibilityState === 'hidden') {
//       dispatch(updateCoinsOnServer());
//     }
//   }, [dispatch]);

  


//   useEffect(() => {
//     console.log('useEffect [updateCoinsOnVisibilityChange] called');
    
//     const handleVisibilityChange = () => {
//       if (user && document.visibilityState === 'hidden') {
//         updateCoinsOnVisibilityChange();
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, [ updateCoinsOnVisibilityChange]);


//   useEffect(() => {
//     const timer = setInterval(() => {
//       setStrength(prev => {
//         const newStrength = Math.max(0, prev - 5);
//         if (newStrength < 90 && coinIncrement === 2) {
//           setCoinIncrement(1);
//         }
//         return newStrength;
//       });
//     }, 300);

//     return () => clearInterval(timer);
//   }, [coinIncrement]);








//   const handleTap = (event: React.MouseEvent<HTMLDivElement>) => {
//     if (!user) return;
//      // Animation ---------------------//
//     const rect = event.currentTarget.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;
//      // Animation ---------------------//
//     console.log('coinIncrement', coinIncrement)
//     dispatch(addCoins(coinIncrement));
//     // Animation ---------------------//
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

//     setStrength(prev => {
//       const newStrength = Math.min(100, prev + 10);
//       if (newStrength >= 90 && coinIncrement === 1) {
//         setCoinIncrement(2);
//         console.log('coinIncrement', coinIncrement)
//       }
//       return newStrength;
//     });

//     // Toggle strength bar visibility
//     setShowStrength(!showStrength);

//     // Simulate strength increase (you can adjust this logic as needed)
//     // setStrength(prevStrength => Math.min(prevStrength + 5, 100));
//     setTapCount(prev => prev + 1);

//     setIsTapping(true);
//     if (tapCount % 5 === 4) {
//       setStrength(prev => Math.min(100, prev + 10));
//     }
//     setTimeout(() => setIsTapping(false), 100);
//   };
//   // Animation ---------------------//

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

//             <div className="px-4 mt-4 flex justify-center items-center">
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
//               <div className="ml-4 w-1 h-64 bg-gray-700 rounded-full overflow-hidden relative">
//                  <motion.div 
//                    className="bg-green-500 w-full absolute bottom-0 left-0 right-0 transition-all duration-300 ease-out"
//                    style={{ height: `${strength}%` }}
//                    animate={isTapping ? { scale: [1, 1.2, 1] } : {}}
//                    transition={{ duration: 0.1 }}
//                  />
//                </div>
//             </div>
//             <AnimatePresence>
//               {coinParticles.map(particle => (
//                 <motion.div
//                   key={particle.id}
//                   className="absolute text-yellow-300 text-2xl pointer-events-none flex items-center"
//                   style={{ color: '#FFD700' }}
//                   initial={{ x: particle.x, y: particle.y, opacity: 1, scale: 0 }}
//                   animate={{ y: particle.y - 100, opacity: 0, scale: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 1 }}
//                   onAnimationComplete={() => {
//                     setCoinParticles(prev => prev.filter(p => p.id !== particle.id));
//                   }}
//                 >
//                   <span className="mr-1">🟡</span>
//                   <span className="text-white text-xl font-bold">+{particle.value}</span>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         </div>
    

//         <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-xl bg-[#1c1f24] bg-opacity-80 backdrop-blur-sm flex justify-around items-center z-50 py-2 px-4">
//           <NavItem icon="🚀" label="Boosts" isActive={activeNav === 'Boosts'} onClick={() => setActiveNav('Boosts')} />
//           {/* <NavItem icon="👥" label="Invite" isActive={activeNav === 'Invite'} onClick={() => setActiveNav('Invite')} /> */}
//           <NavItem icon="⚔️" label="Battle" isActive={activeNav === 'Battle'} onClick={() => setActiveNav('Battle')} />
//           <NavItem icon="🎁" label="Earn" isActive={activeNav === 'Earn'} onClick={() => setActiveNav('Earn')} badge="5" />
//           {/* <NavItem icon="≡" label="More" isActive={activeNav === 'More'} onClick={() => setActiveNav('More')} /> */}
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
//     <div  className={`
//       text-center cursor-pointer transition-all duration-300 ease-in-out
//       ${isActive ? 'text-purple-500' : 'text-gray-400'}
//       hover:bg-gray-700 hover:rounded-xl p-2
//     `} 
//     onClick={onClick}
//   >
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

