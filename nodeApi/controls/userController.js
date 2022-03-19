const multer = require("multer");
const mysql = require("mysql");
const path = require("path");
const { v1: uuidv1 } = require("uuid");

let date = Date.now();
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

const multerConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/user/");
  },
  filename: (req, file, callback) => {
    const ext = file.mimetype.split("/")[1];
    const name = file.originalname.split(".")[0];
    // let date = Date.now()
    let filename = date + "." + ext;
    // db.query(
    //   "UPDATE users SET image = ? WHERE idnew_table = ?",
    //   [productID],
    //   (err, result) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       // console.log(result);

    // }
    // }
    // );
    callback(null, `${filename}`);
  },
});

const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("Image uploads are allowed"));
  }
};

const upload = multer({
  storage: multerConfig,
  fileFilter: isImage,
});

exports.uploadImage = upload.single("photo");

exports.upload = (req, res) => {
  const email = req.body.email;
  console.log(req.body);
  db.query(
    "UPDATE users SET image = ? WHERE email = ?",
    [date, email],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    }
  );
};

exports.getImage = (req, res) => {
  let email = req.body.email;
  // // console.log(req)
  let filepath = null;
  db.query(
    "SELECT image from users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.log("error");

        console.log(err);
      } else {
        console.log(result);
        if (result[0].image == "") {
          filepath = path.join(
            __dirname,
            "../public/user/",
            "defaultProfile.jpg"
          );
        } else {
          filepath = path.join(
            __dirname,
            "../public/user",
            result[0].image + ".jpeg"
          );
        }
        res.sendFile(filepath);
      }
    }
  );
};

exports.getData = (req, res) => {
  const username = req.body.name;
  console.log(username);
  db.query(
    "SELECT usertype FROM users WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
};
