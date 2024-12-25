const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  fetchallusers,
  fetchuserbypk,
  updateUserByAdmin,
  userAuthentication,
  userAuthenticationMiddleware,
  AdminAuthenticationMiddleware,
  deleteuser,
  updateUserProfile,
  fetchAuthorProfile,
} = require("../controllers/userControllers.js");

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/authenticate", userAuthentication);
router.get("/fetchallusers", userAuthenticationMiddleware, fetchallusers);
router.get("/fetchoneuser", userAuthenticationMiddleware, fetchuserbypk);
router.put("/updateuser/:id", AdminAuthenticationMiddleware, updateUserByAdmin);
router.put(
  "/updateuserprofile",
  userAuthenticationMiddleware,
  updateUserProfile
);
router.get("/fetchauthorprofile/:id", fetchAuthorProfile);
router.delete("/deleteuser/:id", AdminAuthenticationMiddleware, deleteuser);

module.exports = router;
