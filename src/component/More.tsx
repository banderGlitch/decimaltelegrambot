import { useSelector } from 'react-redux';
import { RootState } from '../stores/store';

export default function More() {
    const hippoData = useSelector((state: RootState) => state.hippo.hippodata);
    return (
        <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative z-0">
        <div className="bg-[#1d2025] rounded-t-[46px] overflow-hidden p-4 flex flex-col h-full">
          <div className="text-white mb-4">
            <h2 className="text-xl font-bold mb-2">Profile</h2>
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
        </div>
      </div>
    )
}
