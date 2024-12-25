const BLOG_VIEW_COUNTER = require("../models/blogViewCounterModel.js");
const BLOG = require("../models/BlogModel.js");

const fetchAllBlogviewsForAdmins = async (req, res) => {
  try {
    const allblogviews = await BLOG_VIEW_COUNTER.findAll({
      order: [["createdAt", "DESC"]],
    });
    if (allblogviews) {
      return res.status(200).json({
        success: true,
        message: "All blog view counts fetched successfully",
        blogviewcounter: allblogviews,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to fetch blog views",
      });
    }
  } catch (error) {
    console.log("Internal server error", error);
    res.status(500).json({
      success: false,
    });
  }
};
const fetchAllBlogViewsForAnalysis = async (req, res) => {
  try {
    const allblogviews = await BLOG_VIEW_COUNTER.findAll();
    if (allblogviews) {
      return res.status(200).json({
        success: true,
        message: "All blog view counts fetched successfully",
        blogviewcounter: allblogviews,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to fetch blog views",
      });
    }
  } catch (error) {
    console.log("Internal server error", error);
    res.status(500).json({
      success: false,
    });
  }
};
const fetchBlogViewsByAuthorName = async (req, res) => {
  try {
    const listOfBlogsByAuthorName = await BLOG.findAll({
      where: {
        authorID: req.user.id,
        isPublished: true,
      },
    });
    if (listOfBlogsByAuthorName) {
      return res.status(200).json({
        success: true,
        message: "Blogs fetched by author name successfully",
        post: listOfBlogsByAuthorName,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Failed to fetch blog. Please try again",
      });
    }
  } catch (error) {
    console.log(
      "Internal server error while fetching blogs by author name",
      error
    );
    res.status(500).json({
      success: false,
    });
  }
};
const fetchOneBlogForBlogAnalytics = async (req, res) => {
  try {
    const findAllViewsForOneBlog = await BLOG_VIEW_COUNTER.findAll({
      where: {
        blogID: req.params.blogID,
      },
    });
    if (findAllViewsForOneBlog) {
      return res.status(200).json({
        success: true,
        message: "Post fetched successfully",
        blog_views: findAllViewsForOneBlog,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to fetch Post.Please try again",
      });
    }
  } catch (error) {
    console.log("Error while fetching Post", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Post.Please try again",
    });
  }
};

module.exports = {
  fetchAllBlogviewsForAdmins,
  fetchAllBlogViewsForAnalysis,
  fetchBlogViewsByAuthorName,
  fetchOneBlogForBlogAnalytics,
};
