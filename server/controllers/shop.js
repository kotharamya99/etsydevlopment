const { json } = require("body-parser");
const mysql = require("mysql");
const constants = require("../config/config.json");
const Users = require("../models");
const session = require("express-session");

const db = mysql.createConnection({
  host: constants.development.host,
  user: constants.development.username,
  password: constants.development.password,
  port: constants.development.port,
  database: constants.development.database,
});

exports.shopDuplicates = (req, res) => {
    const shopName = req.body.shopName;
    console.log("In findShopDuplicates " + shopName);
    db.query(
      "SELECT * FROM Users WHERE shopName=?",
      [shopName],
      (err, result) => {
        console.log(result.length);
        if (result.length !== 0) {
          res.send({
            message: "duplicate",
          });
          console.log("In shops db shop name found");
        } else {
          res.send({
            message: "No duplicates",
          });
          console.log("In shops db and no shop name found");
        }
      }
    );
  };