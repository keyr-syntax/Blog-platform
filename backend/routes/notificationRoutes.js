const express = require("express");
const router = express.Router();
const {
  findAllNotificationsByuserID,
  markNotificationAsSeen,
} = require("../controllers/notificationControllers.js");
const {
  userAuthenticationMiddleware,
  AdminAuthenticationMiddleware,
} = require("../controllers/userControllers.js");

router.get(
  "/allnotifications",
  userAuthenticationMiddleware,
  findAllNotificationsByuserID
);
router.get(
  "/marknotificationasseen",
  userAuthenticationMiddleware,
  markNotificationAsSeen
);

module.exports = router;
