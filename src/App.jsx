import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { updatePlayerData } from './redux/playerSlice';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './components/Game';
import Shop from './components/Shop';
import Tasks from './components/Task';
import Profile from './components/Profile';



const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
      <div className="flex justify-around items-center h-16">
        <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-blue-500' : 'text-gray-500'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs">Game</span>
        </Link>
        <Link to="/shop" className={`flex flex-col items-center ${location.pathname === '/shop' ? 'text-blue-500' : 'text-gray-500'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="text-xs">Shop</span>
        </Link>
        <Link to="/tasks" className={`flex flex-col items-center ${location.pathname === '/tasks' ? 'text-blue-500' : 'text-gray-500'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-xs">Tasks</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center ${location.pathname === '/profile' ? 'text-blue-500' : 'text-gray-500'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  );
};



function App() {
  const dispatch = useDispatch();

  const parseQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    const player = {
      telegramId: params.get('telegramId') || '',
      username: params.get('username') || '',
      points: parseInt(params.get('points')) || 0,
      level: parseInt(params.get('level')) || 1,
      happinessIndex: parseInt(params.get('happinessIndex')) || 50, // Discuss the default value if needed
      maintenanceCost: parseFloat(params.get('maintenanceCost')) || 0,
      pointsPerClick: parseInt(params.get('pointsPerClick')) || 1,
      clickComboCount: parseInt(params.get('clickComboCount')) || 0,
      lastClickTimestamp: params.get('lastClickTimestamp') || new Date().toISOString(),
      createdAt: params.get('createdAt') || '',
      purchasedUpgrades: JSON.parse(params.get('purchasedUpgrades') || '[]'),
      activeBoosts: JSON.parse(params.get('activeBoosts') || '[]')
    };
    dispatch(updatePlayerData(player));
  };


  useEffect(() => {
    // Parse the query params when the component mounts
    parseQueryParams();
  }, [dispatch]);





  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}



export default App;
