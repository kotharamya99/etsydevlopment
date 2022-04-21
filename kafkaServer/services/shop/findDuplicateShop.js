"use strict";
const bcrypt = require("bcrypt");
const User = require("../../models/users.model");

let findDuplicateShop = async (msg, callback) => {
  let model = User;
  console.log(JSON.stringify(msg));
console.log(msg);
  let shopName = msg.shopName;
  model
    .findOne({ shopName: shopName }, (err, result) => {
      if (err) {
        return callback(
            {errors: {
            message: "Null",
          },
        },)
      }
      console.log(result);
      if (result) {
        console.log("In shops db shop name found");
              return callback(
                {
                status: 200,
                  errors: {
                    message: "duplicate",
                  },
                },
                null
              );
            }  else {
            console.log("In shops db and no shop name found");
              
              return callback(null, {
                status: 200,
                errors: {
                    message: "No duplicates",
                },
              });
            }
          }
        );
};

exports.findDuplicateShop = findDuplicateShop;
