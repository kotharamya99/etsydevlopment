const express = require("express");

const router = express.Router();

const { shopDuplicates } = require("../controllers/shop");

// router.get("/", sayHi);

router.post("/findShopDuplicates", shopDuplicates);

module.exports = router;
