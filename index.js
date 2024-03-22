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
  console.log(req.query);
  res.send({
    url: req.query.url
  });
});