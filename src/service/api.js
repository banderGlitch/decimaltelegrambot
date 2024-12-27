import axios from 'axios';

const API_LOCAL = import.meta.env.VITE_API;
const TWITTER_API_BASE = 'https://api.twitter.com/2';
const TWITTER_BEARER_TOKEN = import.meta.env.VITE_TWITTER_BEARER_TOKEN;

// Create axios instance for local API calls
const localAxios = axios.create({
  baseURL: API_LOCAL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Create axios instance for Twitter API calls
const twitterAxios = axios.create({
    baseURL: TWITTER_API_BASE,
    headers: {
        'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
        'Content-Type': 'application/json'
    }
});

export const click = async (telegramId, clickComboCount) => {
    try {
        const response = await localAxios.post('/api/click', {telegramId, clickComboCount});
        return response.data;
    } catch (error) {
        console.error('Error clicking:', error);
        throw error;
    }
};

export const shopUpgrade = async () => {
    try {
        const response = await localAxios.get('/api/shop-upgrades');
        return response.data;
    } catch (error) {
        console.error('Error getting shop upgrades:', error);
        throw error;
    }
}

export const purchaseUpgrade = async (telegramId, upgradeId, costLevel) => {
    try {
        const response = await localAxios.post('/api/purchase-upgrade', {telegramId, upgradeId, costLevel});
        return response.data;
    } catch (error) {
        console.error('Error purchasing upgrade:', error);
        throw error;
    }
}

export const updatePlayerDataApi = async (playerData) => {
    try {
        const response = await localAxios.post('/api/updatedplayerdata', {playerData});
        return response.data;
    } catch (error) {
        console.error('Error updating player data:', error);
        throw error;
    }
}

export const getTasksApi = async () => {
    try {
        const response = await localAxios.get('/api/gettasks');
        return response.data;
    } catch (error) {
        console.error('Error getting tasks:', error);
        throw error;
    }
}

export const streak = async (telegramId) => {
    try {
        const response = await localAxios.post('/api/streaks', {telegramId});
        return response.data;
    } catch (error) {
        console.error('Error getting streak:', error);
        throw error;
    }
}

// Telegram API functions - using regular axios since it's a different domain
export const deleteTelegramMessage = async (chatId, messageId) => {
    try {
        const response = await axios.post(
            `https://api.telegram.org/bot${import.meta.env.VITE_TELEGRAM_BOT_TOKEN}/deleteMessage`,
            {
                chat_id: chatId,
                message_id: messageId
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error deleting message:', error.response?.data || error.message);
        throw error;
    }
};

// Twitter API functions
export const getUserByUsername = async (username) => {
    try {
        const response = await twitterAxios.get(`/users/by/username/${username}`, {
            params: {
                'user.fields': 'public_metrics,description,profile_image_url'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Twitter user:', error);
        throw error;
    }
};

export const checkFollowing = async (sourceUserId, targetUsername) => {
    try {
        // First get target user's ID
        const targetUser = await getUserByUsername(targetUsername);
        const targetUserId = targetUser.data.id;

        // Then check following status
        const response = await twitterAxios.get(`/users/${sourceUserId}/following?target_user_id=${targetUserId}`);
        return {
            following: true,
            targetUser: targetUser.data
        };
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return {
                following: false,
                error: 'Not following'
            };
        }
        console.error('Error checking Twitter following status:', error);
        throw error;
    }
};

// import axios from 'axios';

// const API_LOCAL = import.meta.env.VITE_API;
// const TWITTER_API_BASE = 'https://api.twitter.com/2';
// const TWITTER_BEARER_TOKEN = import.meta.env.VITE_TWITTER_BEARER_TOKEN;


// export const click = async (telegramId ,clickComboCount) => {
//     console.log("telegramIdasdasdasdasasdasdsadsadasdsa", telegramId)
//     try {
//       const response = await axios.post(`${API_LOCAL}/api/click`, {telegramId, clickComboCount});
//       return response.data;
//     } catch (error) {
//       console.error('Error clicking:', error);
//       throw error;
//     }
//   };

// export const shopUpgrade = async () => {
//     try {
//         const response = await axios.get(`${API_LOCAL}/api/shop-upgrades`);
//         return response.data;
//     } catch (error) {
//         console.error('Error getting shop upgrades:', error);
//         throw error;
//     }
// }

// export const purchaseUpgrade = async (telegramId, upgradeId, costLevel) => {
//     try {
//         const response = await axios.post(`${API_LOCAL}/api/purchase-upgrade`, {telegramId, upgradeId, costLevel});
//         return response.data;
//     } catch (error) {
//         console.error('Error purchasing upgrade:', error);
//         throw error;
//     }
// }

// export const updatePlayerDataApi = async (playerData) => {
//     console.log("playerData----->", playerData);
//     try {
//         const response = await axios.post(`${API_LOCAL}/api/updatedplayerdata`,{playerData});
//         return response.data;
//     } catch (error) {
//         console.error('Error updating player data:', error);
//         throw error;
//     }
// }

// export const getTasksApi = async () => {
//     try {
//         const response = await axios.get(`${API_LOCAL}/api/gettasks`);
//         return response.data;
//     } catch (error) {
//         console.error('Error getting tasks:', error);
//         throw error;
//     }
// }


// export const streak = async (telegramId) => {
//     try {
//         const response = await axios.post(`${API_LOCAL}/api/streaks`, {telegramId});
//         return response.data;
//     } catch (error) {
//         console.error('Error getting streak:', error);
//         throw error;
//     }
// }

// // Telegram API functions
// export const deleteTelegramMessage = async (chatId, messageId) => {
//     try {
//         const response = await axios.post(
//             `https://api.telegram.org/bot${import.meta.env.VITE_TELEGRAM_BOT_TOKEN}/deleteMessage`,
//             {
//                 chat_id: chatId,
//                 message_id: messageId
//             }
//         );
//         return response.data;
//     } catch (error) {
//         console.error('Error deleting message:', error.response?.data || error.message);
//         throw error;
//     }
// };

// // Twitter API functions
// const twitterAxios = axios.create({
//     baseURL: TWITTER_API_BASE,
//     headers: {
//         'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
//         'Content-Type': 'application/json'
//     }
// });



// export const getUserByUsername = async (username) => {
//     try {
//         const response = await twitterAxios.get(`/users/by/username/${username}`, {
//             params: {
//                 'user.fields': 'public_metrics,description,profile_image_url'
//             }
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching Twitter user:', error);
//         throw error;
//     }
// };


// export const checkFollowing = async (sourceUserId, targetUsername) => {
//     try {
//         // First get target user's ID
//         const targetUser = await getUserByUsername(targetUsername);
//         const targetUserId = targetUser.data.id;

//         // Then check following status
//         const response = await twitterAxios.get(`/users/${sourceUserId}/following?target_user_id=${targetUserId}`);
//         return {
//             following: true,
//             targetUser: targetUser.data
//         };
//     } catch (error) {
//         if (error.response && error.response.status === 404) {
//             return {
//                 following: false,
//                 error: 'Not following'
//             };
//         }
//         console.error('Error checking Twitter following status:', error);
//         throw error;
//     }
// };
