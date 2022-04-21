const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const Cart = mongoose.model(
  "Cart",
  new Schema(
    // Id will be created by mongo, name will be "id"
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
      itemId: {
        type: String,
        required: [true, "Please enter the item id"],
      },
      orderId: {
        type: Number,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
    },
    {
      versionKey: false,
    }
  )
);

module.exports = Cart;
