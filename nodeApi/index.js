const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const constants = require("./config.json");
const mysql = require("mysql");
const profileAPI = require("./routes/profile");
const userAPI = require("./routes/userImageUpload")
const productAPI = require("./routes/productImageUpload")
const shopAPI = require("./routes/shopImageUpload")
const purchaseAPI = require("./routes/purchasesRoute")
const app = express();
const bcrypt = require('bcrypt');


require('dotenv').config()

app.use(bodyParser.json({ limit: "20mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

app.use(express.json());
app.use(cors());

app.use("/profile", profileAPI);
app.use('/user', userAPI)
app.use('/product', productAPI)
app.use('/shop', shopAPI)
app.use('/purchases', purchaseAPI)

const saltRounds = 10;


// db connection
// var connection = mysql.createPool({
//   host: constants.DB.host,
//   user: constants.DB.username,
//   password: constants.DB.password,
//   port: constants.DB.port,
//   database: constants.DB.database,
// });

// var db = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'rootuser',
//   database : 'test_schema'
// });


const db = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

app.post("/create", (req, res) => {
  const name = req.body.name;
  // console.log(req.name);

  const age = req.body.age;
  const country = req.body.country;
  const position = req.body.position;
  const wage = req.body.wage;

  db.query(
    "INSERT INTO employees (name, age, country, position, wage) VALUES (?, ?, ?, ?, ?)",
    [name, age, country, position, wage],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let passwordHash = ""
  db.query(
    'SELECT password FROM users WHERE email = ? ',
    [email],
    async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(result.password);
        passwordHash = result[0].password
        console.log(password);
        console.log(passwordHash);
        // console.log(passwordHash);
        // console.log(passwordHash);
        let verified = await bcrypt.compare(password, passwordHash)
        if(verified){
        res.send({"username": username});
          
        }
        else{
        res.send({"error": "Wrong username/password combination"});

        }
      }
    }
  ); 
});

app.post("/individualshop", (req, res) => {
  const shopname = req.body.shopname;
  
  console.log()
   db.query(
    "select shopname,shopimage from users",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        //res.send("Values Inserted");
        res.send(result);
      }
    }
  ); 
});

app.get("/employees", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/shoppinghome", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/test", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/shopitems", (req, res) => {
  var email = req.body.email
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


app.post('/signup', async (req, res) =>{
  
  let username = req.body.username
  let email = req.body.email
  let password = req.body.password
  let usertype = req.body.usertype
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt)
  console.log(usertype,email,password)
//on=checked
   if(usertype=="owner")
  {
  console.log(usertype)

      db.query(
          'INSERT INTO users (username, email, password, usertype) VALUES (?,?,?,?)',[ username,email,password,"owner"],  (err, result) => {
      if(err)
          {
            res.send("error");  

          }
      // console.log(result)
      res.send("Saved");  
  }) 
} 

   else{
    db.query(
      'INSERT INTO users (username, email, password, usertype) VALUES (?,?,?,?)',[ username,email,password,"user"],  (err, result) => {
  if(err)
      {
          res.send("error")
      }
      res.send("Done");  

  //res.render('sign',{items:result});  
})   }
 }) 
 

 app.get("/data/:shopname", (req, res) => {
  console.log("req.params.shopname",req.params.shopname)
  var shopname = req.params.shopname
  db.query("SELECT * FROM shopitems where shopname=?", [shopname],(err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("*****",result)
      res.send(result);
    }
  });
});
app.get("/shoppingpage", (req, res) => {
  db.query("SELECT DISTINCT shopname,shopimage FROM shopitems",(err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("*****shoppingpage",result)
      res.send(result);
    }
  });
});

app.get("/sendImage", (req, res) => {
  let filepath = __dirname + '/public/product/clothing3.jpeg'
  res.sendFile(filepath)

});



db.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to MySQL server.');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Serving is running on port 4000");
});
