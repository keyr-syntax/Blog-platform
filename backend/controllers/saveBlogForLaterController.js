const BLOG = require("../models/BlogModel.js");
const SAVE_BLOG_FOR_LATER = require("../models/SaveBlogForLaterModel.js");

const createSaveBlogForLater = async (req, res) => {
  try {
    const saveBlogForLater = await SAVE_BLOG_FOR_LATER.create({
      userID: req.user.id,
      blogID: req.params.blogID,
    });

    if (saveBlogForLater) {
      return res.status(201).json({
        success: true,
        message: "Blog saved for Later",
        saveBlogForLater: saveBlogForLater,
        isSavedForLater: true,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to save blog. Please try again",
        isSavedForLater: false,
      });
    }
  } catch (error) {
    console.log("Error while saving blog for later", error);
    res.status(500).json({
      success: false,
    });
  }
};
const deleteBlogsSavedForLater = async (req, res) => {
  try {
    const id = req.params.id;
    const findBlogSavedForLater = await SAVE_BLOG_FOR_LATER.findOne({
      where: {
        blogID: id,
      },
    });

    if (findBlogSavedForLater) {
      const deleteBlog = await findBlogSavedForLater.destroy();

      if (deleteBlog) {
        return res.status(200).json({
          success: true,
          message: "Blog removed successfully",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Failed to remove blog.Please try again",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
  } catch (error) {
    console.log("Error while deleting blog saved for later", error);
    res.status(500).json({
      success: false,
    });
  }
};
const findAllBlogsSavedForLater = async (req, res) => {
  try {
    const allBlogsSavedForLater = await SAVE_BLOG_FOR_LATER.findAll({
      where: {
        userID: req.user.id,
      },
    });

    const savedForLater = [];

    for (const blog of allBlogsSavedForLater) {
      const findBlog = await BLOG.findByPk(blog.blogID);
      savedForLater.push(findBlog);
    }

    if (allBlogsSavedForLater) {
      return res.status(200).json({
        success: true,
        message: "All blogs fetched successfully",
        saveBlogForLater: allBlogsSavedForLater,
        blogSavedForLater: savedForLater,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to fetch blogs. Please try again",
      });
    }
  } catch (error) {
    console.log("Error while fetching blogs", error);
    res.status(500).json({
      success: false,
    });
  }
};
const findOneBlogSavedForLater = async (req, res) => {
  try {
    const blogSavedForLater = await SAVE_BLOG_FOR_LATER.findOne({
      where: {
        blogID: req.params.blogID,
        userID: req.user.id,
      },
    });

    console.log("blogSavedForLater ", blogSavedForLater);

    if (blogSavedForLater) {
      return res.json({
        success: true,
        saveBlogForLater: blogSavedForLater,
        isSavedForLater: true,
      });
    } else {
      return res.json({
        success: false,
        isSavedForLater: false,
      });
    }
  } catch (error) {
    console.log("Error while fetching blog saved for laterr");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createSaveBlogForLater,
  deleteBlogsSavedForLater,
  findAllBlogsSavedForLater,
  findOneBlogSavedForLater,
};
