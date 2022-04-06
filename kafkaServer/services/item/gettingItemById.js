"use strict";
const bcrypt = require("bcrypt");
const Customer = require("../../../models/items.model");

let getItemById = async (msg, callback) => {
  try {
      const {
        userId,
        itemId,
        itemName,
        itemCategory,
        itemPrice,
        itemDescription,
        itemCount,
        itemImage
      }
  }