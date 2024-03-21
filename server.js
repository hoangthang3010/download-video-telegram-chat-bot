const TelegramBot = require("node-telegram-bot-api");
const token = "7174716738:AAHjVSRlzJLg6yIQcQcK09gYoxfk1CZm27Q";
const express = require("express");
const fs = require("fs");

const app = express();
app.get("/", (req, res) => {
  res.send("Download video bot telegram by ThangHM");
});
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

let idMsgIsDownload
const downloading = (msg) => {
  bot.deleteMessage(msg.chat.id, msg.message_id);
  bot.sendMessage(msg.chat.id, "Đang tải...").then((sentMessage) => {
    idMsgIsDownload = sentMessage.message_id
  });
};

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
  console.log(msg.text);
  if (msg.text.includes("facebook") || msg.text.includes("instagram")) {
    downloading(msg);
    const res = await ndown(msg.text);
    data = {
      ...data,
      type: "fb",
      url: res.data[0].url || data.data[1].url,
      thumbnail: res.data[0].thumbnail,
    };
  } else if (msg.text.includes("youtube")) {
    downloading(msg);
    const res = await ytdown(msg.text);
    data = {
      ...data,
      type: "ytb",
      url: res.data.video,
      thumbnail: res.data.picture,
    };
  } else if (msg.text.includes("tiktok")) {
    downloading(msg);
    const res = await tikdown(msg.text);
    console.log(res);
    data = {
      ...data,
      type: "tik",
      url: res.data.video,
    };
  } else if (msg.text.includes("twitter")) {
    downloading(msg);
    const res = await twitterdown(msg.text);
    data = {
      ...data,
      type: "twi",
      url: res.data.HD || res.data.SD,
    };
  } else {
    return bot.sendMessage(chatId, "URL " + msg.text + " không được hỗ trợ ");
  }
  if (data.url) {
    bot.deleteMessage(msg.chat.id, idMsgIsDownload);
    bot.sendPhoto(chatId, data.thumbnail, {
      caption: 'Origin URL:\n' + msg.text,
      reply_markup: {
        inline_keyboard: [[{ text: "Download URL", url: data.url }]],
      },
    });
    // const opts = {
    //   reply_markup: {
    //     inline_keyboard: [
    //       [{ text: "Download URL", url: data.url }],
    //       [{ text: "Origin URL", url: msg.text }],
    //     ],
    //   },
    // };
    // bot.sendMessage(chatId, "", {
    //   reply_markup: {
    //     inline_keyboard: [
    //       [{ text: "Download URL", url: data.url }],
    //       [{ text: "Origin URL", url: msg.text }],
    //     ],
    //   },
    // });
    // bot.sendMessage(chatId, video, { parse_mode: "Markdown" });
  }
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
