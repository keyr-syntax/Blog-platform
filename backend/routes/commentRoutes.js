const express = require("express");
const router = express.Router();
const {
  userAuthenticationMiddleware,
} = require("../middleware/userAuthenticationMiddleware.js");

const {
  addComment,
  editComment,
  deleteComment,
  fetchComments,
  fetchOneComment,
} = require("../controllers/commentControllers.js");

router.post("/addcomment", userAuthenticationMiddleware, addComment);
router.put("/editcomment/:id", userAuthenticationMiddleware, editComment);
router.get("/fetchallcomments/:blogID", fetchComments);
router.get("/findcomment/:id", userAuthenticationMiddleware, fetchOneComment);
router.delete(
  "/deletecomment/:id",
  userAuthenticationMiddleware,
  deleteComment
);

module.exports = router;
