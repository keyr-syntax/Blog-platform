const express = require("express");
const cors = require("cors");
const app = express();
const cron = require("node-cron");
const sequelize = require("./config/dbMySQL.js");
const userRoutes = require("./routes/userRoutes.js");
const blogRoutes = require("./routes/blogRoutes.js");
const imageRoutes = require("./routes/imageRoutes.js");
const commentRoutes = require("./routes/commentRoutes.js");
const blogTagsRoutes = require("./routes/BlogTagsRoutes.js");
const blogviewcounterRoutes = require("./routes/blogViewCounterRoutes.js");
const blogLikesCounterRoutes = require("./routes/blogLikesCounterRoutes.js");
const blogSharesCounterRoutes = require("./routes/blogSharesCounterRoutes.js");
const AIGeneratedResponseRoutes = require("./routes/AIGeneratedResponseRoutes.js");
const saveBlogsForLaterRoutes = require("./routes/saveBlogForLaterRoutes.js");

const BLOG = require("./models/BlogModel.js");
const modelAssociation = require("./models/ModelAssociations.js");
require("./models/BlogModel.js");
require("./models/BlogTagsModel.js");
require("./models/userModel.js");
require("./models/SaveBlogForLaterModel.js");
require("./models/BlogCommentModel.js");
require("./models/BlogLikesCounter.js");
require("./models/BlogSharesCounter.js");
require("./models/blogViewCounterModel.js");

modelAssociation();

sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((error) => console.error("Error syncing database:", error));
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/api/blog", blogRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/user", userRoutes);
app.use("/api/blogviews", blogviewcounterRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/likes", blogLikesCounterRoutes);
app.use("/api/shares", blogSharesCounterRoutes);
app.use("/api/ai", AIGeneratedResponseRoutes);
app.use("/api/tags", blogTagsRoutes);
app.use("/api/saveblogforlater", saveBlogsForLaterRoutes);

cron.schedule("* * * * *", async () => {
  const now = new Date();
  console.log("Cron scheduler is working:", now);

  try {
    const blogsOnSchedule = await BLOG.findAll({
      where: {
        isPublished: false,
        isScheduled: true,
      },
    });

    for (const blog of blogsOnSchedule) {
      try {
        const scheduledFor = new Date(blog.scheduledFor);
        if (
          scheduledFor instanceof Date &&
          now.getTime() >= scheduledFor.getTime()
        ) {
          blog.isPublished = true;
          blog.isScheduled = false;
          blog.isDraft = false;
          const blogPublished = await blog.save();
          console.log("Cron scheduler-blogPublished", blogPublished);
        }
      } catch (error) {
        console.log(`Error while scheduling blogID: ${blog.id}`, error);
      }
    }
  } catch (error) {
    console.log("Cron Error while scheduling tasks: ", error);
  }
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "The Backend for Blog platform is working fine",
  });
});

app.listen(5000, (error) => {
  if (error) {
    console.log(`Error while running the server: ${error}`);
  } else {
    console.log(`Server is running on http://localhost:${5000}`);
  }
});
