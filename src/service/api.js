import axios from 'axios';

const API_LOCAL = import.meta.env.VITE_API_LOCAL;

export const click = async (telegramId) => {
    console.log("telegramIdasdasdasdasasdasdsadsadasdsa", telegramId)
    try {
      const response = await axios.post(`${API_LOCAL}/api/click`, {telegramId});
      return response.data;
    } catch (error) {
      console.error('Error clicking:', error);
      throw error;
    }
  };

export const shopUpgrade = async () => {
    try {
        const response = await axios.get(`${API_LOCAL}/api/shop-upgrades`);
        return response.data;
    } catch (error) {
        console.error('Error getting shop upgrades:', error);
        throw error;
    }
}

export const purchaseUpgrade = async (telegramId, upgradeId, costLevel) => {
    try {
        const response = await axios.post(`${API_LOCAL}/api/purchase-upgrade`, {telegramId, upgradeId, costLevel});
        return response.data;
    } catch (error) {
        console.error('Error purchasing upgrade:', error);
        throw error;
    }
}

export const updatePlayerDataApi = async (playerData) => {
    console.log("playerData----->", playerData);
    try {
        const response = await axios.post(`${API_LOCAL}/api/updatedplayerdata`,{playerData});
        return response.data;
    } catch (error) {
        console.error('Error updating player data:', error);
        throw error;
    }
}

export const getTasksApi = async () => {
    try {
        const response = await axios.get(`${API_LOCAL}/api/gettasks`);
        return response.data;
    } catch (error) {
        console.error('Error getting tasks:', error);
        throw error;
    }
}
