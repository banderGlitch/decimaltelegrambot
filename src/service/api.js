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

  