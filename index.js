const { igdl, ttdl, fbdown, twitter, youtube } = require('btch-downloader')

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


app.get("/", (req, res) => {
  res.send("Download video bot telegram by ThangHM");
});

app.get("/download", async (req, res) => {
  const url = req.query.url
  let data = {
    url: null,
    thumbnail: null,
    type: null,
  };
  if (url.includes("facebook") || url.includes('fb')) {
    const res = await fbdown(url);
    data = {
      ...data,
      type: "fb",
      url: res.HD || res['Normal_video'],
    };
  } else if (url.includes("instagram")) {
    const res = await igdl(url);
    data = {
      ...data,
      type: "ins",
      url: res[0].url,
      thumbnail: res[0].thumbnail,
    };
  } else if (url.includes("youtube")) {
    const res = await youtube(url);
    console.log(res);
    data = {
      ...data,
      type: "ytb",
      url: res.mp4,
    };
  } else if (url.includes("tiktok")) {
    const res = await ttdl(url);
    data = {
      ...data,
      type: "tik",
      url: res.video[0],
      thumbnail: res.thumbnail,
    };
  } else if (url.includes("twitter")) {
    const res = await twitter(url);
    data = {
      ...data,
      type: "twi",
      url: res.url[0].hd || res.url[0].sd,
    };
  }
  res.send(data);
});