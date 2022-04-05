"use strict";
const bcrypt = require("bcrypt");
const User = require("../../models/users.model");

let login = async (msg, callback) => {
  let model = User;
  console.log(JSON.stringify(msg));

  let email = msg.email;
  model
    .findOne({ email: email }, (err, result) => {
      if (err) {
        console.log("Error in find user");
      }
      if (result) {
        bcrypt.compare(
          msg.password,
          result.password,
          async function (err, matchFlag) {
            if (err) {
              console.log("Error in password comparison", err);
              return callback(
                {
                  status: 500,
                  errors: {
                    message: "Internal Server Error",
                  },
                },
                null
              );
            } else if (!matchFlag) {
              console.log("Password Incorrect");

              return callback(
                {
                  status: 403,
                  errors: {
                    message: "Incorrect Password",
                  },
                },
                null
              );
            } else {
              console.log("Logged in successfully");
              let result = await model.findOne({
                email: email.toLowerCase(),
              });
              let user_id = result._id;
              
              console.log(result);
              return callback(null, {
                status: 200,
                user: {
                  userId: user_id,
                  id: user_id,
                  name: result.name,
                  email: result.email,
                  fullAddress: result.fullAddress,
                  city: result.city,
                  phone_number: result.phone_number,
                  dob: result.dob,
                  gender: result.gender,
                  profilePic: result.profilePic,
                  about: result.about,
                  shopName: result.shopName,
                  shopImage: result.shopImage
                },
              });
            }
          }
        );
      } else {
        console.log("User not found");
        return callback(
          {
            status: 404,
            errors: {
              message: "User does not exist",
            },
          },
          null
        );
      }
    })
    .catch((err) => {
      console.log("Error caught", err);
      return callback(
        {
          status: 500,
          errors: {
            message: "Internal Server Error",
          },
        },
        null
      );
    });
};

exports.login = login;
