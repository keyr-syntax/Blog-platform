/* eslint-disable no-unused-vars */
import { BlogContext } from "./ContextProvider.jsx";
import { useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useParams } from "react-router-dom";
import ScrollIntoView from "react-scroll-into-view";
import CardGroup from "react-bootstrap/CardGroup";
import toast from "react-hot-toast";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { FaShare } from "react-icons/fa";
import { MessageSquareMore } from "lucide-react";
import { FaLink } from "react-icons/fa";
import {
  EmailShareButton,
  FacebookMessengerShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import {
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  LinkedinIcon,
  RedditIcon,
  TelegramIcon,
  WhatsappIcon,
  XIcon,
} from "react-share";
import "./ReadBlogs.css";
import { Link } from "react-router-dom";
import Footer from "./Footer.jsx";
const BLOGURL = window.location.href;

function ReadBlogs() {
  const {
    isLoggedIn,
    BACKEND_API,
    setBlogdetails,
    blogdetails,
    keyword,
    setKeyword,
    searchBlogs,
    handleShowModalForSignUp,
    saveBlogForLater,
    deleteBlogSavedForLater,
    isSavedForLater,
    setIsSavedForLater,
    loggedInUserName,
    fetchblogsByOtherAuthors,
    blogsByOtherAuthors,
  } = useContext(BlogContext);
  const [commentBody, setcommentBody] = useState("");
  const [topLevelCommentID, setTopLevelCommentID] = useState("");
  const [commentID, setCommentID] = useState("");
  const [commentForEdit, setCommentForEdit] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [sumOfComments, setSumOfComments] = useState("");
  const [blog_tags, setBlog_tags] = useState([]);
  const [showModalToEditComment, setShowModalToEditComment] = useState(false);
  const [showModalToAddComment, setShowModalToAddComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState("");
  const [isbloglikedbyuser, setIsBlogLikedByUser] = useState(false);
  const handleClose = () => setShowModalToEditComment(false);
  const handleShow = () => setShowModalToEditComment(true);
  const handleshowModalToAddComment = () => setShowModalToAddComment(true);
  const handleCloseModalToAddComment = () => setShowModalToAddComment(false);
  const [authorProfile, setAuthorProfile] = useState("");
  const [is_available_for_work, setis_available_for_work] = useState(false);
  const [is_email_public, setis_email_public] = useState(false);
  const [moreBlogsBySameAuthor, setMoreBlogsBySameAuthor] = useState([]);

  const { id } = useParams();
  const urlToBeShared = encodeURIComponent(BLOGURL);
  const getFirstLetterOfName = (username) => username.charAt(0).toUpperCase();

  useEffect(() => {
    fetchblogbypk(id);
    fetchAllComments(id);
    isBlogLikedByUser(id);
    isBlogSavedForLater(id);
  }, [id]);

  const fetchblogbypk = async (id) => {
    try {
      const data = await fetch(`${BACKEND_API}/api/blog/fetchoneblog/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await data.json();
      if (response.success === true) {
        const post = response.post;
        setBlogdetails(post);
        setBlog_tags(post.blog_tags);
        fetchAuthorProfile(post.authorID);
        fetchblogsByOtherAuthors(post.authorID);
      }
    } catch (error) {
      console.log("Error while fetching post", error);
    }
  };
  const fetchAuthorProfile = async (authorID) => {
    try {
      const data = await fetch(
        `${BACKEND_API}/api/user/fetchauthorprofile/${authorID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const response = await data.json();
      if (response.success === true) {
        setis_available_for_work(response.user.is_available_for_work);
        setis_email_public(response.user.is_email_public);
        setAuthorProfile(response.user);
        setMoreBlogsBySameAuthor(response.blogs_list.blogs_list);
      }
    } catch (error) {
      console.log("Error while fetching author's profile");
    }
  };
  const isBlogSavedForLater = async (blogID) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const data = await fetch(
        `${BACKEND_API}/api/saveblogforlater/findblogsavedforlater/${blogID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await data.json();

      if (response.isSavedForLater === true) {
        setIsSavedForLater(true);
      } else if (response.isSavedForLater === false) {
        setIsSavedForLater(false);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  const isBlogLikedByUser = async (blogID) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const data = await fetch(
        `${BACKEND_API}/api/likes/isbloglikedbyuser/${blogID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = await data.json();

      if (response.isbloglikedbyuser === true) {
        setIsBlogLikedByUser(true);
      } else if (response.isbloglikedbyuser === false) {
        setIsBlogLikedByUser(false);
      }
    } catch (error) {
      console.log("Error while checking isbloglikedbyuser", error);
    }
  };
  const fetchAllComments = async (blogID) => {
    try {
      const data = await fetch(
        `${BACKEND_API}/api/comment/fetchallcomments/${blogID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const response = await data.json();

      if (response.success) {
        setAllComments(response.comment);

        setSumOfComments(response.sumOfComments);
      } else if (response.success === false) {
        setAllComments("");
      }
    } catch (error) {
      console.log("Error while fetching comments", error);
    }
  };
  const handleAddComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(`${BACKEND_API}/api/comment/addcomment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          commentBody: commentBody,
          topLevelCommentID: topLevelCommentID,
          blogID: blogdetails.id,
          author: blogdetails.author,
          authorID: blogdetails.authorID,
        }),
      });
      const response = await data.json();

      if (response.success === true) {
        {
          response.comment.topLevelCommentID
            ? toast.success("Reply added")
            : toast.success("Comment added");
        }
        fetchAllComments(blogdetails.id);
        setcommentBody("");
        setTopLevelCommentID("");
        handleCloseModalToAddComment();
      }
    } catch (error) {
      console.log("Error while updating blog", error);
    }
  };
  const deleteComment = async (id) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        const data = await fetch(
          `${BACKEND_API}/api/comment/deletecomment/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const response = await data.json();
        if (response.success) {
          toast.success("Comment deleted");
          fetchAllComments(blogdetails.id);
        }
      } catch (error) {
        console.log("Error while updating blog", error);
      }
    }
  };
  const editComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(
        `${BACKEND_API}/api/comment/editcomment/${commentID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            commentBody: commentForEdit,
          }),
        }
      );

      const response = await data.json();
      if (response.success) {
        toast.success("Comment updated");
        fetchAllComments(blogdetails.id);
        setcommentBody("");
      }
    } catch (error) {
      console.log("Error while updating comment", error);
    }
  };
  const fetchComment = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(`${BACKEND_API}/api/comment/findcomment/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await data.json();
      if (response.success) {
        setCommentForEdit(response.comment.commentBody);
        setCommentID(response.comment.id);
      }
    } catch (error) {
      console.log("Error while fetching comment", error);
    }
  };
  const renderComments = (allComments) => {
    return allComments.map((comment) => (
      <>
        {comment && (
          <Container
            key={comment.id}
            fluid
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "start",
              alignItems: "center",
              borderRadius: "6px",
              margin: "5px auto 5px auto",
              width: "100%",
              border: "1px solid rgb(255,255,255,0.2)",
            }}
          >
            {comment.commented_by !== null && (
              <Container
                fluid
                style={{
                  height: "45px",
                  width: "45px",
                  objectFit: "cover",
                  borderRadius: "50%",

                  backgroundColor: "#151533",
                  border: "1px solid rgb(255,255,255,0.2)",
                  background: "green",
                  fontSize: "22px",
                  color: "white",
                  fontWeight: "bold",
                  alignItems: "center",
                }}
              >
                {getFirstLetterOfName(comment.commented_by)}
              </Container>
            )}
            <Container
              fluid
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Container
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: "20px",
                }}
              >
                <Card.Text style={{ textWrap: "nowrap" }}>
                  {comment.commented_by}
                </Card.Text>{" "}
                <Card.Text style={{ textWrap: "nowrap" }}>
                  {new Date(comment.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Card.Text>
              </Container>
              <Container fluid>{comment.commentBody}</Container>
              <Container
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "start",
                  alignItems: "start",
                }}
              >
                {loggedInUserName === comment.commented_by && (
                  <Button
                    style={{
                      border: "1px solid rgb(255,255,255,0.2)",
                      backgroundColor: "#151533",
                      padding: "3px 18px",
                      margin: "5px",
                    }}
                    onClick={() => {
                      if (isLoggedIn === true) {
                        fetchComment(comment.id);
                        handleShow();
                      } else if (isLoggedIn === false) {
                        handleShowModalForSignUp();
                      }
                    }}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  style={{
                    border: "1px solid rgb(255,255,255,0.2)",
                    backgroundColor: "#151533",
                    padding: "3px 18px",
                    margin: "5px",
                  }}
                  onClick={() => {
                    if (isLoggedIn === true) {
                      setTopLevelCommentID(comment.id);
                      setReplyingTo(comment.commented_by);
                      handleshowModalToAddComment();
                    } else if (isLoggedIn === false) {
                      handleShowModalForSignUp();
                    }
                  }}
                >
                  Reply
                </Button>
                {loggedInUserName === comment.commented_by && (
                  <Button
                    style={{
                      border: "1px solid rgb(255,255,255,0.2)",
                      backgroundColor: "#151533",
                      padding: "3px 18px",
                      margin: "5px",
                    }}
                    onClick={() => {
                      if (isLoggedIn === true) {
                        deleteComment(comment.id);
                      } else if (isLoggedIn === false) {
                        handleShowModalForSignUp();
                      }
                    }}
                  >
                    Delete
                  </Button>
                )}
              </Container>
            </Container>
          </Container>
        )}

        {comment.replyComments.length > 0 &&
          comment.replyComments.map((reply) => (
            <Container
              key={reply.id}
              fluid
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                borderRadius: "6px",
                margin: "5px 0 5px 50px",
                width: "90%",
                border: "1px solid rgb(255,255,255,0.2)",
              }}
            >
              {reply.commented_by !== null && (
                <Container
                  fluid
                  style={{
                    height: "45px",
                    width: "45px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    // marginTop: "5px",
                    backgroundColor: "#151533",
                    border: "1px solid rgb(255,255,255,0.2)",
                    background: "green",
                    fontSize: "22px",
                    color: "white",
                    fontWeight: "bold",
                    alignItems: "center",
                  }}
                >
                  {getFirstLetterOfName(reply.commented_by)}
                </Container>
              )}
              <Container
                fluid
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Container
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "start",
                    alignItems: "start",
                    gap: "20px",
                  }}
                >
                  <Card.Text style={{ textWrap: "nowrap" }}>
                    {reply.commented_by}
                  </Card.Text>{" "}
                  <Card.Text style={{ textWrap: "nowrap" }}>
                    {new Date(reply.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Card.Text>
                </Container>
                <Container fluid>{reply.commentBody}</Container>
                <Container
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "start",
                    alignItems: "start",
                  }}
                >
                  {loggedInUserName === reply.commented_by && (
                    <Button
                      style={{
                        border: "1px solid rgb(255,255,255,0.2)",
                        backgroundColor: "#151533",
                        padding: "3px 18px",
                        margin: "5px",
                      }}
                      onClick={() => {
                        if (isLoggedIn === true) {
                          fetchComment(reply.id);
                          handleShow();
                        } else if (isLoggedIn === false) {
                          handleShowModalForSignUp();
                        }
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    style={{
                      border: "1px solid rgb(255,255,255,0.2)",
                      backgroundColor: "#151533",
                      padding: "3px 18px",
                      margin: "5px",
                    }}
                    onClick={() => {
                      if (isLoggedIn === true) {
                        setTopLevelCommentID(reply.id);
                        setReplyingTo(reply.commented_by);
                        handleshowModalToAddComment();
                      } else if (isLoggedIn === false) {
                        handleShowModalForSignUp();
                      }
                    }}
                  >
                    Reply
                  </Button>
                  {loggedInUserName === reply.commented_by && (
                    <Button
                      style={{
                        border: "1px solid rgb(255,255,255,0.2)",
                        backgroundColor: "#151533",
                        padding: "3px 18px",
                        margin: "5px",
                      }}
                      onClick={() => {
                        if (isLoggedIn === true) {
                          deleteComment(reply.id);
                        } else if (isLoggedIn === false) {
                          handleShowModalForSignUp();
                        }
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </Container>
              </Container>
            </Container>
          ))}
      </>
    ));
  };
  const handleBlogLikes = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const data = await fetch(
        `${BACKEND_API}/api/blog/updatebloglikes/${blogdetails.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = await data.json();
      if (response.success) {
        setBlogdetails(response.post);
        isBlogLikedByUser(blogdetails.id);
      }
    } catch (error) {
      console.log("Error while adding Blog Like", error);
    }
  };
  const handleBlogShares = async (sharedOn) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const data = await fetch(
        `${BACKEND_API}/api/blog/updateblogshares/${blogdetails.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sharedOn: sharedOn,
          }),
        }
      );

      const response = await data.json();
      if (response.success) {
        setBlogdetails(response.post);
        console.log("Blog share", response.post);
      }
    } catch (error) {
      console.log("Error while adding Blog share", error);
    }
  };

  return (
    <>
      <Container
        fluid
        style={{ margin: "70px auto 10px auto" }}
        className="d-block d-md-none"
      >
        <Form
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Form.Control
            style={{ maxWidth: "400px" }}
            type="search"
            placeholder="Search articles..."
            aria-label="Search"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
          />

          <Link
            style={{
              width: "80px",
              textWrap: "nowrap",
              padding: "5px 10px",
              textDecoration: "none",
              color: "white",
              background: "#0D6EFD",
              borderRadius: "5px",
            }}
            to="/searchresult"
            onClick={() => {
              searchBlogs(keyword);
            }}
          >
            Search
          </Link>
        </Form>
      </Container>

      <Container id="top" fluid className="card-container">
        <CardGroup className="left-side-card">
          <Card
            style={{
              backgroundColor: "#151533",
              color: "white",
              border: "1px solid rgb(255,255,255,0.2)",
            }}
          >
            <Card.Img
              style={{
                height: "180px",
                objectFit: "fill",
                width: "90%",
                margin: "20px auto 5px auto",
              }}
              variant="top"
              src={blogdetails.image}
            />
            <Card.Text
              style={{
                borderRadius: "6px",
                margin: "5px auto 0 auto",
                padding: "5px auto",
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "start",
                width: "90%",
              }}
            >
              {blogdetails.title}
            </Card.Text>
            {blog_tags && blog_tags.length > 0 && (
              <Card.Text
                style={{
                  display: "flex",
                  flexDirection: "row",
                  margin: "5px auto 0 auto",
                  padding: "5px auto",
                  width: "90%",
                  gap: "10px",
                  flexWrap: "wrap",
                  justifyContent: "start",
                }}
              >
                {blog_tags.map((tag) => (
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "white",
                      border: "1px solid rgb(255,255,255,0.2)",
                      padding: "3px 20px",
                      fontSize: "14px",
                      borderRadius: "6px",
                    }}
                    key={tag.id}
                  >
                    {tag.tag_name}
                  </Link>
                ))}
              </Card.Text>
            )}

            <Card.Body>
              <Container
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "start",
                  alignItems: "start",
                  border: "1px solid rgb(255,255,255,0.2)",
                  borderRadius: "6px",
                  margin: "5px auto 0 auto",
                  width: "95%",
                }}
              >
                {blogdetails.author_profile_image !== null && (
                  <Card.Img
                    style={{
                      height: "45px",
                      width: "50px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      marginTop: "5px",
                    }}
                    variant="top"
                    src={blogdetails.author_profile_image}
                  />
                )}
                {blogdetails.author_profile_image === null && (
                  <Container
                    style={{
                      height: "45px",
                      width: "50px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      marginTop: "5px",
                      backgroundColor: "#151533",
                      border: "1px solid rgb(255,255,255,0.2)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background: "green",
                      fontSize: "22px",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {getFirstLetterOfName(blogdetails.author)}
                  </Container>
                )}
                <Container
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",
                  }}
                >
                  <Card.Text style={{ textWrap: "nowrap" }}>
                    {blogdetails.author}
                  </Card.Text>
                  <small style={{ marginTop: "-15px", textWrap: "nowrap" }}>
                    Posted on{" "}
                    {new Date(blogdetails.publishedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </small>
                </Container>
              </Container>

              <Card.Text
                style={{ width: "95%", margin: "15px auto" }}
                dangerouslySetInnerHTML={{
                  __html: blogdetails.content,
                }}
              ></Card.Text>
            </Card.Body>
            <Card.Footer
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
                border: "1px solid rgb(255,255,255,0.2)",
                width: "90%",
                margin: "5px auto",
                borderRadius: "6px",
                gap: "15px",
                flexWrap: "wrap",
              }}
            >
              {isbloglikedbyuser === true ? (
                <Button
                  style={{
                    border: "1px solid rgb(255,255,255,0.2)",
                    backgroundColor: "#151533",
                  }}
                  onClick={() => {
                    if (isLoggedIn === true) {
                      handleBlogLikes();
                    } else if (isLoggedIn === false) {
                      handleShowModalForSignUp();
                    }
                  }}
                >
                  ❤️ {blogdetails.likes}{" "}
                </Button>
              ) : (
                <Button
                  style={{
                    border: "1px solid rgb(255,255,255,0.2)",
                    backgroundColor: "#151533",
                  }}
                  onClick={() => {
                    if (isLoggedIn === true) {
                      handleBlogLikes();
                    } else if (isLoggedIn === false) {
                      handleShowModalForSignUp();
                    }
                  }}
                >
                  🤍 {blogdetails.likes}{" "}
                </Button>
              )}
              <Button
                style={{
                  border: "1px solid rgb(255,255,255,0.2)",
                  backgroundColor: "#151533",
                }}
              >
                <FaShare style={{ marginRight: "10px" }} />
                {blogdetails.shares}{" "}
              </Button>
              <Button
                style={{
                  border: "1px solid rgb(255,255,255,0.2)",
                  backgroundColor: "#151533",
                }}
                onClick={() => {
                  if (isLoggedIn === true) {
                    handleshowModalToAddComment();
                  } else if (isLoggedIn === false) {
                    handleShowModalForSignUp();
                  }
                }}
              >
                <MessageSquareMore style={{ marginRight: "10px" }} />{" "}
                {sumOfComments}
              </Button>
              {isSavedForLater === true && (
                <Button
                  style={{
                    border: "1px solid rgb(255,255,255,0.2)",
                  }}
                  onClick={() => {
                    if (isLoggedIn === true) {
                      deleteBlogSavedForLater(id);
                    } else if (isLoggedIn === false) {
                      handleShowModalForSignUp();
                    }
                  }}
                >
                  Saved
                </Button>
              )}
              {isSavedForLater === false && (
                <Button
                  style={{
                    backgroundColor: "#151533",
                    border: "1px solid rgb(255,255,255,0.2)",
                  }}
                  onClick={() => {
                    if (isLoggedIn === true) {
                      saveBlogForLater(id);
                    } else if (isLoggedIn === false) {
                      handleShowModalForSignUp();
                    }
                  }}
                >
                  Save for later
                </Button>
              )}
            </Card.Footer>
            <Card.Footer
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
                border: "1px solid rgb(255,255,255,0.2)",
                width: "90%",
                margin: "5px auto",
                borderRadius: "6px",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <Button
                style={{
                  fontSize: "16px",
                  border: "1px solid rgb(255,255,255,0.2)",
                }}
              >
                Share with friends
              </Button>

              <Button
                variant="primary"
                text={urlToBeShared}
                onClick={() => {
                  handleBlogShares("Link Copied");
                  toast.success("Link Copied");
                }}
                style={{ background: "none", border: "none" }}
              >
                <FaLink size={35} />
              </Button>

              <TelegramShareButton
                url={urlToBeShared}
                title={blogdetails.title}
                onClick={() => {
                  handleBlogShares("Telegram");
                }}
              >
                <TelegramIcon size={45} round={true} />
              </TelegramShareButton>

              <TwitterShareButton
                url={urlToBeShared}
                title={blogdetails.title}
                onClick={() => {
                  handleBlogShares("Twitter");
                }}
              >
                <XIcon size={45} round={true} />
              </TwitterShareButton>

              <FacebookMessengerShareButton
                url={urlToBeShared}
                onClick={() => {
                  handleBlogShares("Facebook");
                }}
              >
                <FacebookIcon size={45} round={true} />
              </FacebookMessengerShareButton>

              <FacebookMessengerShareButton
                url={urlToBeShared}
                onClick={() => {
                  handleBlogShares("Messenger");
                }}
              >
                <FacebookMessengerIcon size={45} round={true} />
              </FacebookMessengerShareButton>

              <LinkedinShareButton
                url={urlToBeShared}
                onClick={() => {
                  handleBlogShares("Linkedin");
                }}
              >
                <LinkedinIcon size={45} round={true} />
              </LinkedinShareButton>

              <WhatsappShareButton
                url={urlToBeShared}
                title={blogdetails.title}
                separator=":: "
                onClick={() => {
                  handleBlogShares("Whatsapp");
                }}
              >
                <WhatsappIcon size={45} round={true} />
              </WhatsappShareButton>

              <EmailShareButton
                url={urlToBeShared}
                subject={blogdetails.title}
                body="body"
                separator=" "
                onClick={() => {
                  handleBlogShares("Email");
                }}
              >
                <EmailIcon size={45} round={true} />
              </EmailShareButton>

              <RedditShareButton
                url={urlToBeShared}
                windowWidth={660}
                windowHeight={460}
                onClick={() => {
                  handleBlogShares("Reddit");
                }}
              >
                <RedditIcon size={45} round={true} />
              </RedditShareButton>
            </Card.Footer>

            <Card.Footer
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                border: "1px solid rgb(255,255,255,0.2)",
                width: "90%",
                margin: "5px auto",
                borderRadius: "6px",
              }}
            >
              <Form
                onClick={() => {
                  if (isLoggedIn === true) {
                    handleshowModalToAddComment();
                  } else if (isLoggedIn === false) {
                    handleShowModalForSignUp();
                  }
                }}
                style={{ width: "100%" }}
              >
                <Form.Group controlId="comment section">
                  <Form.Control
                    rows={2}
                    placeholder="Join the discussion"
                    style={{
                      padding: "20px auto",
                      fontSize: "20px",
                      color: "black",
                    }}
                  />
                </Form.Group>
              </Form>
            </Card.Footer>
            <Container style={{ width: "100%" }} fluid>
              {renderComments(allComments)}
            </Container>
          </Card>
        </CardGroup>

        {authorProfile && (
          <CardGroup className="right-side-card">
            <Container fluid className="author-other-blogs">
              <Card
                style={{
                  backgroundColor: "#151533",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  border: "1px solid rgb(255,255,255,0.2)",
                  borderRadius: "6px",
                  gap: "10px",
                }}
              >
                <Card.Body>
                  <Card.Title style={{ textWrap: "wrap" }}>
                    Author&apos;s Profile
                  </Card.Title>
                  <Container
                    fluid
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "start",
                      alignItems: "start",
                      border: "1px solid rgb(255,255,255,0.2)",
                      borderRadius: "6px",
                      margin: "15px auto 10px auto",
                      width: "100%",
                    }}
                  >
                    {authorProfile.profile_image !== null && (
                      <Card.Img
                        style={{
                          height: "45px",
                          width: "50px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          marginTop: "5px",
                        }}
                        variant="top"
                        src={authorProfile.profile_image}
                      />
                    )}
                    {authorProfile.profile_image === null && (
                      <Container
                        fluid
                        style={{
                          height: "45px",
                          width: "50px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          marginTop: "5px",
                          backgroundColor: "#151533",
                          border: "1px solid rgb(255,255,255,0.2)",
                          background: "green",
                          fontSize: "22px",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {getFirstLetterOfName(authorProfile.username)}
                      </Container>
                    )}
                    <Container
                      fluid
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "start",
                        alignItems: "start",
                      }}
                    >
                      <Card.Text style={{ textWrap: "wrap" }}>
                        {authorProfile.username}
                      </Card.Text>

                      {is_available_for_work === true && (
                        <small style={{ marginTop: "-15px" }}>
                          Available for work
                        </small>
                      )}
                    </Container>
                  </Container>
                  {authorProfile.biography !== "" && (
                    <Card.Text
                      style={{
                        border: "1px solid rgb(255,255,255,0.2)",
                        padding: "10px",
                        borderRadius: "6px",
                      }}
                    >
                      {authorProfile.biography}
                    </Card.Text>
                  )}

                  {authorProfile.profession !== "" && (
                    <Card.Text
                      style={{
                        border: "1px solid rgb(255,255,255,0.2)",
                        padding: "5px",
                        borderRadius: "6px",
                        marginTop: "-10px",
                      }}
                    >
                      <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                        PROFESSION :
                      </span>{" "}
                      <span style={{ marginLeft: "5px" }}>
                        {authorProfile.profession}
                      </span>
                    </Card.Text>
                  )}

                  {authorProfile.education !== "" && (
                    <Card.Text
                      style={{
                        border: "1px solid rgb(255,255,255,0.2)",
                        padding: "5px",
                        borderRadius: "6px",
                        marginTop: "-10px",
                      }}
                    >
                      <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                        EDUCATION :
                      </span>{" "}
                      <span style={{ marginLeft: "5px" }}>
                        {authorProfile.education}
                      </span>
                    </Card.Text>
                  )}

                  {authorProfile.location !== "" && (
                    <Card.Text
                      style={{
                        border: "1px solid rgb(255,255,255,0.2)",
                        padding: "5px",
                        borderRadius: "6px",
                        marginTop: "-10px",
                      }}
                    >
                      <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                        LOCATION :
                      </span>{" "}
                      <span style={{ marginLeft: "5px" }}>
                        {authorProfile.location}
                      </span>
                    </Card.Text>
                  )}

                  {authorProfile.personal_website_link !== "" && (
                    <Card.Text
                      style={{
                        border: "1px solid rgb(255,255,255,0.2)",
                        padding: "5px",
                        borderRadius: "6px",
                        marginTop: "-10px",
                      }}
                    >
                      <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                        PERSONAL WEBSITE :
                      </span>{" "}
                      <span style={{ marginLeft: "5px" }}>
                        {authorProfile.personal_website_link}
                      </span>
                    </Card.Text>
                  )}

                  {is_email_public === true && (
                    <Card.Text
                      style={{
                        border: "1px solid rgb(255,255,255,0.2)",
                        padding: "5px",
                        borderRadius: "6px",
                        marginTop: "-10px",
                      }}
                    >
                      <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                        EMAIL :
                      </span>{" "}
                      <span style={{ marginLeft: "5px" }}>
                        {authorProfile.email}
                      </span>
                    </Card.Text>
                  )}
                  {authorProfile.is_blogger === true && (
                    <small
                      style={{
                        margin: "5px auto",
                        display: "block",
                        textAlign: "center",
                      }}
                    >
                      Blogger since{" "}
                      {new Date(authorProfile.createdAt).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                        }
                      )}
                    </small>
                  )}
                </Card.Body>
              </Card>

              {moreBlogsBySameAuthor && moreBlogsBySameAuthor.length > 0 && (
                <Card
                  style={{
                    backgroundColor: "#151533",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",

                    borderRadius: "6px",
                    gap: "10px",
                  }}
                >
                  <Card.Body>
                    <Card.Title
                      style={{
                        textWrap: "wrap",
                        textAlign: "center",
                        margin: "15px auto 25px auto",
                        width: "100%",
                      }}
                    >
                      More blogs from {authorProfile.username}
                    </Card.Title>
                    {moreBlogsBySameAuthor.map((blog) => (
                      <>
                        <ScrollIntoView selector="#top">
                          <Card.Text
                            to={`/readblog/${blog.id}`}
                            as={Link}
                            key={blog.id}
                            style={{
                              border: "1px solid rgb(255,255,255,0.2)",
                              padding: "5px 10px",
                              borderRadius: "6px",
                              fontWeight: "bold",
                              display: "block",
                              margin: "10px auto",
                              textDecoration: "none",
                              color: "white",
                              width: "80vw",
                            }}
                          >
                            {blog.title}
                            <small
                              style={{
                                margin: "5px auto",
                                display: "block",
                                textAlign: "start",
                              }}
                            >
                              Posted on{" "}
                              {new Date(blog.publishedAt).toLocaleString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </small>
                          </Card.Text>
                        </ScrollIntoView>
                      </>
                    ))}
                  </Card.Body>
                </Card>
              )}
            </Container>
          </CardGroup>
        )}
      </Container>
      {blogsByOtherAuthors.length > 0 && blogsByOtherAuthors && (
        <>
          <Container
            fluid
            style={{
              border: "1px solid rgb(255,255,255,0.2)",
              width: "100%",
              textAlign: "center",
              borderRadius: "6px",
              margin: "40px auto 10px auto",
            }}
          >
            Read next
          </Container>
          <Row
            style={{ margin: "10px auto 10px auto" }}
            xs={1}
            sm={2}
            md={3}
            className="blog-grid g-3"
          >
            {blogsByOtherAuthors.map((blog) => (
              <ScrollIntoView selector="#top" key={blog.id}>
                <Link
                  to={`/readblog/${blog.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Col>
                    <Card
                      style={{
                        backgroundColor: "#151533",
                        color: "white",
                        border: "1px solid rgb(255,255,255,0.2)",
                        borderRadius: "6px",
                        gap: "5px",
                      }}
                    >
                      <Card.Img
                        style={{
                          height: "130px",
                          objectFit: "fill",
                          width: "90%",
                          margin: "10px auto 5px auto",
                        }}
                        variant="top"
                        src={blog.image}
                      />
                      <Card.Text
                        style={{
                          borderRadius: "6px",
                          margin: "5px auto 0 auto",
                          padding: "5px auto",
                          fontSize: "16px",
                          fontWeight: "bold",
                          textAlign: "start",
                          width: "90%",
                        }}
                      >
                        {blog.title}
                      </Card.Text>
                      <Card.Body>
                        <Container
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "start",
                            alignItems: "start",
                            border: "1px solid rgb(255,255,255,0.2)",
                            borderRadius: "6px",
                            margin: "-5px auto 0 auto",
                          }}
                        >
                          {blog.author_profile_image !== null && (
                            <Card.Img
                              style={{
                                height: "50px",
                                width: "60px",
                                objectFit: "cover",
                                borderRadius: "50%",
                                marginTop: "5px",
                              }}
                              variant="top"
                              src={blog.author_profile_image}
                            />
                          )}
                          {blog.author_profile_image === null && (
                            <Container
                              style={{
                                height: "50px",
                                width: "60px",
                                objectFit: "cover",
                                borderRadius: "50%",
                                marginTop: "5px",
                                backgroundColor: "#151533",
                                border: "1px solid rgb(255,255,255,0.2)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                background: "green",
                                fontSize: "22px",
                                color: "white",
                                fontWeight: "bold",
                              }}
                            >
                              {getFirstLetterOfName(blog.author)}
                            </Container>
                          )}
                          <Container
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "start",
                            }}
                          >
                            <Card.Text style={{ textWrap: "nowrap" }}>
                              {blog.author}
                            </Card.Text>
                            <small
                              style={{ marginTop: "-15px", textWrap: "nowrap" }}
                            >
                              Posted on{" "}
                              {new Date(blog.publishedAt).toLocaleString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </small>
                          </Container>
                        </Container>
                      </Card.Body>

                      <Card.Body
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          margin: "-15px auto 0 auto",
                          justifyContent: "start",
                          alignItems: "start",
                          gap: "5px",
                          width: "100%",
                        }}
                      >
                        <Button
                          style={{
                            backgroundColor: "#151533",
                            margin: "-15px auto 0 auto",
                            border: "1px solid rgb(255,255,255,0.2)",
                            width: "120px",
                            textWrap: "nowrap",
                          }}
                        >
                          {blog.likes} ❤️
                        </Button>
                        <Button
                          style={{
                            backgroundColor: "#151533",
                            margin: "-15px auto 0 auto",
                            border: "1px solid rgb(255,255,255,0.2)",
                            width: "120px",
                            textWrap: "nowrap",
                          }}
                        >
                          {blog.views} Views
                        </Button>
                        <Button
                          style={{
                            backgroundColor: "#151533",
                            margin: "-15px auto 0 auto",
                            border: "1px solid rgb(255,255,255,0.2)",
                            width: "120px",
                            textWrap: "nowrap",
                          }}
                        >
                          {blog.shares} Shares
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Link>
              </ScrollIntoView>
            ))}
          </Row>
        </>
      )}
      <Modal centered show={showModalToEditComment} onHide={handleClose}>
        <Modal.Body style={{ backgroundColor: "#151533" }}>
          <Form onSubmit={editComment}>
            <Form.Group className="mb-3" controlId="editForm.ControlInput1">
              <Form.Label>Edit your comment...</Form.Label>
            </Form.Group>
            <Form.Group className="mb-3" controlId="editForm.ControlTextarea1">
              <Form.Control
                value={commentForEdit}
                onChange={(e) => {
                  setCommentForEdit(e.target.value);
                }}
                as="textarea"
                rows={3}
                autoFocus
              />
            </Form.Group>

            <Container
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                style={{ marginRight: "15px" }}
                type="submit"
                variant="primary"
                onClick={handleClose}
              >
                Submit
              </Button>
              <Button style={{ backgroundColor: "red" }} onClick={handleClose}>
                Cancel
              </Button>
            </Container>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        centered
        show={showModalToAddComment}
        onHide={handleCloseModalToAddComment}
      >
        <Modal.Body style={{ backgroundColor: "#151533" }}>
          <Form onSubmit={handleAddComment}>
            <Form.Group className="mb-3" controlId="AddComment.ControlInput1">
              {topLevelCommentID !== "" && (
                <Form.Label>You are replying to {replyingTo}</Form.Label>
              )}
              {topLevelCommentID === "" && (
                <Form.Label>Write your comment</Form.Label>
              )}
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="AddComment.ControlTextarea1"
            >
              <Form.Control
                value={commentBody}
                onChange={(e) => {
                  setcommentBody(e.target.value);
                }}
                as="textarea"
                rows={3}
                placeholder="write your comment here...."
                autoFocus
              />
            </Form.Group>
            <Container
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                type="submit"
                variant="primary"
                // onClick={handleCloseModalToAddComment}
              >
                Submit
              </Button>
              <Button
                style={{ backgroundColor: "red" }}
                onClick={() => {
                  setTopLevelCommentID("");
                  handleCloseModalToAddComment();
                }}
              >
                Cancel
              </Button>
            </Container>
          </Form>
        </Modal.Body>
      </Modal>
      <Footer />
    </>
  );
}

export default ReadBlogs;
