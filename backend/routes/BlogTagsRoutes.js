const express = require("express");
const router = express.Router();

const {
  createBlogTags,
  deleteBlogTags,
  fetchAllBlogTags,
  findBlogsByTagName,
} = require("../controllers/BlogTagsController.js");

const {
  userAuthenticationMiddleware,
} = require("../middleware/userAuthenticationMiddleware.js");

router.post("/createtags", userAuthenticationMiddleware, createBlogTags);

router.get("/fetchalltags", fetchAllBlogTags);
router.get("/fetchblogsbytagname/:id", findBlogsByTagName);

router.delete("/deletetags", userAuthenticationMiddleware, deleteBlogTags);

module.exports = router;
