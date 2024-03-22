// Function to send a Telegram message
async function sendTelegramMessage(chatId, message) {
  const telegramApiUrl = `https://api.telegram.org/bot7174716738:AAHjVSRlzJLg6yIQcQcK09gYoxfk1CZm27Q/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
  await fetch(telegramApiUrl);
}

// Cloudflare Workers handler
// addEventListener('fetch', event => {
//   event.respondWith(handleRequest(event.request));
// });

// async function handleRequest(request) {
//   // Your Cloudflare Workers logic here
//   // Example:
//   const payload = await request.json();
//   const chatId = payload.message.chat.id;
//   const message = payload.message.text + " over";
//   await sendTelegramMessage(chatId, message);
//   return new Response("OK");
// }

// Node.js handler (example)
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get(() => {
  res.send("OK");
})
app.post('/', async (req, res) => {
  // Your Node.js logic here
  // Example:
  const payload = req.body;
  const chatId = payload.message.chat.id;
  const message = payload.message.text + " over";
  await sendTelegramMessage(chatId, message);
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
