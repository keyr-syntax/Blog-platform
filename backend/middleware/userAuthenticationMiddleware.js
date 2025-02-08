const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const jwt = require("jsonwebtoken");
const USER = require("../models/userModel.js");
require("dotenv").config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_SECRET,
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

module.exports = {
  userAuthentication,
  userAuthenticationMiddleware,
  AdminAuthenticationMiddleware,
};
