"use strict";
const bcrypt = require("bcrypt");
const User = require("../../models/users.model");

let createAShop = async (msg, callback) => {
  let model = User;
  console.log(JSON.stringify(msg));
console.log(msg);
  let shopName = msg.shopName;
  let id = msg.id;
  model
    .findOneAndUpdate({ id: id }, 
        {
            $set:
            {
                shopName: shopName,
                id: id
            }
        },function(err, result) {
      if (err) {
          console.log("err");
        return callback(
            {errors: {
            message: "Null",
          },
        },)
      }
      console.log(result);
      if (result) {
        console.log("Updated!");
              return callback(
                null, result
              );
            }  else {
            console.log("Not Updated!");
            }
          }
        );
};

exports.createAShop = createAShop;
