"use strict";
const { registerUser } = require("./registerUser");
const { login } = require("./login");

let handle_request = (msg, callback) => {
  console.log("in switch");
  console.log(msg.route);
  switch (msg.route) {
    case "login":
      login(msg, callback);
      break;
    case "registerUser":
      registerUser(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;
