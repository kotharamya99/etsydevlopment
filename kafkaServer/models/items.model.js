const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const Items = mongoose.model(
  "Items",
  new Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Users"
      },
      itemName: {
        type: String,
        required: true,
        trim: true,
      },
      itemCategory: {
        type: String,
        required: [true, "Please enter the item category"],
      },
      itemPrice: {
        type: Number,
        required: [true, "Please provide item price"],
      },
      itemDescription: {
        type: String,
      },
      itemCount: {
        type: Number,
      },
      itemImage: {
        type: String,
      },
    },
    {
      versionKey: false,
    }
  )
);

module.exports = Items;
