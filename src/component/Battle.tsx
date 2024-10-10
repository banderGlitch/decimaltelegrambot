import React from 'react';
import { motion } from 'framer-motion';

interface UserData {
  telegramId: string;
  name: string;
  points: string;
  level: string;
  clickCount: string;
  streakCount: string;
  happinessIndex: string;
  comboBonus: string;
  lastClickTime: string;
  createdAt: string;
}

interface BattleProps {
  userData: UserData | null;
  handleTap: (event: React.MouseEvent<HTMLDivElement>) => Promise<void>;
}

const Battle: React.FC<BattleProps> = ({ userData, handleTap }) => {
  return (
    <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
      <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px] overflow-hidden">
        {userData && (
          <div className="px-4 pt-4 text-white">
            <h2 className="text-xl font-bold mb-2">{userData.name}'s Stats</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>Points: {userData.points}</p>
              <p>Level: {userData.level}</p>
              <p>Clicks: {userData.clickCount}</p>
              <p>Streak: {userData.streakCount}</p>
              <p>Happiness: {userData.happinessIndex}</p>
              <p>Combo Bonus: {userData.comboBonus}</p>
            </div>
          </div>
        )}
        
        <div className="px-4 mt-8 flex justify-center items-center">
          <motion.div
            className="w-80 h-80 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer"
            whileTap={{ scale: 0.95 }}
            onClick={handleTap}
          >
            <div className="w-72 h-72 bg-gray-700 rounded-full flex items-center justify-center">
              <span style={{ fontSize: '8rem' }}>🐹</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Battle;

