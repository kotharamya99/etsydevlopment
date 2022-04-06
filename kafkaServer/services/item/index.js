"use strict";
const { findDuplicateShop } = require("./getItemById/:itemId");

// const { login } = require("./login");

let handle_request = (msg, callback) => {
  console.log("In Switch");
  console.log(msg.route);
  switch (msg.route) {
    case "gettingItemById":
        findDuplicateShop(msg, callback);
        break;
    
  }
};

exports.handle_request = handle_request;
