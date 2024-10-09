import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;


export interface User {
    id: string;
    telegramId: number;
    name: string;
    username: string;
    photoUrl: string;
    coins: number;
  }

export interface Task {
    id: string;
    type: string;
    title: string;
    status: boolean;
    reward: number;
    callbackUrl: string;
    action: string;
}

  export const getUserData = async (telegramId: number): Promise<User> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/getUserSpecific/${telegramId}`);
      return response.data.user;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  export const getTasks = async (): Promise<Task[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/getTasks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  };


  export const updateTaskStatus = async (taskId: string, status: boolean): Promise<void> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/updateTaskStatus`, {
        taskId,
        status
      });
  
      if (response.status !== 200) {
        throw new Error('Failed to update task status');
      }
  
      // You can return the updated task data if your API provides it
      // return response.data;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  };







