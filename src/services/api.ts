import axios from 'axios';


const API_BASE_URL = 'http://localhost:9000/api';

export interface User {
    id: string;
    telegramId: number;
    name: string;
    username: string;
    photoUrl: string;
    coins: number;
  }

  export const getUserData = async (telegramId: number): Promise<User> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/getUserSpecific/${telegramId}`);
      return response.data.user;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };


