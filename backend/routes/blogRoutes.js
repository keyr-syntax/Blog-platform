const express = require("express");
const router = express.Router();
const {
  searchBlogs,
  searchBlogsByTagName,
  deleteBlog,
  fetchAllBlogs,
  fetchBlogByPk,
  updateBlog,
  createBlog,
  blogsByOtherAuthors,
  updateBlogViews,
  updateBlogLikes,
  updateBlogShares,
  publishBlog,
  fetchBlogsSavedAsdraft,
  fetchScheduledBlogs,
  changeBlogSchedule,
  fetchTopBlogs,
} = require("../controllers/blogController.js");

const {
  userAuthenticationMiddleware,
  AdminAuthenticationMiddleware,
} = require("../controllers/userControllers.js");

router.post("/createblog", userAuthenticationMiddleware, createBlog);
router.get("/fetchallblogs", fetchAllBlogs);
router.get("/blogsbyotherauthors/:id", blogsByOtherAuthors);
router.get("/fetchoneblog/:id", fetchBlogByPk);
router.get("/fetchtopblogs", fetchTopBlogs);

router.get("/scheduled", userAuthenticationMiddleware, fetchScheduledBlogs);
router.get(
  "/fetchdraftblogs",
  userAuthenticationMiddleware,
  fetchBlogsSavedAsdraft
);

router.get("/searchblogs", searchBlogs);
router.get("/searchblogsbytagname", searchBlogsByTagName);

router.put("/updateblog/:id", userAuthenticationMiddleware, updateBlog);

router.put("/publishblog/:id", userAuthenticationMiddleware, publishBlog);
router.put(
  "/changeblogschedule/:id",
  userAuthenticationMiddleware,
  changeBlogSchedule
);

router.put(
  "/updateblogviewcount/:id",
  userAuthenticationMiddleware,
  updateBlogViews
);

router.put(
  "/updatebloglikes/:id/:authorID",
  userAuthenticationMiddleware,
  updateBlogLikes
);

router.put(
  "/updateblogshares/:id",
  userAuthenticationMiddleware,
  updateBlogShares
);

router.delete("/deleteblog/:id", AdminAuthenticationMiddleware, deleteBlog);

module.exports = router;
