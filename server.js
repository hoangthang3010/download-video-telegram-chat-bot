const TelegramBot = require("node-telegram-bot-api");
const {
  ndown,
  tikdown,
  ytdown,
  twitterdown,
} = require("nayan-media-downloader");
const express = require("express");

const app = express();
app.get("/", (req, res) => {
  console.log(req.params);
  res.send("Download video bot telegram by ThangHM");
});

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.TOKEN_TELEGRAM, { polling: true });

let idMsgIsDownload;
const downloading = (msg) => {
  bot.deleteMessage(msg.chat.id, msg.message_id);
  bot
    .sendMessage(msg.chat.id, "Đang kiểm tra URL và gửi video...")
    .then((sentMessage) => {
      idMsgIsDownload = sentMessage.message_id;
    });
};

const handleDownload = async (msg, isDownload) => {
  const chatId = msg.chat.id;
  const urlVideo = isDownload
    ? msg.text
    : msg.text.slice(msg.text.lastIndexOf("https"), msg.text.length);

  let data = {
      url: null,
      thumbnail: null,
      type: null,
    },
    res;

  switch (true) {
    case urlVideo.includes("facebook") || urlVideo.includes("instagram"):
      downloading(msg);
      res = await ndown(urlVideo);
      data.type = "fb";
      break;
    case urlVideo.includes("youtube"):
      downloading(msg);
      res = await ytdown(urlVideo);
      data.type = "ytb";
      break;
    case urlVideo.includes("tiktok"):
      downloading(msg);
      res = await tikdown(urlVideo);
      data.type = "tik";
      break;
    case urlVideo.includes("twitter"):
      downloading(msg);
      res = await twitterdown(urlVideo);
      data.type = "twi";
      break;
    default:
      bot.deleteMessage(msg.chat.id, msg.message_id);
      return bot.sendMessage(
        chatId,
        "URL của bạn " + urlVideo + " không được hỗ trợ "
      );
  }

  data = {
    ...data,
    url:
      res?.data?.[0]?.url ||
      res?.data?.[1]?.url ||
      res?.data?.video ||
      res?.data?.HD ||
      res?.data?.SD ||
      res?.data?.picture,
    thumbnail: res?.data?.[0]?.thumbnail,
  };

  idMsgIsDownload && bot.deleteMessage(msg.chat.id, idMsgIsDownload);
  if (data.url) {
    const reply_markup = {
      inline_keyboard: [
        [{ text: "Download URL", url: data.url }],
        [{ text: "Ấn để ủng hộ tác giả", url: "https://shope.ee/4Kw55CMmeL" }],
      ],
    };
    const contentSend = {
      caption: "Origin URL:\n" + urlVideo,
      reply_markup,
    };

    bot
      .sendVideo(chatId, data.url, { ...contentSend })
      .then((sent) => {
        console.log("Video sent:", sent);
      })
      .catch((error) => {
        bot.sendPhoto(chatId, data.thumbnail, { ...contentSend });
      });
  } else {
    const markdownText = `Lỗi hệ thống => Ấn "Tải lại ngay" để tải lại\nOrigin URL: ${urlVideo}`;

    bot.sendMessage(chatId, markdownText, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Tải lại ngay",
              callback_data: "redownload",
            },
          ],
        ],
      },
    });
  }
};

bot.on("message", async (msg) => {
  handleDownload(msg, true);
});

// Xử lý callback query
bot.on("callback_query", async (callbackQuery) => {
  const data = callbackQuery.data;
  if (data === "redownload") {
    await handleDownload(callbackQuery.message, false);
  }
});

const PORT = 3002;

const server = app.listen(PORT, () => {
  console.log(`Server started on port localhost:${PORT}`);
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
