const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const models = require("./models_mongo");
const session = require("express-session");
const mysql = require("mysql");
const constants = require("./config/config.json");
const initMongoDB = require("./db.mongo/index.js");
// const jwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const cookieParser = express("cocookie-parser");
const multer = require("multer");
const path = require("path");
const kafka = require("./kafka/client");
const _ = require("lodash");
//import routes
// const userRoutes = require("./routes/user");
const { count } = require("console");
// const Items = require("./models_mongo/Items");
async function initdb() {
  global.ModelFactory = await initMongoDB();
}
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser);
app.use(bodyParser.json({ limit: "20mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

app.use(express.json());

app.use(
  session({
    key: "email",
    secret: "cmpe273_kafka_passport_mongo",
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    // duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000,
    cookie: {
      expiresIn: 60 * 60 * 24,
    },
  })
);

// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", process.env.BACKEND_URL);
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET,HEAD,OPTIONS,POST,PUT,DELETE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
//   );
//   res.setHeader("Cache-Control", "no-cache");
//   next();
// });

const db = mysql.createConnection({
  host: constants.development.host,
  user: constants.development.username,
  password: constants.development.password,
  port: constants.development.port,
  database: constants.development.database,
});

// storage

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client/src/Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

//shop storage
const shopStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client/public/Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
initdb();
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client/public/Users/Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: "1000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimType && extname) {
      return cb(null, true);
    }
    cb("Give proper file name");
  },
}).single("itemImage");

//static images folder
app.use("/Images", express.static("./Images"));

// New Implementation
app.post("/secureurl", async (req,res)=> {

    const region = "us-east-1"
    const bucketName = "etsyawsbucket"
    const accessKeyId = "AKIAZP3IZBQZ72KY5MV2"
    const secretAccessKey = "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"
    

    const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
    })

    const rawBytes = await randomBytes(16)
    const imageName = rawBytes.toString('hex')
    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 300
    })
    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    console.log("URL ----"+uploadURL);
    res.send({uploadURL})
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  console.log(username);
  const email = req.body.email;
  const password = req.body.password;

  var newuserobject = { name: username, email, password };
  var userInstance = ModelFactory.getUserInstance();
  var savedItem = await userInstance.create(newuserobject);
  return res.json({ success: true, result: savedItem }).status(200);
});

app.get("/signin", async (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log("In login post req");
  // console.log(email + " " + password + " email body");
  var userInstance = ModelFactory.getUserInstance();
  var result = await userInstance.find({ email, password });
  if (result.length > 0) {
    res.cookie("user", result[0].name, {
      maxAge: 900000,
      httpOnly: false,
      path: "/",
    });
    req.session.user = result;
    res.send(result);
  } else {
    res.send({ message: "Invalid creds" });
  }
});

app.get("/user", async (req, res) => {
  console.log("hello" + req.session);
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/findShopDuplicates", async (req, res) => {
  const shopName = req.body.shopName;
  console.log("In findShopDuplicates " + shopName);
  var userInstance = ModelFactory.getUserInstance();
  var result = await userInstance.find({ shopName });

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
});

app.post("/createShop/:id", async (req, res) => {
  const shopName = req.body.shopName;
  const id = req.params.id;
  console.log("In create shop " + id);
  var shopInstance = ModelFactory.getShopInstance();
  var result = await shopInstance.findOneAndUpdate(
    { id },
    { $set: { shopName } }
  );
  if (err) {
    console.log(err);
  } else {
    console.log(result);
    // res.send(result);
    res.send("Shops Value Inserted in user successfully");
  }
});
// New Implementation

