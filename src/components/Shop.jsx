import React from 'react';

const Shop = ({ playerData }) => {
    return (
        <div className="p-4 bg-green-50 min-h-screen flex flex-col items-center">
            <h1>Welcome to the Clicker Game, {playerData.name}!</h1>
            <p>Telegram ID: {playerData.telegramId}</p>
            <p>Points: {playerData.points}</p>
            <p>Level: {playerData.level}</p>
            <p>Happiness Index: {playerData.happinessIndex}</p>
            <p>Maintenance Cost: {playerData.maintenanceCost}</p>
            <p>Points per Click: {playerData.pointsPerClick}</p>
            <p>Click Combo Count: {playerData.clickComboCount}</p>
            <p>Last Click: {playerData.lastClickTimestamp}</p>
            <p>Account Created: {playerData.createdAt}</p>
            <p>Purchased Upgrades: {JSON.stringify(playerData.purchasedUpgrades)}</p>
            <p>Active Boosts: {JSON.stringify(playerData.activeBoosts)}</p>
            <a href="/" className="mt-4 text-green-600 underline">
                Go back to Game
            </a>
        </div>
    );
};

export default Shop;
