const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const USER = require("../models/userModel.js");
const BLOG = require("../models/BlogModel.js");

require("dotenv").config();
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: TOKEN_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await USER.findByPk(jwtPayload.id);
      return user ? done(null, user) : done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

const createUser = async (req, res) => {
  const { username, email, password, isAdmin, isBlocked } = req.body;
  try {
    const doesUserExist = await USER.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (doesUserExist) {
      return res.status(404).json({
        success: false,
        message: "Email already exists.Please Login",
      });
    } else {
      const newUser = await USER.create({
        username,
        email,
        password,
        isAdmin,
        isBlocked,
      });

      if (newUser) {
        const token = jwt.sign({ id: newUser.id }, TOKEN_SECRET, {
          expiresIn: "1d",
        });
        return res.status(201).json({
          success: true,
          message: "Registration Successful!",
          user: newUser,
          token: token,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "User registration failed. \nPlease try again",
        });
      }
    }
  } catch (error) {
    console.log("Error while registering user", error);
    return res.status(500).json({
      success: false,
    });
  }
};
const loginUser = async (req, res) => {
  const { username, email, password, isAdmin } = req.body;

  try {
    const finduser = await USER.findOne({
      where: {
        username: username,
      },
    });

    if (!finduser) {
      return res.status(404).json({
        success: false,
        message: "Username doesnot exist.Please register",
      });
    }
    if (!(await bcrypt.compare(password, finduser.password))) {
      return res.status(404).json({
        success: false,
        message: "Your password is incorrect.Try again",
      });
    }

    const token = jwt.sign({ id: finduser.id }, TOKEN_SECRET, {
      expiresIn: "1d",
    });

    if (finduser) {
      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: finduser,
        token: token,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User doesnot exist. Please Register",
      });
    }
  } catch (error) {
    console.log("Error occured during Login", error);
    return res.status(500).json({
      success: false,
    });
  }
};
const userAuthentication = (req, res, next) => {
  const authenticationMiddleware = passport.authenticate(
    "jwt",
    { session: false },
    (err, user, info) => {
      if (err) {
        console.log("Error while authenticating user", err);
        return res.status(500).json({
          success: false,
          message: "You are not authorized to visit this page",
        });
      }

      if (!user) {
        return res.status(500).json({
          success: false,
          message: "You are not authorized to access this page",
        });
      }

      if (user) {
        return res.status(200).json({
          success: true,
          message: `user authenticated successfully`,
          user: user,
        });
      }
    }
  );

  authenticationMiddleware(req, res, next);
};
const userAuthenticationMiddleware = (req, res, next) => {
  const authenticationMiddleware = passport.authenticate(
    "jwt",
    { session: false },
    (err, user, info) => {
      if (err) {
        console.log("Error while authenticating user", err);
        return res.status(500).json({
          success: false,
          message: "You are not authorized to visit this page",
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "You are not authorized to visit this page",
        });
      }

      req.user = user;
      next();
    }
  );

  authenticationMiddleware(req, res, next);
};
const AdminAuthenticationMiddleware = (req, res, next) => {
  const authenticationMiddleware = passport.authenticate(
    "jwt",
    { session: false },
    (err, user, info) => {
      if (err) {
        console.log("Error while authenticating user", err);
        return res.status(500).json({
          success: false,
          message: "You are not authorized to access this page",
        });
      }
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "You are not authorized to access this page",
        });
      }
      if (user) {
        console.log("Admin authentication", user);
        if (user.isAdmin) {
          req.user = user;
          next();
        } else {
          return res
            .status(404)
            .json("You are not authorized to access this page");
        }
      }
    }
  );

  authenticationMiddleware(req, res, next);
};
const fetchallusers = async (req, res) => {
  try {
    const fetchallusers = await USER.findAll();
    if (fetchallusers) {
      return res.status(200).json({
        success: true,
        message: "All users fetched successfully",
        user: fetchallusers,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to fetch users",
      });
    }
  } catch (error) {
    console.log("Error while fetching users", error);
    return res.status(500).json({
      success: false,
    });
  }
};
const fetchuserbypk = async (req, res) => {
  try {
    const id = req.user.id;
    const fetchoneuser = await USER.findByPk(id);

    if (fetchoneuser) {
      return res.status(200).json({
        success: true,
        message: "user fetched successfully",
        user: fetchoneuser,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to fetch user",
      });
    }
  } catch (error) {
    console.log("Error while fetching user", error.message);
    return res.status(500).json({
      success: false,
    });
  }
};
const fetchAuthorProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const fetchoneuser = await USER.findByPk(id, {
      include: {
        model: BLOG,
        as: "blogs_list",
        where: {
          authorID: id,
        },
        limit: 5,
        order: [["createdAt", "DESC"]],
      },
    });

    if (fetchoneuser) {
      return res.status(200).json({
        success: true,
        message: "Author's profile fetched successfully",
        user: fetchoneuser,
        blogs_list: fetchoneuser,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Author profile not found",
      });
    }
  } catch (error) {
    console.log("Error while fetching user", error.message);
    return res.status(500).json({
      success: false,
    });
  }
};
const updateUserProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const findUserByPk = await USER.findByPk(id);
    if (findUserByPk) {
      const updateUser = await findUserByPk.update({
        username: req.body.username,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
        isBlocked: req.body.isBlocked,
        profile_image: req.body.profile_image,
        biography: req.body.biography,
        profession: req.body.profession,
        location: req.body.location,
        education: req.body.education,
        hobby: req.body.hobby,
        personal_website_link: req.body.personal_website_link,
        is_available_for_work: req.body.is_available_for_work,
        is_email_public: req.body.is_email_public,
        is_blogger: req.body.is_blogger,
      });
      if (updateUser) {
        return res.status(201).json({
          success: true,
          message: "Profile updated successfully",
          user: updateUser,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Failed to update Profile",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.log("Error while Updating User", error);
    res.status(500).json({
      success: false,
    });
  }
};
const updateUserByAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const findUserByPk = await USER.findByPk(id);
    if (findUserByPk) {
      const updateUser = await findUserByPk.update({
        isAdmin: req.body.isAdmin,
        isBlocked: req.body.isBlocked,
      });
      if (updateUser) {
        return res.status(201).json({
          success: true,
          message: "user updated successfully",
          user: updateUser,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Failed to update user",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.log("Error while Updating User", error);
    res.status(500).json({
      success: false,
    });
  }
};
const deleteuser = async (req, res) => {
  try {
    const id = req.params.id;
    const finduserByPk = await USER.findByPk(id);
    if (finduserByPk) {
      const deleteuser = await finduserByPk.destroy();

      if (deleteuser) {
        return res.status(200).json({
          success: true,
          message: "User deleted successfully",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Failed to delete User",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to delete user",
      });
    }
  } catch (error) {
    console.log("Error while deleting user", error);
    return res.status(500).json({
      success: false,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  fetchallusers,
  fetchuserbypk,
  fetchAuthorProfile,
  updateUserProfile,
  userAuthentication,
  userAuthenticationMiddleware,
  AdminAuthenticationMiddleware,
  deleteuser,
  updateUserByAdmin,
};
