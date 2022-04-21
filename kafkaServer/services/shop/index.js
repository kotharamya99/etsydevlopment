"use strict";
const { findDuplicateShop } = require("./findDuplicateShop");
const { createAShop } = require("./createAShop");

// const { login } = require("./login");

let handle_request = (msg, callback) => {
  console.log("In Switch");
  console.log(msg.route);
  switch (msg.route) {
    case "findDuplicateShop":
        findDuplicateShop(msg, callback);
        break;
    case "createAShop":
        createAShop(msg, callback);
        break;
    
  }
};

exports.handle_request = handle_request;
