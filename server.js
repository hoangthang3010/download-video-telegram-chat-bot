const axios = require('axios');
const TelegramBot = require("node-telegram-bot-api");
const token = "7175534794:AAFk3QAafEENbT758I183IziKz6WNMTV3F4";
const express = require("express");
const webhookUrl = 'download-video-telegram-chat-bot.vercel.app';
const setWebhookUrl = `https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}/webhook`;


const app = express();
app.get("/", (req, res) => {
  res.send('Download video bot telegram by ThangHM');
});
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

axios.post(setWebhookUrl)
  .then(response => {
    console.log('Webhook set successfully:', response.data);
  })
  .catch(error => {
    console.error('Error setting webhook:', error);
  });

const downloading = (msg) => {
  bot.deleteMessage(msg.chat.id, msg.message_id);
  bot.sendMessage(msg.chat.id, 'Đang tải...').then((sentMessage) => {
    setTimeout(() => {
        bot.deleteMessage(msg.chat.id, sentMessage.message_id);
    }, 2000);
  });
}

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const {
    ndown,
    tikdown,
    ytdown,
    twitterdown,
  } = require("nayan-media-downloader");
  let data = {
    url: null,
    thumbnail: null,
    type: null,
  };
  if (msg.text.includes("facebook") || msg.text.includes("instagram")) {
    downloading(msg)
    const res = await ndown(msg.text);
    data = {
      ...data,
      type: "fb",
      url: res.data[0].url || data.data[1].url,
      thumbnail: res.data[0].thumbnail,
    };
  } else if (msg.text.includes("youtube")) {
    downloading(msg)
    const res = await ytdown(msg.text);
    data = {
      ...data,
      type: "ytb",
      url: res.data.video,
      thumbnail: res.data.picture,
    };
  } else if (msg.text.includes("tiktok")) {
    downloading(msg)
    const res = await tikdown(msg.text);
    data = {
      ...data,
      type: "tik",
      url: res.data.video,
    };
  } else if (msg.text.includes("twitter")) {
    downloading(msg)
    const res = await twitterdown(msg.text);
    data = {
      ...data,
      type: "twi",
      url: res.data.HD || res.data.SD,
    };
  }
  if (data.url) {
    const markdownText = `[${"👉ẤN ĐỂ TẢI👈🏻"}](${
      data.url
    })\nVideo gốc 👇👇\n${msg.text}\n${
      data.type !== "fb" ? "\n[![Image](" + data.thumbnail + ")]" : ""
    }`;
    bot.sendMessage(chatId, markdownText, { parse_mode: "Markdown" });
  } else bot.deleteMessage(chatId, `Video gốc 👇👇\n ${msg.text}`);
});

const PORT = 3002;

const server = app.listen(PORT, () => {
  console.log(`Server started on port localhost:${PORT}`);
});

// Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg, match) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message

//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });
