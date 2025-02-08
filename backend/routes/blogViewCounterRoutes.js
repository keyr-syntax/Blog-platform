const express = require("express");
const router = express.Router();
const {
  AdminAuthenticationMiddleware,
  userAuthenticationMiddleware,
} = require("../middleware/userAuthenticationMiddleware.js");

const {
  fetchAllBlogviewsForAdmins,
  fetchAllBlogViewsForAnalysis,
  fetchBlogViewsByAuthorName,
  fetchOneBlogForBlogAnalytics,
} = require("../controllers/blogViewCounterController.js");

router.get(
  "/allblogviewsforanalysis",
  userAuthenticationMiddleware,
  fetchAllBlogViewsForAnalysis
);
router.get(
  "/fetchblogsbyauthorname",
  userAuthenticationMiddleware,
  fetchBlogViewsByAuthorName
);
router.get(
  "/fetchallblogviewscount",
  AdminAuthenticationMiddleware,
  fetchAllBlogviewsForAdmins
);
router.get(
  "/fetchoneblogforanalytics/:blogID",
  userAuthenticationMiddleware,
  fetchOneBlogForBlogAnalytics
);

module.exports = router;