const addProduct = async (req, res) => {
  const userId = req.params.id;
  const itemImage = req.itemImage;
  const itemName = req.body.itemName;
  const itemDescription = req.body.description;
  const itemPrice = req.body.price;
  const itemCount = req.body.count;

  const item = new Items({
    userId,
    itemName,
    itemPrice,
    itemDescription,
    itemCount,
    itemImage,
  });
  await item.save();
  if (err) {
    res.status(err.status).send(err);
  } else {
    res.status(results.status).send(results);
  }

  // db.query(
  //   "INSERT INTO Items (userId, itemName, itemPrice, itemDescription, itemCount, itemImage) VALUES (?, ?, ?, ?, ?, ?)",
  //   [userId, itemName, itemPrice, itemDescriprion, itemCount, itemImage],
  //   (err, result) => {
  //     if (err) {
  //       res.send("error" + err);
  //     } else {
  //       res.send("Product added successfully");
  //     }
  //   }
  // );
};
app.post("/addProduct/:id", async (req, res) => {
  try {
    let upload = multer({ storage: storage }).single("itemImage");
    upload(req, res, async function (err) {
      if (!req.file) {
        return res.send("Please select an image to upload");
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      }
      const userId = req.params.id;
      const itemName = req.body.itemName;
      const itemDescription = req.body.itemDescription;
      const itemPrice = req.body.itemPrice;
      const itemCount = req.body.itemCount;
      const itemImage = req.file.filename;
      const itemCategory = req.body.itemCategory;
      console.log(itemImage);
      console.log(itemName);
      var item = {
        userId,
        itemName,
        itemDescription,
        itemPrice,
        itemCount,
        itemCategory,
      };
      var itemsInstance = ModelFactory.getItemInstance();
      var savedItem = await itemsInstance.create(item);
      return res.json(savedItem).status(200);
    });
  } catch {
    (err, result) => {
      if (err) {
        return res.json(err).status(400);
      }
    };
  }
});
// app.get("/getItemById/:itemId", async (req, res) => {
//   const id = req.params.itemId;
//   db.query("SELECT * FROM Items WHERE itemId=?", id, (err, result) => {
//     console.log(result);
//     if (err) {
//       res.send(err);
//     } else {
//       res.send(result);
//     }
//   });
// });

app.post("/getAllProducts/:id", async (req, res) => {
  var itemInstance = ModelFactory.getItemInstance();
  const id = req.params.id;
  const limit = req.body.limit ? parseInt(req.body.limit) : 100;
  const skip = parseInt(req.body.skip);
  const term = req.body.searchTerm;
  // console.log(req.body.skip + "skip");
  // console.log(req.body.limit + "limit");
  console.log("In get all prods");
  console.log(term);

  if (term) {
    console.log("In term");
    var query = { itemName: { $regex: term } };
    var results = await itemInstance.find(query).skip(skip).limit(limit);
    return res
      .status(200)
      .json({ success: true, results, postSize: results.length });
  } else {
    var results = await itemInstance.find({ userId: id });
    return res
      .status(200)
      .json({ success: true, results, postSize: results.length });
  }
});

// app.get("/getItemById/:itemId", async (req, res) => {
//   const id = req.params.itemId;
//   db.query("SELECT * FROM Items WHERE itemId=?", id, (err, result) => {
//     console.log(result);
//     if (err) {
//       res.send(err);
//     } else {
//       res.send(result);
//     }
//   });
// });

app.get("/getItemById/:itemId", async (req, res) => {
  const id = req.params.itemId;
  var itemInstance = ModelFactory.getItemInstance();
  var results = await itemInstance.find({ itemId: id });
  return res.status(200).json(results);
});

app.put("/updateItemById/:itemId", async (req, res) => {
  const id = req.params.itemId;
  // const userId = req.params.id;
  const itemName = req.body.itemName;
  const itemDescriprion = req.body.itemDescription;
  const itemPrice = req.body.itemPrice;
  const itemCount = req.body.itemCount;
  const itemCategory = req.body.itemCategory;

  console.log("In update item post");
  console.log(itemDescriprion);
  console.log(itemName);
  console.log(id);
  let itemInstance = ModelFactory.getItemInstance();
  let results = await itemInstance.findOneAndUpdate(
    { itemId },
    {
      $set: {
        itemName,
        itemDescriprion,
        itemPrice,
        itemCount,
        itemCategory,
      },
    }
  );
  return res.json({ success: true, result: results }).statusCode(200);
  // db.query(
  //   "UPDATE Items SET itemName=?, itemPrice=?, itemDescription=?, itemCount=?, itemCategory=? WHERE itemId=?",
  //   [itemName, itemPrice, itemDescriprion, itemCount, itemCategory, id],
  //   (err, result) => {
  //     console.log(result.itemName);
  //     if (err) {
  //       console.log(err);
  //       res.send(err);
  //     } else {
  //       res.send({ success: true, result });
  //     }
  //   }
  // );
});

