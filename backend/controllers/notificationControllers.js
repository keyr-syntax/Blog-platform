const { where } = require("sequelize");
const NOTIFICATION = require("../models/NotificationModel.js");

const findAllNotificationsByuserID = async (req, res) => {
  try {
    const findAllNotifications = await NOTIFICATION.findAll({
      where: {
        authorIDOrRepliedTo: req.user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    const notificationsNotSeen = await NOTIFICATION.findAll({
      where: {
        authorIDOrRepliedTo: req.user.id,
        isNotified: false,
      },
    });
    const countNotificationNotSeen = notificationsNotSeen.length;
    console.log("findAllNotifications", findAllNotifications);
    if (findAllNotifications) {
      return res.json({
        success: true,
        notification: findAllNotifications,
        countNotificationNotSeen: countNotificationNotSeen,
      });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    console.log("Error while fetching notifications", error);
  }
};

const markNotificationAsSeen = async (req, res) => {
  try {
    const findAllNotifications = await NOTIFICATION.findAll({
      where: {
        authorIDOrRepliedTo: req.user.id,
      },
    });

    for (const notification of findAllNotifications) {
      notification.isNotified = true;
      await notification.save();
    }

    if (findAllNotifications) {
      return res.json({
        success: true,
      });
    } else {
      return res.json({
        success: false,
      });
    }
  } catch (error) {
    console.log("Error in markNotificationAsSeen", error);
  }
};

module.exports = {
  findAllNotificationsByuserID,
  markNotificationAsSeen,
};
