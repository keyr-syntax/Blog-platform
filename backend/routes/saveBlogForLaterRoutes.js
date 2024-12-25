const express = require("express");
const router = express.Router();

const {
  createSaveBlogForLater,
  deleteBlogsSavedForLater,
  findAllBlogsSavedForLater,
  findOneBlogSavedForLater,
} = require("../controllers/saveBlogForLaterController.js");

const {
  userAuthenticationMiddleware,
  AdminAuthenticationMiddleware,
} = require("../controllers/userControllers.js");

router.post(
  "/saveblogforlater/:blogID",
  userAuthenticationMiddleware,
  createSaveBlogForLater
);

router.delete(
  "/deleteblogsavedforlater/:id",
  userAuthenticationMiddleware,
  deleteBlogsSavedForLater
);

router.get(
  "/fetchallblogsavedforlater",
  userAuthenticationMiddleware,
  findAllBlogsSavedForLater
);

router.get(
  "/findblogsavedforlater/:blogID",
  userAuthenticationMiddleware,
  findOneBlogSavedForLater
);

module.exports = router;
