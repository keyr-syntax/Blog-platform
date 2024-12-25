const Comment = require("../models/BlogCommentModel.js");

const addComment = async (req, res) => {
  if (
    !req.body.commentBody ||
    req.body.commentBody === "" ||
    !req.body.blogID ||
    req.body.blogID === ""
  ) {
    return res.json({
      success: false,
      message: "Please write your comments",
    });
  }
  try {
    const addNewComment = await Comment.create({
      commentBody: req.body.commentBody,
      topLevelCommentID: req.body.topLevelCommentID || null,
      blogID: req.body.blogID,
      commented_by: req.user.username,
      userID: req.user.id,
    });

    if (addNewComment) {
      return res.status(201).json({
        success: true,
        message: "Comment added successfully",
        comment: addNewComment,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to add comment",
      });
    }
  } catch (error) {
    console.log("Error while adding comment", error);
    res.status(500).json({
      success: false,
    });
  }
};
const editComment = async (req, res) => {
  try {
    const id = req.params.id;

    const findCommentByPk = await Comment.findByPk(id);

    if (findCommentByPk) {
      const updateComment = await findCommentByPk.update({
        commentBody: req.body.commentBody,
      });
      if (updateComment) {
        return res.status(200).json({
          success: true,
          message: "Comment updated successfully",
          comment: updateComment,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Failed to update comment",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
  } catch (error) {
    console.log("Error while updating comment", error);
    res.status(500).json({
      success: false,
    });
  }
};
const deleteComment = async (req, res) => {
  try {
    const id = req.params.id;
    const userID = req.user.id;
    const findCommentByPk = await Comment.findByPk(id);

    if (findCommentByPk.userID === userID || req.user.isAdmin === true) {
      const deleted = await findCommentByPk.destroy();
      if (deleted) {
        return res.status(200).json({
          success: true,
          message: "Comment deleted successfully",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "comment not found",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "You can't delete this comment",
      });
    }
  } catch (error) {
    console.log("Error while deleting comment", error);
    res.status(500).json({
      success: false,
    });
  }
};
const fetchComments = async (req, res) => {
  try {
    const blogID = req.params.blogID;
    const fetchAllComments = await Comment.findAll({
      where: {
        blogID,
        topLevelCommentID: null,
      },
      include: {
        model: Comment,
        as: "replyComments",
        include: {
          model: Comment,
          as: "replyComments",
        },
      },
      order: [["createdAt", "DESC"]],
    });
    const calculateTotalComments = (comments) => {
      let total = comments.length;
      comments.forEach((comment) => {
        if (comment.replyComments && comment.replyComments.length > 0) {
          total += calculateTotalComments(comment.replyComments);
        }
      });
      return total;
    };

    if (fetchAllComments) {
      const totalCommentsCount = calculateTotalComments(fetchAllComments);
      return res.status(200).json({
        success: true,
        message: "All comments fetched successfully",
        comment: fetchAllComments,
        sumOfComments: totalCommentsCount,
      });
    } else {
      return res.status(404).json({
        success: true,
        message: "Comment not found",
      });
    }
  } catch (error) {
    console.log("Error while fetching comment", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const fetchOneComment = async (req, res) => {
  try {
    const id = req.params.id;
    const findCommentByPk = await Comment.findByPk(id);

    if (findCommentByPk) {
      return res.status(200).json({
        success: true,
        message: "Comment fetched successfully",
        comment: findCommentByPk,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
  } catch (error) {
    console.log("Error while fetching comment", error);
    res.status(500).json({
      success: false,
    });
  }
};

module.exports = {
  addComment,
  editComment,
  deleteComment,
  fetchComments,
  fetchOneComment,
};
