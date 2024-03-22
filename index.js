const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);


const PORT = 3002;

const server = app.listen(PORT, () => {
  console.log(`Server started on port localhost:${PORT}`);
});


app.get("/", async (req, res) => {
  const url = req.query.url
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
  if (url.includes("facebook") || url.includes("instagram")) {
    // downloading(msg);
    const res = await ndown(url);
    data = {
      ...data,
      type: "fb",
      url: res.data[0].url || data.data[1].url,
      thumbnail: res.data[0].thumbnail,
    };
  } else if (url.includes("youtube")) {
    // downloading(msg);
    const res = await ytdown(url);
    data = {
      ...data,
      type: "ytb",
      url: res.data.video,
      thumbnail: res.data.picture,
    };
  } else if (url.includes("tiktok")) {
    // downloading(msg);
    const res = await tikdown(url);
    console.log(res);
    data = {
      ...data,
      type: "tik",
      url: res.data.video,
    };
  } else if (url.includes("twitter")) {
    // downloading(msg);
    const res = await twitterdown(url);
    data = {
      ...data,
      type: "twi",
      url: res.data.HD || res.data.SD,
    };
  }
  res.send(data);
});