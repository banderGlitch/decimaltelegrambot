import React, { useEffect, } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { updatePlayerData, updatePurchasedUpgradeCost } from './redux/playerSlice';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './components/Game';
import Shop from './components/Shop';
import Tasks from './components/Task';
import Profile from './components/Profile';
import { shopUpgrade, getTasksApi, streak , deleteTelegramMessage } from './service/api';
import { setUpgrades } from './redux/upgradeSlice';
import { setTasks } from './redux/taskSlice';

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-green-500 shadow-lg">
    <div className="flex justify-around items-center h-16">
      <Link
        to="/"
        className={`flex flex-col items-center ${
          location.pathname === "/" ? "text-yellow-400" : "text-white"
        }`}
      >
        <span className="text-2xl">🎮</span>
        <span className="text-sm">Game</span>
      </Link>
      <Link
        to="/shop"
        className={`flex flex-col items-center ${
          location.pathname === "/shop" ? "text-yellow-400" : "text-white"
        }`}
      >
        <span className="text-2xl">🛒</span>
        <span className="text-sm">Shop</span>
      </Link>
      <Link
        to="/tasks"
        className={`flex flex-col items-center ${
          location.pathname === "/tasks" ? "text-yellow-400" : "text-white"
        }`}
      >
        <span className="text-2xl">📋</span>
        <span className="text-sm">Tasks</span>
      </Link>
      <Link
        to="/profile"
        className={`flex flex-col items-center ${
          location.pathname === "/profile" ? "text-yellow-400" : "text-white"
        }`}
      >
        <span className="text-2xl">👤</span>
        <span className="text-sm">Profile</span>
      </Link>
    </div>
  </nav>
  );
};



function App() {
  const dispatch = useDispatch();
  const playerData = useSelector(state => state.player);
  const upgrades = useSelector(state => state.upgrades);
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
      tasks: JSON.parse(params.get('tasks') || '[]'),
      activeBoosts: JSON.parse(params.get('activeBoosts') || '[]'),
      streak: parseInt(params.get('streak')) || 0,
      chatId: params.get('chatId') || '',
      lastMessageId: parseInt(params.get('startMessageId')) || null

    };
    dispatch(updatePlayerData(player));
  };




  useEffect(() => {
    // Parse the query params when the component mounts
    parseQueryParams();
  }, [dispatch]);

  useEffect(() => {
    //call shop upgrade api 
    const fetchShopUpgrades = async () => {
      const res = await shopUpgrade();
      console.log("res----shopUpgrade--------->", res);
      dispatch(setUpgrades(res));
      // console.log("res----->", res);
    };
    fetchShopUpgrades();
  }, [dispatch]);


  useEffect(() => {
    const fetchTasks = async () => {
      const res = await getTasksApi();
      console.log("res----tasks--------->", res);
      dispatch(setTasks(res));
    };
    fetchTasks();
  }, [dispatch]);


  console.log("purchasedUpgrade---------------->s", playerData)

  useEffect(() => {
    console.log("Effect triggered. Checking data:");
    console.log("playerData?.purchasedUpgrades:", playerData?.purchasedUpgrades);
    console.log("upgrades:", upgrades);

    if (!playerData?.purchasedUpgrades || !upgrades || upgrades.length === 0) {
      console.log("Data not available yet. Skipping effect.");
      return;
    }

    playerData.purchasedUpgrades.forEach((purchasedUpgrade) => {
      console.log("Checking purchased upgrade:", purchasedUpgrade);

      const matchingUpgrade = upgrades.find(upgrade => upgrade._id === purchasedUpgrade.upgradeId);

      if (matchingUpgrade) {
        console.log("Matching upgrade found:", matchingUpgrade);
        const cost = matchingUpgrade.costs[purchasedUpgrade.Costlevel + 1]?.cost;
        console.log("Upgrade:", purchasedUpgrade);
        console.log("Cost for current level:", cost);
        dispatch(updatePurchasedUpgradeCost({
          upgradeId: purchasedUpgrade.upgradeId,
          cost: cost
        }));
      } else {
        console.log("No matching upgrade found for:", purchasedUpgrade);
      }
    });
  }, [dispatch, upgrades, playerData]);



  // streak api 


  useEffect(() => {
    const updatePlayerStreak = async () => {
      if (playerData?.telegramId) {
        try {
          const streakData = await streak(playerData.telegramId);
          console.log("Streak updated:", streakData);
          // Optionally dispatch streak data to store if needed
        } catch (error) {
          console.error("Error updating streak:", error);
        }
      }
    };
    updatePlayerStreak();
  }, [playerData?.telegramId]);



  useEffect(() => {
    if (playerData?.chatId && playerData?.lastMessageId) {
      deleteTelegramMessage(playerData.chatId, playerData.lastMessageId+1);
    }
  }, [playerData?.chatId, playerData?.lastMessageId]);



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
