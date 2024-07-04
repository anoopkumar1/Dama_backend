/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 * 
 
 * 
 * Written By  : anoop kumar <anoop.zeroit@gmail.com>, June 2024
 * Description :
 * Modified By :
 */

const jwt = require("jsonwebtoken");

module.exports.authenticate = function (req, res, next) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  } else {
    token = req.body.token || req.query.token || req.headers["x-access-token"];
  }
  let obj = {
    status: false,
    code: "CCS-E1000",
    message: "Access denied. No token provided.",
    payload: {},
  };
  if (!token) return res.status(200).send(obj);

  try {
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};

/**
 *
 */

module.exports.allowHeaders = function (req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  // Set custom headers for CORS
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Access-Token,X-Key,Authorization"
  );
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
};
