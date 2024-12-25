const express = require("express");
const router = express.Router();
const {
  fetchAllBlogLikes,
  isBlogLikedByUser,
} = require("../controllers/blogLikesCounterControllers.js");
const {
  userAuthenticationMiddleware,
} = require("../controllers/userControllers.js");

router.get("/fetchallbloglikes", fetchAllBlogLikes);
router.get(
  "/isbloglikedbyuser/:blogID",
  userAuthenticationMiddleware,
  isBlogLikedByUser
);

module.exports = router;