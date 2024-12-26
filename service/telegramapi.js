import axios from "axios";


export const deleteTelegramMessage = async (chatId, messageId) => {
    try {
        const response = await axios.post(
            `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/deleteMessage`,
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
