const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = 3003;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://user1:password1@ds243054.mlab.com:43054/heroku_5dg0v4m4"

mongoose.connect(MONGODB_URI)
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
//   useNewUrlParser: true,
//   useFindAndModify:false
// })
// routes
app.use(require("./routes/api.js"));

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${PORT}!`);
});