const express = require("express");
const router = express.Router();
const {
  userAuthenticationMiddleware,
  AdminAuthenticationMiddleware,
} = require("../controllers/userControllers.js");

const generateBlogContentByAI = require("../controllers/AIGeneratedContentController.js");

router.post(
  "/generateaicontent",
  userAuthenticationMiddleware,
  generateBlogContentByAI
);

module.exports = router;
