const BLOG_SHARES_COUNTER = require("../models/BlogSharesCounter.js");

const fetchAllBlogShares = async (req, res) => {
  try {
    const allBlogShares = await BLOG_SHARES_COUNTER.findAll({
      order: [["createdAt", "DESC"]],
    });
    if (allBlogShares) {
      return res.status(200).json({
        success: true,
        message: "All blog shares fetched successfully",
        shares: allBlogShares,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to fetch blog shares",
      });
    }
  } catch (error) {
    console.log("Error while fetching blog shares", error);
    res.status(500).json({
      success: false,
    });
  }
};

module.exports = fetchAllBlogShares;
