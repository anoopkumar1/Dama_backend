/**
 * Written By  :
 * Description :
 * Modified By :
 */

const express = require("express");
const cors = require("cors"),
  http = require("http"),
  https = require("https"),
  path = require("path"),
  fs = require("fs"),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  helmet = require("helmet"),
  jwt = require("jsonwebtoken");
const app = express();
const cron = require("node-cron");
const cronObj = require("./app/application/controller/cron");
const socketObj = require("./connect/common");
app.use(cors());
app.set("port", process.env.PORT || 3000);
global.app = app;
global.jwt = jwt;
global.basePath = __dirname;

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());
app.use(helmet.hidePoweredBy());

app.use(express.static(__dirname + ""));
app.set("views", [
  path.join(__dirname, "admin/application/views"),
  path.join(__dirname, "website/application/views"),
]);
app.set("view engine", "ejs");
require("./website")();
require("./app")();
require("./admin")();

let server = http.createServer(app);
const socketio = require("socket.io")(server, {
  pingInterval: 1000, // how often to ping/pong.
  pingTimeout: 2000, // time after which the connection is considered timed-out.
});

const io = socketio.listen(app.listen(app.get("port")));
global.io = io;

const job = cron.schedule("0 10,17 * * *", () => {
  cronObj.sendDailyNotification();
});
socketObj.init(io);
job.start();
