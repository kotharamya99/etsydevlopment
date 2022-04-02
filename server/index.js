const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const models = require("./models_mongo");
const session = require("express-session");
const mysql = require("mysql");
const constants = require("./config/config.json");
const initMongoDB = require('./db.mongo/index.js');
// const jwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const cookieParser = express("cocookie-parser");
const multer = require("multer");
const path = require("path");
const kafka = require("./kafka/client");
const _ =require("lodash");
//import routes
// const userRoutes = require("./routes/user");
const { count } = require("console");
// const Items = require("./models_mongo/Items");
async function initdb() {
  global.ModelFactory = await initMongoDB()
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

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

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
initdb()
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

//routers middleware
// app.use("/", userRoutes);
// app.post("/register", (req, res) => {
//   const username = req.body.username;
//   console.log(username);
//   const email = req.body.email;
//   const password = req.body.password;

//   db.query(
//     "INSERT INTO Users (name, email, password) VALUES (?, ?, ?)",
//     [username, email, password],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.send({ success: true, result });
//       }
//     }
//   );
// });

app.post("/register", (req, res) => {
  console.log("In customer reg API");
  let msg = req.body;
  msg.route = "registerUser";
  kafka.make_request("accounts", msg, function (err, results) {
    console.log(err);
    console.log(results);
    if (err) {
      res.status(err.status).send(err);
    } else {
      // if (results.status == 200) {
      //   const token = jwt.sign(
      //     { _id: results.user.user_id, category: "customer" },
      //     secret,
      //     {
      //       expiresIn: 1008000,
      //     }
      //   );
      //   var jwtToken = "JWT " + token;
      //   res.status(results.status).send({
      //     ...results,
      //     Token: jwtToken,
      //   });
      // }
      res.status(results.status).send(results);
    }
  });
})

app.post("/signin", (req, res) => {
  let msg = req.body;
  msg.route = "login";
  kafka.make_request("accounts", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      // if (results.status == 200) {
      //   const token = jwt.sign(
      //     { _id: results.user.user_id, category: req.body.category },
      //     secret,
      //     {
      //       expiresIn: 1008000,
      //     }
      //   );
      //   var jwtToken = "JWT " + token;
      //   res.status(results.status).send({
      //     ...results,
      //     Token: jwtToken,
      //   });
      // } else {
        res.status(results.status).send(results);
      // }
    }
  });
});

