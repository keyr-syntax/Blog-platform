const express = require("express");
const router = express.Router();
const {
  fetchAllBlogLikes,
  isBlogLikedByUser,
} = require("../controllers/blogLikesCounterControllers.js");
const {
  userAuthenticationMiddleware,
} = require("../middleware/userAuthenticationMiddleware.js");

router.get("/fetchallbloglikes", fetchAllBlogLikes);
router.get(
  "/isbloglikedbyuser/:blogID",
  userAuthenticationMiddleware,
  isBlogLikedByUser
);

module.exports = router;
