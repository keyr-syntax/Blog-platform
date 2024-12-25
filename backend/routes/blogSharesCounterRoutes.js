const express = require("express");
const router = express.Router();
const fetchAllBlogShares = require("../controllers/blogSharesCounterControllers.js");
router.get("/fetchallblogshares", fetchAllBlogShares);

module.exports = router;
