import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store';
interface UserData {
  telegramId: string;
  name: string;
  points: number;
  level: number;
  clickCount: number;
  streakCount: number;
  happinessIndex: number;
  comboBonus: number;
  lastClickTime: string;
  purchasedUpgrades: number[];
  createdAt: string;
}

interface BattleProps {
  userData: UserData | null;
  handleTap: (event: React.MouseEvent<HTMLDivElement>) => Promise<void>;
}

const Battle: React.FC<BattleProps> = ({ userData, handleTap }) => {
  const hippoData = useSelector((state: RootState) => state.hippo.hippodata); 
  console.log('userData-sdasd---------->', userData)
  console.log('userData-sdasd---------->', userData?.telegramId)
  return (
    <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative z-0">
      <div className="bg-[#1d2025] rounded-t-[46px] overflow-hidden p-4 flex flex-col h-full">
        <div className="text-white mb-4">
          <h2 className="text-xl font-bold mb-2">{userData?.name}'s Stats</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p>Telegram ID: {hippoData?.telegramId}</p>
            <p>Points: {hippoData?.points}</p>
            <p>Level: {hippoData?.level}</p>
            <p>Clicks: {hippoData?.clickCount}</p>
            <p>Streak: {hippoData?.streakCount}</p>
            <p>Happiness: {hippoData?.happinessIndex}</p>
            <p>Combo Bonus: {hippoData?.comboBonus}</p>
            <p>Purchased Upgrades: {hippoData?.purchasedUpgrades}</p>
          </div>
        </div>
                
        <div className="flex-grow flex justify-center items-center">
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

