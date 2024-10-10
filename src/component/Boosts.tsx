import  { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store';
import { getUpgrades } from '../services/api';
import { purchase } from '../services/api';




export default function Boosts() {
  const hippoData = useSelector((state: RootState) => state.hippo.hippodata);
  const [product, setProduct] = useState<any>([]);

  console.log('hippoData-----------------adasdsadsa-asd---->', hippoData);

  useEffect(() => {
    const fetchUpgrades = async () => {
      try {
        const upgrades = await getUpgrades();
        console.log('upgrades---------->', upgrades);
        setProduct(upgrades);
      } catch (error) {
        console.error('Error fetching upgrades:', error);
      }
    };

    fetchUpgrades();
  }, []);

  const points = hippoData?.points ?? '0';



  // const handlePurchase = async ({upgradeId, telegramId}: PurchaseParams) => {
  //   // Implement your purchase logic here
  //   // console.log(`Purchasing upgrade with ID: ${upgradeId}`);
  //   const result = await purchase(upgradeId, telegramId);
  //   console.log('result----->', result);
  // };

  const handlePurchase = async (upgradeId: number) => {
    if (!hippoData?.telegramId) {
      console.error('Telegram ID is not available');
      return;
    }

    try {
      const result = await purchase(upgradeId, hippoData.telegramId);
      console.log('result----->', result);
      // Handle successful purchase (e.g., update state, show notification)
    } catch (error) {
      console.error('Error purchasing upgrade:', error);
      // Handle error (e.g., show error message to user)
    }
  };


  return (
    <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative z-0">
      <div className="bg-[#1d2025] rounded-t-[46px] overflow-hidden p-4 flex flex-col h-full">
        <div className="text-white mb-4">
          <h2 className="text-xl font-bold mb-2">Boost Your Earnings</h2>
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
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Shop</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {product && product.upgrades?.map((upgrade: any) => {
                const playerUpgrade = Array.isArray(hippoData?.purchasedUpgrades)
                  ? hippoData.purchasedUpgrades.find(u => u.upgradeId === upgrade._id)
                  : undefined;
                const nextLevel = playerUpgrade ? playerUpgrade.currentLevel + 1 : 1;
                const nextLevelData = upgrade.levels.find((l: any) => l.levelNumber === nextLevel);

                return (
                  <div key={upgrade._id} className="shadow-md p-4 rounded-lg">
                    <h2 className="text-lg font-bold">{upgrade.name}</h2>
                    <p>{upgrade.description}</p>
                    <p>Next Level: {nextLevel}</p>
                    <p>Cost: {nextLevelData ? nextLevelData.cost : 'Maxed out'}</p>
                    <p>Effect: {nextLevelData ? nextLevelData.effectValue : 'Maxed out'}</p>
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
                      disabled={!nextLevelData || points < nextLevelData.cost}
                      onClick={() => handlePurchase(upgrade._id)}
                    >
                      {nextLevelData ? 'Buy' : 'Max Level'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          );
        </div>
      </div>
    </div>
  )
}

// import React, {useState} from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '../stores/store';
// import { User } from '../services/api';

// interface BoostOption {
//     multiplier: number;
//     cost: number;
// }

// const boostsOptions: BoostOption[] = [
//     { multiplier: 2, cost: 100 },
//     { multiplier: 3, cost: 200 },
//     { multiplier: 4, cost: 400 },
//     { multiplier: 5, cost: 500},
//     { multiplier: 6, cost: 1000},
//     { multiplier: 7, cost: 2000},
//     { multiplier: 8, cost: 4000},
//     { multiplier: 9, cost: 8000},
//     { multiplier: 10, cost: 16000},
//     { multiplier: 11, cost: 32000},
//     { multiplier: 12, cost: 64000},
//     { multiplier: 13, cost: 128000},
//     { multiplier: 14, cost: 256000},
//     { multiplier: 15, cost: 512000},
//     // { multiplier: 4, cost: 400 },
//     // { multiplier: 5, cost: 800 },
// ];

// const Boosts: React.FC = () => {
//     // const dispatch = useDispatch();
//     const user = useSelector((state: RootState) => state.user.user) as User | null;
//     const [activeBoost, setActiveBoost] = useState<BoostOption | null>(null);
//     console.log("user------->", user);
//     const handleBoostActivation = (boost: BoostOption) => {
//        console.log("boost", boost);
//     };

//     return (
//         <div className="flex-grow mt-4 ml-4 mr-4 bg-[#1d2025] rounded-t-[48px] p-7 max-h-[calc(100vh-6rem)] overflow-y-auto">
//       <h2 className="text-2xl text-white font-bold mb-1">Boost Your Earnings</h2>
//       <p className="text-gray-300 mb-4">Activate multipliers to earn more coins!</p>
//       <div className="space-y-4">
//         {boostsOptions.map((boost) => (
//           <div key={boost.multiplier} className="bg-purple-800 rounded-lg p-4 flex items-center justify-between">
//             <div>
//               <h3 className="text-xl font-semibold text-white">{boost.multiplier}x Multiplier</h3>
//               <p className="text-yellow-400 text-sm font-bold">Cost: {boost.cost} coins</p>
//             </div>
//             <button
//               className={`${
//                 activeBoost === boost.multiplier
//                   ? 'bg-green-500 cursor-not-allowed'
//                   : user.coins >= boost.cost
//                   ? 'bg-purple-600 hover:bg-purple-700'
//                   : 'bg-gray-500 cursor-not-allowed'
//               } text-white font-bold py-2 px-4 rounded transition duration-300`}
//               onClick={() => handleBoostActivation(boost)}
//               disabled={activeBoost === boost.multiplier || user?.coins < boost.cost}
//             >
//               {activeBoost === boost.multiplier ? 'Active' : 'Activate'}
//             </button>
//           </div>
//         ))}
//       </div>
//       <div className="mt-4 text-center text-white">
//         Your current balance: <span className="font-bold text-yellow-400">{user.coins} coins</span>
//       </div>
//     </div>
//     );
// // };

// export default Boosts;