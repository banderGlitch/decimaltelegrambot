import { Telegraf } from "telegraf";
import TelegramBot from "node-telegram-bot-api";


// const bot = new Telegraf("6985905665:AAG3s5jrmX86tP9NCnLtEeyaKX6mGbE-ANw")
const bot_new = new TelegramBot("6985905665:AAG3s5jrmX86tP9NCnLtEeyaKX6mGbE-ANw", { polling: true });


const web_link = "https://main.d2blj32f829es0.amplifyapp.com/"

// bot.start(async(ctx) => {
//     console.log("ctx", ctx)

//     // Store the user information in DB

//     await ctx.reply("Welcome to social bot", {
//         reply_markup: {
//             keyboard: [[{ text: "web app", web_app: { url: web_link } }]],
//           },
//     }); 
// })

bot_new.onText(/\/start/, async(msg) => {

    const chatId = msg.chat.id;
    // const user = msg.from;
    // try {
    //   const user = await getUser(chatId);
    //   console.log(msg.text)
    //   if (!user.exists) {
    //     if(msg.text.includes('fren')){
    //      const referrerId =msg.text.split('=')[1]
    //      createReferralUser(chatId,referrerId)
    //     }
    //   } 
    //   createUser(chatId);
    // } catch (error) {
    //   console.error('Error:', error);
    // }
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Open OctaClick',
             web_app:{
               url: web_link
             }
            }
          ]
        ]
      }
    };
    bot_new.sendMessage(chatId, 'Welcome! Open the mini app using the button below:', opts);
  });


//   bot_new.launch()

// Enable graceful stop
process.once('SIGINT', () => bot_new.stop('SIGINT'))
process.once('SIGTERM', () => bot_new.stop('SIGTERM'))