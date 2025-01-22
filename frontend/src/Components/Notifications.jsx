import { BlogContext } from "./ContextProvider.jsx";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

function Notifications() {
  const { allNotifications, markNotificationAsSeen } = useContext(BlogContext);
  useEffect(() => {
    markNotificationAsSeen();
  }, []);

  return (
    <>
      <p
        style={{
          margin: "80px auto 20px auto",
          textAlign: "center",
          fontSize: "20px",
        }}
      >
        Your Notifications appear here
      </p>
      {allNotifications &&
        allNotifications.length > 0 &&
        allNotifications.map((notification) => (
          <div key={notification.id}>
            {notification.isComment === true && (
              <Link
                style={{
                  border: "1px solid rgb(255,255,255,0.2)",
                  margin: "10px auto",
                  borderRadius: "6px",
                  padding: "15px",
                  display: "block",
                  color: "white",
                  textDecoration: "none",
                  width: "90%",
                  maxWidth: "600px",
                }}
                to={`/readblog/${notification.blogID}/${notification.commentID}`}
              >
                {notification.userName} commented on your blog:
                <span style={{ marginLeft: "5px" }}>
                  {notification.commentBody}
                </span>
              </Link>
            )}

            {notification.isReply === true && (
              <Link
                style={{
                  border: "1px solid rgb(255,255,255,0.2)",
                  margin: "10px auto",
                  borderRadius: "6px",
                  padding: "15px",
                  display: "block",
                  color: "white",
                  textDecoration: "none",
                  width: "90%",
                  maxWidth: "600px",
                }}
                to={`/readblog/${notification.blogID}/${notification.commentID}`}
              >
                {notification.userName} replied to your comment:{" "}
                <span style={{ marginLeft: "5px" }}>
                  {notification.commentBody}
                </span>
              </Link>
            )}
            {notification.isLike === true && (
              <Link
                style={{
                  border: "1px solid rgb(255,255,255,0.2)",
                  margin: "10px auto",
                  borderRadius: "6px",
                  padding: "15px",
                  display: "block",
                  color: "white",
                  width: "90%",
                  maxWidth: "600px",
                  textDecoration: "none",
                }}
                to={`/readblog/${notification.blogID}`}
              >
                {notification.userName} liked your blog
              </Link>
            )}
          </div>
        ))}
    </>
  );
}

export default Notifications;
