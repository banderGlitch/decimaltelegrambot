import React , {useEffect , useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './components/Game';
import Shop from './components/Shop';

function App() {
  const [playerData, setPlayerData] = useState({
    telegramId: '',
    username: '',
    points: 0,
    level: 1,
    happinessIndex: 50, // Default value for happinessIndex to be discussed
    maintenanceCost: 0,
    pointsPerClick: 1,
    clickComboCount: 0,
    lastClickTimestamp: '',
    createdAt: '',
    purchasedUpgrades: [],
    activeBoosts: []
  });


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
    setPlayerData(player);
  };


  useEffect(() => {
    // Parse the query params when the component mounts
    parseQueryParams();
  }, []);






  return (
    <Router>
      <Routes>
        <Route path="/" element={<Game playerData={playerData} />} />
        <Route path="/shop" element={<Shop playerData={playerData} />} />
      </Routes>
    </Router>
  );
}

export default App;
