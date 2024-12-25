const BLOG = require("./BlogModel");
const BLOG_TAGS = require("./BlogTagsModel");
const USER = require("./userModel");
const Comment = require("./BlogCommentModel");
const BLOG_VIEW_COUNTER = require("./blogViewCounterModel");
const BLOG_LIKES_COUNTER = require("./BlogLikesCounter");
const SAVE_BLOG_FOR_LATER = require("./SaveBlogForLaterModel");

const modelAssociation = () => {
  USER.hasMany(BLOG, {
    foreignKey: "authorID",
    as: "blogs_list",
  });

  BLOG.belongsTo(USER, {
    foreignKey: "authorID",
  });

  USER.hasMany(BLOG_TAGS, {
    foreignKey: "tag_creator_ID",
    as: "blog_tags",
  });

  BLOG_TAGS.belongsTo(USER, {
    foreignKey: "tag_creator_ID",
  });

  USER.hasMany(Comment, {
    foreignKey: "userID",
    as: "comment_history",
  });

  Comment.belongsTo(USER, { foreignKey: "userID" });

  USER.hasMany(BLOG_VIEW_COUNTER, {
    foreignKey: "userID",
    as: "previously_read_blogs",
  });

  BLOG_VIEW_COUNTER.belongsTo(USER, {
    foreignKey: "userID",
  });
  USER.hasMany(BLOG_LIKES_COUNTER, {
    foreignKey: "userID",
    as: "liked_blogs",
  });

  BLOG_LIKES_COUNTER.belongsTo(USER, {
    foreignKey: "userID",
  });

  BLOG.hasMany(BLOG_TAGS, {
    foreignKey: "blogID",
    as: "blog_tags",
  });

  BLOG_TAGS.belongsTo(BLOG, {
    foreignKey: "blogID",
  });

  BLOG.hasMany(Comment, { foreignKey: "blogID", as: "comments" });
  Comment.belongsTo(BLOG, { foreignKey: "blogID" });

  Comment.hasMany(Comment, {
    foreignKey: "topLevelCommentID",
    as: "replyComments",
  });
  Comment.belongsTo(Comment, {
    foreignKey: "topLevelCommentID",
    as: "topLevelComment",
  });

  BLOG.hasMany(BLOG_LIKES_COUNTER, {
    foreignKey: "blogID",
    as: "users_who_liked_this_blog",
  });

  BLOG_LIKES_COUNTER.belongsTo(BLOG, {
    foreignKey: "blogID",
  });

  USER.hasMany(SAVE_BLOG_FOR_LATER, {
    foreignKey: "userID",
    as: "blogs_saved_for_later",
  });

  SAVE_BLOG_FOR_LATER.belongsTo(USER, {
    foreignKey: "userID",
  });
};

module.exports = modelAssociation;