app.put("/updateItemImageById/:itemId", async (req, res) => {
  try {
    let upload = multer({ storage: storage }).single("itemImage");
    upload(req, res, async function (err) {
      if (!req.file) {
        return res.send("Please select an image to upload");
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      }

      const id = req.params.itemId;
      const itemImage = req.file.filename;
      console.log("In update item post");
      console.log(id);
      console.log(itemImage);
      var itemInstance = ModelFactory.getItemInstance();
      var result = await itemInstance.findOneAndUpdate(
        { itemId },
        { $set: { itemImage } }
      );
      return res.json({ success: true, result });
      // db.query(
      //   "UPDATE Items SET itemImage=? WHERE itemId=?",
      //   [itemImage, id],
      //   (err, result) => {
      //     console.log(result);
      //     if (err) {
      //       console.log(err);
      //       res.send(err);
      //     } else {
      //       res.send({ success: true, result });
      //     }
      //   }
      // );
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/getShopById/:userId", async (req, res) => {
  console.log("In get shop by id");
  const userId = req.params.userId;
  var userInstance = ModelFactory.getUserInstance();
  var results = await userInstance.find({ id: userId });
  return res.status(200).json({ success: true, result: results });

  // db.query("SELECT * FROM Users WHERE id=?", userId, (err, result) => {
  //   if (err) {
  //     res.send(err);
  //     console.log(err);
  //   } else {
  //     console.log(result);
  //     res.send({ success: true, result: result });
  //   }
  // });
});

app.put("/updateShopImageById/:id", async (req, res) => {
  console.log("In edit shop details put method");
  try {
    let upload = multer({ storage: shopStorage }).single("shopImage");
    upload(req, res, async function (err) {
      if (!req.file) {
        return res.send("Please select an image to upload");
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      }

      const userId = req.params.id;
      const shopImage = req.file.filename;

      console.log("In update shop post ----------------------");
      console.log(shopImage);

      var userInstance = ModelFactory.getUserInstance();
      var result = await userInstance.findOneAndUpdate(
        { id: userId },
        { $set: { shopImage } }
      );
      return res.json({ success: true, result });

      // db.query(
      //   "UPDATE Users SET shopImage=? WHERE id=?",
      //   [shopImage, userId],
      //   (err, result) => {
      //     if (err) {
      //       console.log(err + "err");
      //       res.send(err);
      //     } else {
      //       res.send({ success: true, result });
      //     }
      //   }
      // );
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/getSearchItems/:searchValue", async (req, res) => {
  console.log("get Search Items -------------------------------");
  const searchValue = req.params.searchValue;
  console.log(searchValue);
  var itemInstance = ModelFactory.getItemInstance();
  var query = { itemName: { $regex: searchValue } };
  var result = await itemInstance.find(query).skip(skip).limit(limit);
  return res.json({ success: true, result });

  // db.query(
  //   `SELECT * FROM Items WHERE itemName REGEXP '${searchValue}'`,
  //   (err, result) => {
  //     console.log(result);
  //     if (err) {
  //       res.send(err);
  //     } else {
  //       res.send({ success: true, result });
  //     }
  //   }
  // );
});

app.put("/updateUser/:id", async (req, res) => {
  try {
    let upload = multer({ storage: userStorage }).single("userImage");
    upload(req, res, async function (err) {
      if (!req.file) {
        return res.send("Please select an image to upload");
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      }
      const userId = req.params.id;
      const userName = req.body.userName;
      const gender = req.body.gender;
      const city = req.body.city;
      const dob = req.body.dob;
      const userImage = req.file.filename;
      const about = req.body.about;

      let body = req.body;
      console.log(userImage);
      console.log(userName);

      let userInstance = ModelFactory.getUserInstance();
      let userObj = {
        name: userName,
        profilePic: userImage,
        dob: dob,
        gender: gender,
        // fullAddress: address,
        city: city,
        about: about,
        phone_number: phoneNo,
      };
      let result = await userInstance.findOneAndUpdate(
        { id: userId },
        { $set: userObj }
      );
      return res.send({ message: "success", result });

      // db.query(
      //   "UPDATE Users set name = ?, city  = ?, dob  = ?, gender  = ?, about  = ?, profilePic=? where id = ? ",
      //   [userName, city, dob, gender, about, userImage, userId],
      //   (err, result) => {
      //     console.log(result);
      //     if (err) {
      //       console.log(err);
      //       res.send({ message: "error" });
      //     } else {
      //       res.send({ message: "success", result });
      //     }
      //   }
      // );
    });
  } catch (err) {
    console.log(err);
  }
});
app.get("/getItems", async (req, res) => {
  console.log("Getting all products in home");
  var itemInstance = ModelFactory.getItemInstance();
  var results = await itemInstance.find({});
  return res.status(200).json({ success: true, result: results });

  // db.query("SELECT * FROM Items", (err, result) => {
  //   console.log(result);
  //   if (err) {
  //     console.log(err);
  //     res.send(err);
  //   } else {
  //     res.send({ success: true, result });
  //   }
  // });
});

app.post("/addFavourite", async (req, res) => {
  const userId = req.body.userId;
  console.log(userId);
  const itemId = req.body.itemId;

  var item = { userId, itemId };
  var favouriteInstance = ModelFactory.getFavoriteInstance();
  var savedItem = await favouriteInstance.create(item);
  return res.json(savedItem).status(200);

  // db.query(
  //   "INSERT INTO Favourites (itemId, userId) VALUES (?, ?)",
  //   [itemId, userId],
  //   (err, result) => {
  //     console.log(result);
  //     if (err) {
  //       console.log(err);
  //       res.send(err);
  //     } else {
  //       res.send({ success: true, result });
  //     }
  //   }
  // );
});

app.get("/getFavourites/:id", async (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  console.log("Getting all favoutrites in home");
  var favouriteInstance = ModelFactory.getFavoriteInstance(),
    itemInstance = ModelFactory.getItemInstance();

  var favoriteItems = await favouriteInstance.find({ userId });
  var itemIds = _.map(favoriteItems, "itemId");
  var result = await itemInstance.find({ itemId: { $in: itemIds } });
  res.send({ success: true, result });
  return;
  //db.query(
  //   "SELECT * FROM Items WHERE itemId IN (SELECT itemId FROM Favourites WHERE userId=?)",
  //   [userId],
  //   (err, result) => {
  //     console.log(result);
  //     if (err) {
  //       console.log(err);
  //       res.send(err);
  //     } else {
  //       res.send({ success: true, result });
  //     }
  //   }
  // );
});

app.delete("/deleteFavourite/:itemId/:userId", async (req, res) => {
  var favouriteInstance = ModelFactory.getFavoriteInstance();
  const itemId = req.params.itemId;
  const userId = req.params.userId;
  console.log("Deleting Fav Item");
  var result = await favouriteInstance.remove({ itemId, userId });
  return res.send({ success: true, result });
  // db.query(
  //   "delete FROM Favourites WHERE itemId =? and userId =? ",
  //   [itemId, userId],
  //   (err, result) => {
  //     console.log(result);
  //     if (err) {
  //       console.log(err);
  //       res.send(err);
  //     } else {
  //       res.send({ success: true, result });
  //     }
  //   }
  // );
});

app.post("/addCartProduct/:userId", async (req, res) => {
  const userId = req.params.userId;
  const items = req.body.items;
  const orderId = req.body.orderId;
  const price = req.body.price;
  var item = { itemId: items, orderId, price, userId };
  var cartInstance = ModelFactory.getCartInstance();
  var cartItem = await cartInstance.create(item);
  return res.json({ success: true, result: cartItem }).status(200);

  // db.query(
  //   "INSERT INTO Carts (items, orderId, price, userId) VALUES (?, ?, ?, ?)",
  //   [items, orderId, price, userId],
  //   (err, result) => {
  //     console.log(result);
  //     if (err) {
  //       console.log(err);
  //       res.send(err);
  //     } else {
  //       res.send({ success: true, result });
  //     }
  //   }
  // );
});

app.get("/getFinalCartProducts/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log("Getting cart products in cart");

  console.log("Getting all favoutrites in home");
  var cartInstance = ModelFactory.getCartInstance(),
    itemInstance = ModelFactory.getItemInstance();

  var cartItems = await cartInstance.find({ userId });
  var itemIds = _.map(cartItems, "itemId");
  var result = await itemInstance.find({ itemId: { $in: itemIds } });
  res.send({ success: true, result });
  return;
  // db.query(
  //   "SELECT * FROM Items WHERE itemId IN (SELECT itemId FROM Carts WHERE userId=?)",

  //   [userId],
  //   (err, result) => {
  //     console.log(result);
  //     if (err) {
  //       console.log(err);
  //       res.send(err);
  //     } else {
  //       res.send({ success: true, result });
  //     }
  //   }
  // );
});

app.put("/updateCartQuantity/:userId", async (req, res) => {
  const userId = req.params.userId;
  // const userId = req.params.id;
  const itemId = req.body.itemId;
  const qty = req.body.qty;

  console.log("In update cart");
  console.log(itemId);
  console.log(qty);
  // console.log(id);

  var cartInstance = ModelFactory.getCartInstance();
  var result = await cartInstance.findOneAndUpdate(
    { userId, itemId },
    { $set: { qty } }
  );
  return res.json({ success: true, result });

  // db.query(
  //   "UPDATE Carts SET qty = ? WHERE itemId=? AND userId = ?",
  //   [qty, itemId, userId],
  //   (err, result) => {
  //     console.log(result);
  //     if (err) {
  //       console.log(err);
  //       res.send(err);
  //     } else {
  //       res.send({ success: true, result });
  //     }
  //   }
  // );
});

app.get("/getQtyFromCart/:userid/:itemId", async (req, res) => {
  const userId = req.params.userid;
  const itemId = req.params.itemId;
  console.log("Getting all cart products in home");
  var cartInstance = ModelFactory.getCartInstance();
  var results = await cartInstance.find({ itemId, userId });
  return res.status(200).json({ success: true, result: results });

  // db.query(
  //   "select qty from Carts where userId=? AND itemId=?",
  //   [userId, itemId],
  //   (err, result) => {
  //     console.log(result);
  //     if (err) {
  //       console.log(err);
  //       res.send(err);
  //     } else {
  //       res.send({ success: true, result });
  //     }
  //   }
  // );
});
app.get("/getPurchases/:UserId", async (req, res) => {
  const userId = req.params.UserId;
  console.log("Get purchased items");
  var purchaseInstance = ModelFactory.getPurchaseInstance();
  var results = await purchaseInstance.find({ userId }).sort({ createdOn: 1 });
  return res.status(200).json({ success: true, result: results });
  // db.query(
  //   "SELECT * FROM Carts WHERE userId=? order by cartId desc limit 0, 1 ",
  //   [userid],
  //   (err, result) => {
  //     console.log(result);
  //     if (err) {
  //       res.send(err);
  //     } else {
  //       res.send({ success: true, result });
  //     }
  //   }
  // );
});

app.put("/updateItemById/:itemId", async (req, res) => {
  const id = req.params.itemId;
  // const userId = req.params.id;
  const itemName = req.body.itemName;
  const itemDescriprion = req.body.itemDescription;
  const itemPrice = req.body.itemPrice;
  const itemCount = req.body.itemCount;
  const itemCategory = req.body.itemCategory;

  console.log("In update item post");
  console.log(itemDescriprion);
  console.log(itemName);
  console.log(id);

  var itemInstance = ModelFactory.getItemInstance();
  var result = await itemInstance.findOneAndUpdate(
    { itemId },
    { $set: { itemName, itemPrice, itemDescription, itemCount, itemCategory } }
  );
  return res.json({ success: true, result });

  // db.query(
  //   "UPDATE Items SET itemName=?, itemPrice=?, itemDescription=?, itemCount=?, itemCategory=? WHERE itemId=?",
  //   [itemName, itemPrice, itemDescriprion, itemCount, itemCategory, id],
  //   (err, result) => {
  //     console.log(result.itemName);
  //     if (err) {
  //       console.log(err);
  //       res.send(err);
  //     } else {
  //       res.send({ success: true, result });
  //     }
  //   }
  // );
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Serving running on port 4000");
});
// models.sequelize.sync().then(() => {
//   app.listen(PORT, () => {
//     console.log("Serving running on port 4000");
//   });
// });
