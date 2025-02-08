const express = require("express");
const router = express.Router();
const {
  createImageURL,
  fetchAllImages,
  deleteImage,
  createUserProfileImageURL,
} = require("../controllers/imageController.js");

const {
  userAuthenticationMiddleware,
} = require("../middleware/userAuthenticationMiddleware.js");

router.post("/createimageurl", userAuthenticationMiddleware, createImageURL);

router.post(
  "/createprofileimageurl",
  userAuthenticationMiddleware,
  createUserProfileImageURL
);

router.get("/fetchallimages", userAuthenticationMiddleware, fetchAllImages);

router.delete("/deleteimage/:id", userAuthenticationMiddleware, deleteImage);
module.exports = router;
