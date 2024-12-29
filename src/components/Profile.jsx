import React from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const playerData = useSelector((state) => state.player);

  return (
    <div className="p-6 bg-gradient-to-r from-blue-500 to-green-500 min-h-screen flex flex-col items-center">
      {/* Profile Header */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 text-center">
        <img
          src={`https://avatars.dicebear.com/api/identicon/${playerData.username}.svg`}
          alt="Profile Avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {playerData.username}!
        </h1>
        <p className="text-gray-500 text-sm">Telegram ID: {playerData.telegramId}</p>
      </div>

      {/* Stats Section */}
      <div className="mt-6 w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Player Stats</h2>
        <div className="flex justify-between text-gray-700">
          <span>Points:</span>
          <span className="font-bold">{playerData.points.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Level:</span>
          <span className="font-bold">{playerData.level}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Happiness Index:</span>
          <span className="font-bold">{playerData.happinessIndex.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Maintenance Cost:</span>
          <span className="font-bold">{playerData.maintenanceCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Points per Click:</span>
          <span className="font-bold">{playerData.pointsPerClick.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Click Combo Count:</span>
          <span className="font-bold">{playerData.clickComboCount}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Last Click:</span>
          <span className="font-bold">
            {new Date(playerData.lastClickTimestamp).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Account Created:</span>
          <span className="font-bold">
            {new Date(playerData.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Upgrades and Boosts */}
      <div className="mt-6 w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Upgrades & Boosts</h2>
        <div>
          <h3 className="text-gray-700 font-medium">Purchased Upgrades:</h3>
          <ul className="list-disc ml-6 text-gray-600">
            {playerData.purchasedUpgrades.map((upgrade, index) => (
              <li key={index}>
                Upgrade ID: <span className="font-bold">{upgrade.upgradeId}</span>, Cost Level:{" "}
                <span className="font-bold">{upgrade.costLevel}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-gray-700 font-medium">Active Boosts:</h3>
          <ul className="list-disc ml-6 text-gray-600">
            {playerData.activeBoosts.map((boost, index) => (
              <li key={index}>
                Boost ID: <span className="font-bold">{boost.boostId}</span>, Value:{" "}
                <span className="font-bold">{boost.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;


// import React from 'react';
// import { useSelector } from 'react-redux';
// const Profile = () => {
//     const playerData = useSelector(state => state.player);
//     return (
//         <div className="p-4 bg-green-50 min-h-screen flex flex-col items-center">
//             <h1>Welcome to the Clicker Game, {playerData.username}!</h1>
//             <p>Telegram ID: {playerData.telegramId}</p>
//             <p>Points: {playerData.points}</p>
//             <p>Level: {playerData.level}</p>
//             <p>Happiness Index: {playerData.happinessIndex}</p>
//             <p>Maintenance Cost: {playerData.maintenanceCost}</p>
//             <p>Points per Click: {playerData.pointsPerClick}</p>
//             <p>Click Combo Count: {playerData.clickComboCount}</p>
//             <p>Last Click: {playerData.lastClickTimestamp}</p>
//             <p>Account Created: {playerData.createdAt}</p>
//             <p>Purchased Upgrades: {JSON.stringify(playerData.purchasedUpgrades)}</p>
//             <p>Active Boosts: {JSON.stringify(playerData.activeBoosts)}</p>
//         </div>
//     );
// };

// export default Profile;