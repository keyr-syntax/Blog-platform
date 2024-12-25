const { where } = require("sequelize");
const BLOG_TAGS = require("../models/BlogTagsModel.js");
const BLOG = require("../models/BlogModel.js");

const createBlogTags = async (req, res) => {
  try {
    const createNewTag = await BLOG_TAGS.create({
      tag_name: req.body.tag_name,
      tag_creator_ID: req.body.id,
      blogID: null,
    });
    if (createNewTag) {
      return res.status(201).json({
        success: true,
        message: "Blog tag created successfully",
        blog_tag: createNewTag,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to create blog tag",
      });
    }
  } catch (error) {
    console.log("Error while creating blog tags", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again",
    });
  }
};
const deleteBlogTags = async (req, res) => {
  try {
    const id = req.params.id;
    const findBlogTagByPk = await BLOG_TAGS.findByPk(id);

    if (findBlogTagByPk) {
      return res.status(200).json({
        success: true,
        message: "Tag deleted successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No tags found",
      });
    }
  } catch (error) {
    console.log("Error while deleting a blog tag", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again",
    });
  }
};
const fetchAllBlogTags = async (req, res) => {
  try {
    const findAllBlogTagsByCreatorID = await BLOG_TAGS.findAll({
      limit: 10,
    });

    if (findAllBlogTagsByCreatorID) {
      return res.status(200).json({
        success: true,
        message: "All blog tags fetched successfully",
        blog_tag: findAllBlogTagsByCreatorID,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to fetch blog tags ",
      });
    }
  } catch (error) {
    console.log("Error while fetching blog tags", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const findBlogsByTagName = async (req, res) => {
  try {
    const id = req.params.id;
    const findBlogTag = await BLOG_TAGS.findByPk(id);

    const listOfBlogsByTagName = await BLOG_TAGS.findByPk(id, {
      include: {
        model: BLOG,
        as: "blog_list_by_tag_name",
        where: {
          id: findBlogTag.blogID,
        },
      },
    });

    if (listOfBlogsByTagName) {
      return res.status(200).json({
        success: true,
        message: "Blogs under tag name fetched successfully",
        blog_tag: listOfBlogsByTagName,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to find blogs.Please try again.",
      });
    }
  } catch (error) {
    console.log("Error while creating blog tags", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again",
    });
  }
};

module.exports = {
  createBlogTags,
  deleteBlogTags,
  fetchAllBlogTags,
  findBlogsByTagName,
};
