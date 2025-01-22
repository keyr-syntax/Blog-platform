const BLOG_LIKES_COUNTER = require("../models/BlogLikesCounter.js");
const NOTIFICATION = require("../models/NotificationModel.js");

const fetchAllBlogLikes = async (req, res) => {
  try {
    const allBlogLikes = await BLOG_LIKES_COUNTER.findAll({
      order: [["createdAt", "DESC"]],
    });
    if (allBlogLikes) {
      return res.status(200).json({
        success: true,
        message: "All blog likes fetched successfully",
        likes: allBlogLikes,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to fetch blog likes",
      });
    }
  } catch (error) {
    console.log("Error while fetching blog likes", error);
    res.status(500).json({
      success: false,
    });
  }
};

const isBlogLikedByUser = async (req, res) => {
  try {
    const findBlog = await BLOG_LIKES_COUNTER.findOne({
      where: {
        blogID: req.params.blogID,
        userID: req.user.id,
      },
    });

    if (findBlog !== null) {
      return res.status(200).json({
        success: true,
        isbloglikedbyuser: true,
      });
    }

    if (findBlog === null) {
      return res.status(200).json({
        success: true,
        isbloglikedbyuser: false,
      });
    }
  } catch (error) {
    console.log("Error while fetching blog likes", error);
    res.status(500).json({
      success: false,
    });
  }
};

module.exports = { fetchAllBlogLikes, isBlogLikedByUser };
