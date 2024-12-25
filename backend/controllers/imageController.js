const IMAGE_URL = require("../models/ImageURLModel.js");
const cloudinary = require("./cloudinary.js");

const createImageURL = async (req, res) => {
  try {
    const { name, imageURL } = req.body;
    const result = await cloudinary.uploader.upload(imageURL, {
      folder: "blog",
    });

    const storeImageURL = await IMAGE_URL.create({
      name,
      imageURL: result.secure_url,
      userID: req.user.id,
      isImageForBlog: true,
    });

    if (storeImageURL) {
      return res.status(201).json({
        success: true,
        message: "Image URL created successfully",
        image: storeImageURL,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to create Image URL",
      });
    }
  } catch (error) {
    console.log("Error while creating Image URL", error);
    res.status(500).json({
      success: false,
    });
  }
};
const createUserProfileImageURL = async (req, res) => {
  const now = Date.now();
  try {
    const result = await cloudinary.uploader.upload(req.body.profile_image, {
      folder: "blog",
    });

    const storeImageURL = await IMAGE_URL.create({
      name: `Image ID - ${now}`,
      imageURL: result.secure_url,
      userID: req.user.id,
      isImageForBlog: false,
    });

    if (storeImageURL) {
      return res.status(201).json({
        success: true,
        message: "Profile Image URL created successfully",
        image: storeImageURL,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to create profile Image URL",
      });
    }
  } catch (error) {
    console.log("Error while creating Image URL", error);
    res.status(500).json({
      success: false,
    });
  }
};
const fetchAllImages = async (req, res) => {
  try {
    const fetchallimages = await IMAGE_URL.findAll({
      where: {
        userID: req.user.id,
        isImageForBlog: true,
      },
    });
    if (fetchallimages) {
      return res.status(200).json({
        success: true,
        message: "All Images fetched successfully",
        image: fetchallimages,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to fetch Images",
      });
    }
  } catch (error) {
    console.log("Error while fetching Images", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching Images",
    });
  }
};
const deleteImage = async (req, res) => {
  try {
    const id = req.params.id;
    const findImageByPk = await IMAGE_URL.findByPk(id);
    if (findImageByPk) {
      const deleteImage = await findImageByPk.destroy();

      if (deleteImage) {
        return res.status(200).json({
          success: true,
          message: "Image deleted successfully",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Failed to delete Image",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "Failed to delete Image",
      });
    }
  } catch (error) {
    console.log("Error while deleting Image", error);
    return res.status(500).json({
      success: false,
    });
  }
};

module.exports = {
  createImageURL,
  fetchAllImages,
  deleteImage,
  createUserProfileImageURL,
};
