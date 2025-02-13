const { where } = require("sequelize");
const BLOG = require("../models/BlogModel.js");
const BLOG_VIEW_COUNTER = require("../models/blogViewCounterModel.js");
const BLOG_LIKES_COUNTER = require("../models/BlogLikesCounter.js");
const BLOG_SHARE_COUNTER = require("../models/BlogSharesCounter.js");
const { Op } = require("sequelize");
const BLOG_TAGS = require("../models/BlogTagsModel.js");
const NOTIFICATION = require("../models/NotificationModel.js");

const createBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      isScheduled,
      scheduledFor,
      isPublished,
      isDraft,
      image,
      tags_list,
    } = req.body;

    if (!tags_list || !Array.isArray(tags_list) || tags_list.length > 5) {
      return res.status(400).json({
        success: false,
        message: "Only five tags are allowed",
      });
    }

    const createBlog = await BLOG.create({
      title,
      content,
      author: req.user.username,
      authorID: req.user.id,
      isScheduled,
      scheduledFor,
      isPublished,
      isDraft,
      image,
      author_profile_image: req.user.profile_image,
    });

    const createTags = tags_list.map(async (tag) => {
      await BLOG_TAGS.create({
        tag_name: tag,
        blogID: createBlog.id,
        tag_creator_ID: createBlog.authorID,
      });
    });
    await Promise.all(createTags);

    const findBlogByIDWithBlogTags = await BLOG.findByPk(createBlog.id, {
      include: {
        model: BLOG_TAGS,
        as: "blog_tags",
        where: {
          blogID: createBlog.id,
        },
      },
    });

    if (createBlog) {
      return res.status(201).json({
        success: true,
        message: "Blog created successfully",
        post: findBlogByIDWithBlogTags,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to create Post",
      });
    }
  } catch (error) {
    console.log("Error while creating Post", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while creating post",
    });
  }
};
const updateBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const tags_list = req.body.tags_list;
    const findPostByPk = await BLOG.findByPk(id);
    if (findPostByPk) {
      await findPostByPk.update({
        title: req.body.title,
        content: req.body.content,
        author: findPostByPk.author,
        authorID: findPostByPk.authorID,
        author_profile_image: req.user.profile_image,
        isScheduled: req.body.isScheduled,
        isPublished: req.body.isPublished,
        scheduledFor: req.body.scheduledFor,
        isDraft: req.body.isDraft,
        image: req.body.image,
        views: findPostByPk.views,
        likes: findPostByPk.likes,
        shares: findPostByPk.shares,
      });
      await BLOG_TAGS.destroy({
        where: {
          blogID: findPostByPk.id,
        },
      });

      const createTags = tags_list.map(async (tag) => {
        await BLOG_TAGS.create({
          tag_name: tag,
          blogID: findPostByPk.id,
          tag_creator_ID: findPostByPk.authorID,
        });
      });
      await Promise.all(createTags);

      const findBlogByIDWithBlogTags = await BLOG.findByPk(findPostByPk.id, {
        include: {
          model: BLOG_TAGS,
          as: "blog_tags",
          where: {
            blogID: findPostByPk.id,
          },
        },
      });

      if (findBlogByIDWithBlogTags) {
        return res.status(201).json({
          success: true,
          message: "Post updated successfully",
          post: findBlogByIDWithBlogTags,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Failed to update Post",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
  } catch (error) {
    console.log("Error while Updating Post", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating post",
    });
  }
};
const publishBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const findPostByPk = await BLOG.findByPk(id);
    if (findPostByPk) {
      findPostByPk.isPublished = req.body.isPublished;
      findPostByPk.isDraft = req.body.isDraft;
      findPostByPk.isScheduled = false;
      await findPostByPk.save();
      return res.status(200).json({
        success: true,
        post: findPostByPk,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
  } catch (error) {
    console.log("Error while Updating Post", error);
    res.status(500).json({
      success: false,
      message: "Failed to publish post.Try again later",
    });
  }
};
const updateBlogViews = async (req, res) => {
  try {
    const id = req.params.id;
    const viewCount = req.body.viewCount;
    const findPostByPk = await BLOG.findByPk(id);

    if (findPostByPk) {
      const updatePost = await findPostByPk.update({
        views: findPostByPk.views + viewCount,
      });

      const storeviewerprofile = await BLOG_VIEW_COUNTER.create({
        userID: req.user.id || null,
        viewer_username: req.user.username || null,
        blogID: req.params.id,
        blogTitle: findPostByPk.title,
      });

      if (storeviewerprofile) {
        return res.status(201).json({
          success: true,
          message: "Post updated successfully",
          post: updatePost,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Failed to update Post",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
  } catch (error) {
    console.log("Error while Updating Post", error);
    res.status(500).json({
      success: false,
    });
  }
};
const updateBlogLikes = async (req, res) => {
  try {
    const id = req.params.id;
    const findPostByPk = await BLOG.findByPk(id);
    const findUser = await BLOG_LIKES_COUNTER.findOne({
      where: {
        userID: req.user.id,
        blogID: id,
      },
    });

    if (findUser !== null) {
      const updatePost = await findPostByPk.update({
        likes: findPostByPk.likes - 1,
      });
      const deleteUser = await findUser.destroy();
      const findNotification = await NOTIFICATION.findOne({
        where: {
          userID: req.user.id,
          blogID: id,
        },
      });
      await findNotification.destroy();

      if (updatePost && deleteUser) {
        return res.status(201).json({
          success: true,
          message: "Like Count updated successfully",
          post: updatePost,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Failed to update Post",
        });
      }
    } else {
      const updatePost = await findPostByPk.update({
        likes: findPostByPk.likes + 1,
      });
      const bloglikescount = await BLOG_LIKES_COUNTER.create({
        userID: req.user.id,
        blog_liked_by: req.user.username,
        blogID: req.params.id,
        blogTitle: findPostByPk.title,
        authorID: findPostByPk.authorID,
        author: findPostByPk.author,
      });
      const createNotification = await NOTIFICATION.create({
        commentID: null,
        userID: req.user.id,
        userName: req.user.username,
        commentBody: null,
        isComment: false,
        isReply: false,
        isLike: true,
        blogID: req.params.id,
        authorIDOrRepliedTo: req.params.authorID,
        isNotified: false,
      });
      console.log("createNotification", createNotification);

      if (updatePost && bloglikescount) {
        return res.status(201).json({
          success: true,
          message: "Like Count updated successfully",
          post: updatePost,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Failed to update Like Count",
        });
      }
    }
  } catch (error) {
    console.log("Error while Updating Like count", error);
    res.status(500).json({
      success: false,
    });
  }
};
const updateBlogShares = async (req, res) => {
  try {
    const id = req.params.id;
    const findPostByPk = await BLOG.findByPk(id);
    const updatePost = await findPostByPk.update({
      shares: findPostByPk.shares + 1,
    });
    console.log("Blog share", updatePost);
    const blogsharecount = await BLOG_SHARE_COUNTER.create({
      userID: req.user.id,
      blog_shared_by: req.user.username,
      blogID: req.params.id,
      blogTitle: findPostByPk.title,
      sharedOn: req.body.sharedOn,
      authorID: findPostByPk.authorID,
      author: findPostByPk.author,
    });
    if (updatePost && blogsharecount) {
      return res.status(201).json({
        success: true,
        message: "Share Count updated successfully",
        post: updatePost,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to update Share Count",
      });
    }
  } catch (error) {
    console.log("Error while Updating Share count", error);
    res.status(500).json({
      success: false,
    });
  }
};

const fetchAllBlogs = async (req, res) => {
  try {
    const fetchallposts = await BLOG.findAll({
      where: {
        isPublished: true,
        isDraft: false,
        isScheduled: false,
      },
      limit: 6,
      order: [["createdAt", "DESC"]],
    });
    if (fetchallposts) {
      return res.status(200).json({
        success: true,
        message: "All Posts fetched successfully",
        post: fetchallposts,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to fetch Posts",
      });
    }
  } catch (error) {
    console.log("Error while fetching posts", error);
    return res.status(500).json({
      success: false,
    });
  }
};
const fetchBlogByPk = async (req, res) => {
  try {
    const id = req.params.id;
    const fetchonepost = await BLOG.findByPk(id, {
      include: {
        model: BLOG_TAGS,
        as: "blog_tags",
        where: {
          blogID: id,
        },
      },
    });

    fetchonepost.views += 1;
    const countviewforpost = await fetchonepost.save();

    await BLOG_VIEW_COUNTER.create({
      userID: null,
      viewer_username: null,
      blogID: req.params.id,
      blogTitle: fetchonepost.title,
    });

    if (countviewforpost) {
      return res.status(200).json({
        success: true,
        message: "Post fetched successfully",
        post: fetchonepost,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to fetch Post",
      });
    }
  } catch (error) {
    console.log("Error while fetching Post", error);
    return res.status(500).json({
      success: false,
      message: "Internal server Error.Please try again later",
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const findpostbypk = await BLOG.findByPk(id);
    if (findpostbypk) {
      const deletepost = await findpostbypk.destroy();

      if (deletepost) {
        return res.status(200).json({
          success: true,
          message: "Post deleted successfully",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Failed to delete Post",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to delete Post",
      });
    }
  } catch (error) {
    console.log("Error while deleting Post", error);
    return res.status(500).json({
      success: false,
    });
  }
};
const searchBlogs = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.json({
        success: false,
        message: "Please write something in the search box",
      });
    }
    const searchKeyword = keyword.trim();

    const searchpostsbykeyword = await BLOG.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchKeyword}%` } },
          { content: { [Op.like]: `%${searchKeyword}%` } },
          { author: { [Op.like]: `%${searchKeyword}%` } },
        ],
        isPublished: true,
      },
    });

    if (searchpostsbykeyword.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Blogs match your search",
      });
    } else {
      return res.json({
        success: true,
        message: "Blogs matching your search \nare fetched successfully",
        post: searchpostsbykeyword,
      });
    }
  } catch (error) {
    console.log("Server error while searching \nguidlelines by keyword", error);
    res.status(500).json({
      success: false,
    });
  }
};
const searchBlogsByTagName = async (req, res) => {
  try {
    const { tag_keyword } = req.query;

    if (!tag_keyword) {
      return res.json({
        success: false,
        message: "Please write something in the search box",
      });
    }
    const searchKeyword = tag_keyword.trim();

    const searchpostsbytag_keyword = await BLOG_TAGS.findAll({
      where: {
        [Op.or]: [{ tag_name: { [Op.like]: `%${searchKeyword}%` } }],
      },
    });

    const listOfBlogsByTagName = [];
    for (const tag of searchpostsbytag_keyword) {
      const blogByTagName = await BLOG.findByPk(tag.blogID);
      listOfBlogsByTagName.push(blogByTagName);
    }

    if (listOfBlogsByTagName) {
      return res.status(404).json({
        success: true,
        blogsByTagName: listOfBlogsByTagName,
      });
    }
  } catch (error) {
    console.log("Server error while searching blogs by keyword", error);
    res.status(500).json({
      success: false,
    });
  }
};
const blogsByOtherAuthors = async (req, res) => {
  try {
    const fetchallposts = await BLOG.findAll({
      where: {
        authorID: { [Op.ne]: req.params.id },
      },
    });

    if (fetchallposts) {
      return res.status(200).json({
        success: true,
        message: "All Posts fetched successfully",
        post: fetchallposts,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to fetch Posts",
      });
    }
  } catch (error) {
    console.log("Error while fetching posts", error);
    return res.status(500).json({
      success: false,
    });
  }
};
const fetchBlogsSavedAsdraft = async (req, res) => {
  try {
    const fetchdraftblogs = await BLOG.findAll({
      where: {
        isPublished: false,
        authorID: req.user.id,
        isDraft: true,
      },
    });
    if (fetchdraftblogs) {
      return res.status(200).json({
        success: true,
        message: "All draft Blogs fetched successfully",
        post: fetchdraftblogs,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to fetch blogs",
      });
    }
  } catch (error) {
    console.log("Error while fetching posts", error);
    return res.status(500).json({
      success: false,
    });
  }
};
const fetchScheduledBlogs = async (req, res) => {
  try {
    const scheduledBlogs = await BLOG.findAll({
      where: {
        authorID: req.user.id,
        isPublished: false,
        isScheduled: true,
      },
    });

    if (scheduledBlogs) {
      return res.status(200).json({
        success: true,
        post: scheduledBlogs,
      });
    } else {
      return res.status(404).json({
        success: false,
      });
    }
  } catch (error) {
    console.log("Error while fetchScheduledBlogs", error);
    res.status(500).json({
      success: false,
    });
  }
};
const changeBlogSchedule = async (req, res) => {
  try {
    id = req.params.id;
    const findScheduledBlog = await BLOG.findByPk(id);
    const updateBlogSchedule = await findScheduledBlog.update({
      scheduledFor: req.body.scheduledFor,
    });
    if (updateBlogSchedule) {
      return res.status(200).json({
        success: true,
        message: "Blog schedule changed",
        post: updateBlogSchedule,
      });
    } else {
      return res.json({
        success: false,
        message: "Blog schedule not changed",
      });
    }
  } catch (error) {
    console.log("Error", error);
  }
};
const fetchTopBlogs = async (req, res) => {
  try {
    const topBlogs = await BLOG.findAll({
      where: {
        isPublished: true,
        isDraft: false,
        isScheduled: false,
      },
      order: [["views", "DESC"]],
    });

    if (topBlogs) {
      return res.status(200).json({
        success: true,
        message: "Top blogs by the same author fetched successfully",
        post: topBlogs,
      });
    } else {
      return res.json({
        success: false,
        message: "Blogs not found",
      });
    }
  } catch (error) {
    console.log("Error", error);
  }
};

module.exports = {
  searchBlogs,
  searchBlogsByTagName,
  deleteBlog,
  fetchAllBlogs,
  fetchBlogByPk,
  updateBlog,
  createBlog,
  blogsByOtherAuthors,
  updateBlogViews,
  updateBlogLikes,
  updateBlogShares,
  publishBlog,
  fetchBlogsSavedAsdraft,
  fetchScheduledBlogs,
  changeBlogSchedule,
  fetchTopBlogs,
};
