import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../services/api'; // Assuming you have a User type defined

interface UserData {
  telegramId: string;
  name: string;
  points: string;
  level: string;
  clickCount: string;
  streakCount: string;
  happinessIndex: string;
}

interface BattleProps {
  userData: UserData | null;
  strength: number;
  isTapping: boolean;
  coinParticles: Array<{ id: string; x: number; y: number; value: number }>;
  handleTap: (event: React.MouseEvent<HTMLDivElement>) => void;
  setCoinParticles: React.Dispatch<React.SetStateAction<Array<{ id: string; x: number; y: number; value: number }>>>;
}

const Battle: React.FC<BattleProps> = ({ userData, strength, isTapping, coinParticles, handleTap, setCoinParticles }) => {
  return (
    <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
      {userData &&(
        <div>
          <h1>{userData.name}</h1>
          <h1>{userData.points}</h1>
          <h1>{userData.level}</h1> 
          <h1>{userData.clickCount}</h1>
          <h1>{userData.streakCount}</h1>
          <h1>{userData.happinessIndex}</h1>
          <h1>{userData.comboBonus}</h1>
          <h1>{userData.lastClickTime}</h1>
          <h1>{userData.createdAt}</h1>
        </div>
      )}
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

        <div className="px-4 mt-4 flex justify-center items-center">
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
          <div className="ml-4 w-1 h-64 bg-gray-700 rounded-full overflow-hidden relative">
             <motion.div 
               className="bg-green-500 w-full absolute bottom-0 left-0 right-0 transition-all duration-300 ease-out"
               style={{ height: `${strength}%` }}
               animate={isTapping ? { scale: [1, 1.2, 1] } : {}}
               transition={{ duration: 0.1 }}
             />
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
  );
};

export default Battle;