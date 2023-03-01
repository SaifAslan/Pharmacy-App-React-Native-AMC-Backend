const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
require("dotenv").config();

const authentication = require("./routes/authentication");
const api = require("./routes/api");

const { default: mongoose } = require("mongoose");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use(multer({ storage: fileStorage, fileFilter }).single("image"));

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/authentication", authentication);
app.use("/api", api);


app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

const mongodb_URI = `mongodb+srv://saif:${process.env.MONGODB_PASSWORD}@cluster0.6zbtdaz.mongodb.net/pharmacy-app?retryWrites=true&w=majority`;
mongoose.set("strictQuery", true);
mongoose
  .connect(mongodb_URI)
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
