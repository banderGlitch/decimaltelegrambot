import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { purchaseUpgrade } from '../service/api';
import { shopUpgrade } from '../service/api';
import { setUpgrades } from '../redux/upgradeSlice';
import { updatePlayerData } from '../redux/playerSlice';
const Shop = () => {
    const playerData = useSelector(state => state.player);
    const upgrades = useSelector(state => state.upgrades);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchShopUpgrades = async () => {
            const res = await shopUpgrade();
            dispatch(setUpgrades(res));
            console.log("res----->", res);
        };
        fetchShopUpgrades();
    }, []);


    const handlePurchase = async (upgradeId, level) => {


        console.log("level---adsasdds-->",upgradeId, level);
        try {
            const response = await purchaseUpgrade(playerData.telegramId, upgradeId, level);
            console.log("response-----nextLevel->", response);
            dispatch(updatePlayerData(response));
            // dispatch(updatePlayerData(response));
            // if(response.success){
            //     dispatch(updatePlayerData(response));
            // }
        } catch (error) {
            console.error("Error during purchase:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-green-50">
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-2">Shop</h1>
            <p className="mb-2">Points: {playerData.points}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upgrades.map((upgrade) => {
                    const playerUpgrade = Array.isArray(playerData.purchasedUpgrades) ? playerData.purchasedUpgrades.find(u => u.upgradeId === upgrade._id) : null;
                    const nextLevel = playerUpgrade ? playerUpgrade.Costlevel + 1 : 1;
                    console.log("nextLevel----->", nextLevel);
                    console.log(`playerUpgrade--${upgrade._id}--->`, playerUpgrade);
                    const currentLevel = playerUpgrade ? playerUpgrade.CostLevel : 0;
                    console.log("currentLevel----->", currentLevel);

                    // const nextLevel = currentLevel + 1;
                    const nextLevelData = upgrade.costs.find(c => c.level === nextLevel);
                    console.log("nextLevelData----->", nextLevelData);

                    // const isMaxLevel = currentLevel >= upgrade.maxLevel;
                    // const canAfford = playerData.points >= (nextLevelData?.cost || Infinity);

                    return (
                        <div key={upgrade._id} className="bg-white shadow-md p-4 rounded-lg">
                            <h2 className="text-lg font-bold">{upgrade.name}</h2>
                            <p>{upgrade.description}</p>
                            <p>Current Level: {currentLevel}</p>
                            {/* <p>Max Level: {upgrade.maxLevel}</p> */}
                            {/* {!isMaxLevel && (
                                <>
                                    <p>Next Level: {nextLevel}</p>
                                    <p>Cost: {nextLevelData ? nextLevelData.cost : 'N/A'}</p>
                                    <p>Effect: {upgrade.effect}</p>
                                </>
                            )} */}

                             <>
                                    <p>Next Level: {nextLevel}</p>
                                    <p>Cost: {nextLevelData ? nextLevelData.cost : 'N/A'}</p>
                                    {/* <p>Effect: {upgrade.effect}</p> */}
                                </>

                            
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded mt-4 disabled:bg-gray-400"
                                // disabled={isMaxLevel || !canAfford}
                                onClick={() => handlePurchase(upgrade._id, 2)}
                            >
                                Buy
                                {/* {isMaxLevel ? 'Max Level' : (canAfford ? 'Buy' : 'Not Enough Points')} */}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
        // <div className="p-4 bg-green-50 min-h-screen">
        //     <h1 className="text-2xl font-bold mb-4">Shop</h1>
        //     <p className="mb-4">Points: {playerData.points}</p>
        //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        //         {upgrades.map((upgrade) => {
        //             const playerUpgrade = playerData.purchasedUpgrades.find(u => u.upgradeId === upgrade._id);
        //             const currentLevel = playerUpgrade ? playerUpgrade.currentLevel : 0;
        //             const nextLevel = currentLevel + 1;
        //             const nextLevelData = upgrade.costs.find(c => c.level === nextLevel);

        //             const isMaxLevel = currentLevel >= upgrade.maxLevel;
        //             const canAfford = playerData.points >= (nextLevelData?.cost || Infinity);

        //             return (
        //                 <div key={upgrade._id} className="bg-white shadow-md p-4 rounded-lg">
        //                     <h2 className="text-lg font-bold">{upgrade.name}</h2>
        //                     <p>{upgrade.description}</p>
        //                     <p>Current Level: {currentLevel}</p>
        //                     <p>Max Level: {upgrade.maxLevel}</p>
        //                     {!isMaxLevel && (
        //                         <>
        //                             <p>Next Level: {nextLevel}</p>
        //                             <p>Cost: {nextLevelData ? nextLevelData.cost : 'N/A'}</p>
        //                             <p>Effect: {upgrade.effect}</p>
        //                         </>
        //                     )}
        //                     <button
        //                         className="bg-blue-500 text-white py-2 px-4 rounded mt-4 disabled:bg-gray-400"
        //                         disabled={isMaxLevel || !canAfford}
        //                         onClick={() => handlePurchase(upgrade._id)}
        //                     >
        //                         {isMaxLevel ? 'Max Level' : (canAfford ? 'Buy' : 'Not Enough Points')}
        //                     </button>
        //                 </div>
        //             );
        //         })}
        //     </div>
        // </div>
        // <div className="p-4 bg-green-50 min-h-screen">
        //     <h1 className="text-2xl font-bold mb-4">Shop</h1>
        //     <p className="mb-4">Points: {playerData.points}</p>
        //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        //         {upgrades.map((upgrade) => {
        //             const playerUpgrade = playerData.purchasedUpgrades.find(u => u.upgradeId === upgrade._id);
        //             const nextLevel = playerUpgrade ? playerUpgrade.currentLevel + 1 : 1;
        //             const nextLevelData = upgrade.levels.find(l => l.levelNumber === nextLevel);

        //             return (
        //                 <div key={upgrade._id} className="bg-white shadow-md p-4 rounded-lg">
        //                     <h2 className="text-lg font-bold">{upgrade.name}</h2>
        //                     <p>{upgrade.description}</p>
        //                     <p>Current Level: {playerUpgrade ? playerUpgrade.currentLevel : 0}</p>
        //                     <p>Next Level: {nextLevel}</p>
        //                     <p>Cost: {nextLevelData ? nextLevelData.cost : 'Maxed out'}</p>
        //                     <p>Effect: {nextLevelData ? nextLevelData.effectValue : 'Maxed out'}</p>
        //                     <button
        //                         className="bg-blue-500 text-white py-2 px-4 rounded mt-4 disabled:bg-gray-400"
        //                         disabled={!nextLevelData || playerData.points < nextLevelData.cost}
        //                         onClick={() => handlePurchase(upgrade._id)}
        //                     >
        //                         {nextLevelData ? 'Buy' : 'Max Level'}
        //                     </button>
        //                 </div>
        //             );
        //         })}
        //     </div>
        // </div>
        // <div className="p-4 bg-green-50 min-h-screen flex flex-col items-center">
        //     <h1>Shop</h1>
        //     <p>Points: {playerData.points}</p>
        //     {upgrades.map((upgrade) => {
        //         const playerUpgrade = playerData.purchasedUpgrades.find(u => u.upgradeId === upgrade._id);
        //         const nextLevel = playerUpgrade ? playerUpgrade.currentLevel + 1 : 1;
        //         const nextLevelData = upgrade.levels.find(l => l.levelNumber === nextLevel);

        //         return (
        //             <div key={upgrade._id} className="bg-white shadow-md p-4 rounded-lg">
        //                 <h2 className="text-lg font-bold">{upgrade.name}</h2>
        //                 <p>{upgrade.description}</p>
        //                 <p>Next Level: {nextLevel}</p>
        //                 <p>Cost: {nextLevelData ? nextLevelData.cost : 'Maxed out'}</p>
        //                 <p>Effect: {nextLevelData ? nextLevelData.effectValue : 'Maxed out'}</p>
        //                 <button
        //                     className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
        //                     disabled={!nextLevelData || playerData.points < nextLevelData.cost}
        //                     onClick={() => handlePurchase(upgrade._id)}
        //                 >
        //                     {nextLevelData ? 'Buy' : 'Max Level'}
        //                 </button>
        //             </div>
        //         );
        //     })}
        // </div>
    );
};

export default Shop;
