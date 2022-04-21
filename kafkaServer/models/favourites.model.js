const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const Favourites = mongoose.model(
  "Favourites",
  new Schema(
      // Id will be created by mongo, name will be "id"
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
          ref: "Items",
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
      },
    },
    {
      versionKey: false,
    }
  )
);

module.exports = Favourites;