app.get("/user", async (req, res) => {
  var userInstance = ModelFactory.getUserInstance()
  let users = await userInstance.find({})
  return res.json(users).status(200)
  console.log("hello" + req.session);
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

//Ramya Did it!
app.post("/findShopDuplicates", (req, res) => {
  console.log("Find Shop Duplicates!");
  let msg = req.body;
  msg.route = "findDuplicateShop";
  kafka.make_request("shop", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

// Ramya did it #2
app.post("/createShop/:id", (req, res) => {
  // console.log("HDHHAD");
  const shopName = req.body.shopName;
  const id = req.params.id;
  console.log("In create shop " + id);
  let msg = req.body;
  msg.route = "createAShop";
  kafka.make_request("shop", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

const addProduct = async (req, res) => {
  const userId = req.params.id;
  const itemImage = req.itemImage;
  const itemName = req.body.itemName;
  const itemDescription = req.body.description;
  const itemPrice = req.body.price;
  const itemCount = req.body.count;

const item = new Items ({
  userId, itemName, itemPrice, itemDescription, itemCount, itemImage

})
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
      var item = { userId, itemName, itemDescription, itemPrice, itemCount, itemCategory }
      var itemsInstance = ModelFactory.getItemInstance();
      var savedItem = await itemsInstance.create(item);
      return res.json(savedItem).status(200)
    });
  } catch{
  (err, result) => {
        if (err) {
          return res.json(err).status(400)
        }
}}}
);
// app.get("/getItemById/:itemId", (req, res) => {
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
  var itemInstance = ModelFactory.getItemInstance()
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
    var query = { itemName : {$regex: term}}
    var  results = await itemInstance.find(query).skip(skip).limit(limit)
    return res.status(200).json({ success: true, results, postSize: results.length });
  } else {
    var  results = await itemInstance.find({userId: id})
    return res.status(200).json({ success: true, results, postSize: results.length });
  }
});

// app.get("/getItemById/:itemId", (req, res) => {
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

app.get("/getItemById/:itemId", (req, res) => {
  const id = req.params.itemId;
  var itemInstance = ModelFactory.getItemInstance()
  var  results = await itemInstance.find({itemId: id})
  return res.status(200).json(results);
});

app.put("/updateItemById/:itemId", (req, res) => {
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
  let itemInstance = ModelFactory.getItemInstance()
  let results = await itemInstance.findOneAndUpdate({itemId}, {$set: {
    itemName, itemDescriprion, itemPrice, itemCount, itemCategory
  }})
  return res.json({success: true, result: results}).statusCode(200)
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

app.put("/updateItemImageById/:itemId", (req, res) => {
  try {
    let upload = multer({ storage: storage }).single("itemImage");
    upload(req, res, function (err) {
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
      var result = await itemInstance.findOneAndUpdate({itemId}, {$set: {itemImage}})
      return res.json({success: true, result})
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

app.get("/getShopById/:userId", (req, res) => {
  console.log("In get shop by id");
  const userId = req.params.userId;
  var userInstance = ModelFactory.getUserInstance()
  var  results = await userInstance.find({id: userId})
  return res.status(200).json({success: true, result: results});

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

app.put("/updateShopImageById/:id", (req, res) => {
  console.log("In edit shop details put method");
  try {
    let upload = multer({ storage: shopStorage }).single("shopImage");
    upload(req, res, function (err) {
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
      var result = await userInstance.findOneAndUpdate({id: userId}, {$set: {shopImage}})
      return res.json({success: true, result})

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

app.get("/getSearchItems/:searchValue", (req, res) => {
  console.log("get Search Items -------------------------------");
  const searchValue = req.params.searchValue;
  console.log(searchValue);

  var query = { itemName : {$regex:searchValue}}
    var  result = await itemInstance.find(query).skip(skip).limit(limit)
    return res.json({success: true, result})

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
    upload(req, res, function (err) {
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

      console.log(userImage);
      console.log(userName);
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
app.get("/getItems", (req, res) => {
  console.log("Getting all products in home");
  var itemInstance = ModelFactory.getItemInstance()
  var  results = await itemInstance.find({})
  return res.status(200).json({success: true,result:results});

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

app.post("/addFavourite", (req, res) => {
  const userId = req.body.userId;
  console.log(userId);
  const itemId = req.body.itemId;

      var item = { userId, itemId }
      var favouriteInstance = ModelFactory.getFavoriteInstance();
      var savedItem = await favouriteInstance.create(item);
      return res.json(savedItem).status(200)

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

app.get("/getFavourites/:id", (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  console.log("Getting all favoutrites in home");
  var favouriteInstance = ModelFactory.getFavoriteInstance(),
  itemInstance = ModelFactory.getItemInstance();

  var favoriteItems = await favouriteInstance.find({userId});
  var itemIds = _.map(favoriteItems, 'itemId')
  var result = await itemInstance.find({itemId : {$in: itemIds}})
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

app.delete("/deleteFavourite/:itemId/:userId", (req, res) => {
  var favouriteInstance = ModelFactory.getFavoriteInstance();
  const itemId = req.params.itemId;
  const userId = req.params.userId;
  console.log("Deleting Fav Item");
  var result = await favouriteInstance.remove({itemId,userId});
  return res.send({ success: true, result});
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

app.post("/addCartProduct/:userId", (req, res) => {
  const userId = req.params.userId;
  const items = req.body.items;
  const orderId = req.body.orderId;
  const price = req.body.price;
      var item = { itemId: items, orderId, price, userId }
      var cartInstance = ModelFactory.getCartInstance();
      var cartItem = await cartInstance.create(item);
      return res.json({ success: true, result: cartItem}).status(200)

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

app.get("/getFinalCartProducts/:userId", (req, res) => {
  const userId = req.params.userId;
  console.log("Getting cart products in cart");

  console.log("Getting all favoutrites in home");
  var cartInstance = ModelFactory.getCartInstance(),
  itemInstance = ModelFactory.getItemInstance();

  var cartItems = await cartInstance.find({userId});
  var itemIds = _.map(cartItems, 'itemId')
  var result = await itemInstance.find({itemId : {$in: itemIds}})
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

app.put("/updateCartQuantity/:userId", (req, res) => {
  const userId = req.params.userId;
  // const userId = req.params.id;
  const itemId = req.body.itemId;
  const qty = req.body.qty;

  console.log("In update cart");
  console.log(itemId);
  console.log(qty);
  // console.log(id);

  var cartInstance = ModelFactory.getCartInstance();
      var result = await cartInstance.findOneAndUpdate({userId,itemId}, {$set: {qty}})
      return res.json({success: true, result})

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

app.get("/getQtyFromCart/:userid/:itemId", (req, res) => {
  const userId = req.params.userid;
  const itemId = req.params.itemId;
  console.log("Getting all cart products in home");
  var cartInstance = ModelFactory.getCartInstance()
  var  results = await cartInstance.find({itemId,userId})
  return res.status(200).json({success: true,result:results});

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
app.get("/getPurchases/:UserId", (req, res) => {
  const userId = req.params.UserId;
  console.log("Get purchased items");
  var purchaseInstance = ModelFactory.getPurchaseInstance()
  var  results = await purchaseInstance.find({userId}).sort({createdOn:1})
  return res.status(200).json({success: true,result:results});
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

app.put("/updateItemById/:itemId", (req, res) => {
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
      var result = await itemInstance.findOneAndUpdate({itemId}, {$set: {itemName,itemPrice,itemDescription,itemCount,itemCategory}})
      return res.json({success: true, result})

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