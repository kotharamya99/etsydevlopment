const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const Users = mongoose.model(
  "Users",
  new Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        validate: [validator.isEmail, "Please provide a valid email"],
      },
      password: {
        type: String,
        required: [true, "Please provide a password"],
      },
      fullAddress: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      phone_number: {
        type: String,
      },
      dob: {
        type: String,
        required: false,
        trim: true,
      },
      gender: {
        type: String,
        required: true,
        trim: true,
      },
      profilePic: {
        type: String,
        trim: true,
      },
      about: {
        type: String,
        trim: true,
      },
      shopName: {
        type: String,
        trim: true,
      },
      shopImage: {
        type: String,
      },
    },
    {
      versionKey: false,
    }
  )
);

module.exports = Users;
