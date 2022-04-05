"use strict";
const bcrypt = require("bcrypt");
const User = require("../../models/users.model");

let registerUser = async (msg, callback) => {
  console.log("## msg", msg);
  try {
    const {
      name,
      email,
      password,
      fullAddress,
      city,
      phone_number,
      dob,
      gender,
      profilePic,
      about,
      shopName,
      shopImage
    } = msg;

    const pass = password //await bcrypt.hash(password, 10);

    User.findOne({ email: email }, (err, result) => {
      if (err) {
        console.log("error in findOne");
      }
      if (result) {
        callback(
          {
            status: 403,
            errors: {
              message: "Email address already registered.",
            },
          },
          null
        );
      } else {
        const newUser = new User({
          name: name,
          email: email,
          password: pass,
          fullAddress: fullAddress,
          city: city,
          phone_number: phone_number,
          dob: dob,
          gender: gender,
          profilePic: profilePic,
          about: about,
          shopName: shopName,
          shopImage: shopImage
        });

        newUser.save((err, result) => {
          if (err) {
            console.log("Cannot create user", err);
            callback(
              {
                status: 500,
                errors: {
                  message: "Internal Server Error",
                },
              },
              null
            );
          } else {
            console.log("User Created");
            callback(null, {
              success: true
            });
          }
        });
      }
    });
  } catch (err) {
    return callback(
      {
        status: 500,
        errors: {
          message: "Internal Server Error",
        },
      },
      null
    );
  }
};

exports.registerUser = registerUser;
