const {
  ndown,
  tikdown,
  ytdown,
  twitterdown,
} = require("nayan-media-downloader");
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
  const urlVideo = req.query.url;
  let data = {
      url: null,
      thumbnail: null,
      type: null,
    },
    response;

  switch (true) {
    case urlVideo.includes("facebook") ||
      urlVideo.includes("fb") ||
      urlVideo.includes("instagram"):
      response = await ndown(urlVideo);
      data.type = "fb";
      break;
    case urlVideo.includes("youtube"):
      response = await ytdown(urlVideo);
      data.type = "ytb";
      break;
    case urlVideo.includes("tiktok"):
      response = await tikdown(urlVideo);
      data.type = "tik";
      break;
    case urlVideo.includes("twitter"):
      response = await twitterdown(urlVideo);
      data.type = "twi";
      break;
    default:
      break;
  }

  data = {
    ...data,
    url:
      response?.data?.[0]?.url ||
      response?.data?.[1]?.url ||
      response?.data?.video ||
      response?.data?.HD ||
      response?.data?.SD ||
      response?.data?.picture,
    thumbnail: response?.data?.[0]?.thumbnail,
  };
  res.send(data);
});
