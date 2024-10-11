import React from 'react';
import { useSelector } from 'react-redux';

const Shop = () => {
    const playerData = useSelector(state => state.player);

    return (
        <div className="p-4 bg-green-50 min-h-screen flex flex-col items-center">
            <h1>Shop</h1>
            <p>Points: {playerData.points}</p>
        </div>
    );
};

export default Shop;
