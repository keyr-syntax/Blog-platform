import { BlogContext } from "./ContextProvider.jsx";
import { useContext, useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./ManageBlog.css";

function ScheduledBlogs() {
  const { blogcontent, fetchallblogs, BACKEND_API, setBlogcontent } =
    useContext(BlogContext);
  const [scheduledFor, setScheduledFor] = useState(new Date());
  const [id, setId] = useState("");
  const [blogSchedulerModal, setBlogSchedulerModal] = useState(false);
  const handleCloseBlogSchedulerModal = () => setBlogSchedulerModal(false);
  const handleShowBlogSchedulerModal = () => setBlogSchedulerModal(true);

  useEffect(() => {
    fetchScheduledBlogs();
  }, []);

  const fetchScheduledBlogs = async () => {
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(`${BACKEND_API}/api/blog/scheduled`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await data.json();
      if (response.success === true) {
        setBlogcontent(response.post);
      } else if (response.success === false) {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error while fetching blog views count", error);
    }
  };
  const handleUpdateBlog = async (id, updateBlog) => {
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(`${BACKEND_API}/api/blog/publishblog/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isPublished: updateBlog.isPublished,
          isDraft: updateBlog.isDraft,
        }),
      });

      const response = await data.json();
      if (response.success === true) {
        setBlogcontent(response.post);
        fetchScheduledBlogs();

        const published = response.post.isPublished;
        {
          published === true && toast.success("Blog published successfully");
        }
        {
          published === false && toast.success("Blog saved as draft");
        }
      } else if (response.success === false) {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error while updating blog", error);
    }
  };
  const changeBlogSchedule = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(
        `${BACKEND_API}/api/blog/changeblogschedule/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            scheduledFor: scheduledFor.toISOString(),
          }),
        }
      );

      const response = await data.json();
      if (response.success === true) {
        fetchScheduledBlogs();
        toast.success(response.message);
        handleCloseBlogSchedulerModal();
      } else if (response.success === false) {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error while updating blog", error);
    }
  };
  const deletetaskbypk = async (id) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are You Sure?")) {
      try {
        const data = await fetch(`${BACKEND_API}/api/blog/deleteblog/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const response = await data.json();
        if (response.success === true) {
          fetchallblogs();

          toast.success(response.message);
        } else if (response.success === false) {
          toast.error(response.message);
        }
      } catch (error) {
        console.log("Error while deleting post", error);
      }
    }
  };

  return (
    <>
      {" "}
      {blogcontent && blogcontent.length > 0 ? (
        <>
          <p
            style={{
              margin: "80px auto 20px auto",
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            All of your scheduled blogs appear here
          </p>{" "}
          <Table
            style={{
              margin: "10px auto 250px auto",
              width: "90%",
            }}
            responsive="lg"
          >
            <thead>
              <tr style={{ textWrap: "nowrap", textAlign: "start" }}>
                <th>Blog ID</th>
                <th>Title</th>
                <th>Will be published on</th>
                <th>Manage blog</th>
              </tr>
            </thead>
            <tbody>
              {blogcontent.map(
                (blog) =>
                  blog && (
                    <tr style={{ textWrap: "wrap" }} key={blog.id}>
                      <td>{blog.id}</td>
                      <td>{blog.title}</td>

                      <td>
                        {new Date(blog.scheduledFor).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </td>
                      <td>
                        <Dropdown
                          className="manage-blog-dropdown"
                          style={{
                            margin: "15px auto",
                          }}
                        >
                          <Dropdown.Toggle
                            style={{
                              backgroundColor: "#151533",
                              border: "none",
                              borderRadius: "4px",
                              padding: "5px 30px",
                              width: "95%",
                            }}
                            id="dropdown-basic"
                          >
                            Actions
                          </Dropdown.Toggle>

                          <Dropdown.Menu
                            style={{
                              width: "95%",
                              color: "white",
                              backgroundColor: "#151533",
                            }}
                          >
                            {blog.isScheduled && (
                              <Dropdown.Item
                                style={{
                                  color: "white",
                                  border: "1px solid rgb(255,255,255,0.2)",
                                  marginBottom: "3px",
                                }}
                                onClick={() => {
                                  setId(blog.id);
                                  handleShowBlogSchedulerModal();
                                }}
                              >
                                Change schedule
                              </Dropdown.Item>
                            )}
                            <Dropdown.Item
                              style={{
                                color: "white",
                                border: "1px solid rgb(255,255,255,0.2)",
                                marginBottom: "3px",
                              }}
                              as={Link}
                              to={`/readblog/${blog.id}`}
                            >
                              Open blog
                            </Dropdown.Item>
                            <Dropdown.Item
                              style={{
                                color: "white",
                                border: "1px solid rgb(255,255,255,0.2)",
                                marginBottom: "3px",
                              }}
                              as={Link}
                              to={`/editblog/${blog.id}`}
                            >
                              Edit blog
                            </Dropdown.Item>
                            {blog.isPublished === false && (
                              <Dropdown.Item
                                style={{
                                  color: "white",
                                  border: "1px solid rgb(255,255,255,0.2)",
                                  marginBottom: "3px",
                                }}
                                onClick={() => {
                                  const updateBlog = {
                                    isPublished: true,
                                    isDraft: false,
                                  };
                                  handleUpdateBlog(blog.id, updateBlog);
                                }}
                              >
                                Publish blog
                              </Dropdown.Item>
                            )}
                            {blog.isPublished === true && (
                              <Dropdown.Item
                                style={{
                                  color: "white",
                                  border: "1px solid rgb(255,255,255,0.2)",
                                  marginBottom: "3px",
                                }}
                                as={Link}
                                onClick={() => {
                                  const updateBlog = {
                                    isPublished: false,
                                    isDraft: true,
                                  };
                                  handleUpdateBlog(blog.id, updateBlog);
                                }}
                              >
                                Save as Draft
                              </Dropdown.Item>
                            )}

                            <Dropdown.Item
                              style={{
                                color: "white",
                                border: "1px solid rgb(255,255,255,0.2)",
                                marginBottom: "3px",
                              }}
                              as={Link}
                              onClick={() => {
                                deletetaskbypk(blog.id);
                              }}
                            >
                              Delete blog
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </Table>
        </>
      ) : (
        <div
          style={{
            margin: "160px auto",
            width: "90%",
            border: "1px solid rgb(255,255,255,0.2)",
            textAlign: "center",
            padding: "30px",
            fontSize: "22px",
            borderRadius: "6px",
          }}
        >
          You have no scheduled blogs
        </div>
      )}
      <Modal
        show={blogSchedulerModal}
        onHide={handleCloseBlogSchedulerModal}
        centered
      >
        <Modal.Body style={{ backgroundColor: "#151533" }}>
          <Form onSubmit={changeBlogSchedule}>
            <Form.Group className="mb-3" controlId="blog scheduler">
              <Form.Label
                style={{
                  fontSize: "20px",
                  margin: "15px auto",
                  textAlign: "center",
                }}
              >
                Schedule your blog
              </Form.Label>
              <Form.Control
                type="datetime-local"
                placeholder="schedule your blog to be published"
                name="datetime-local"
                min={new Date().toISOString().slice(0, 16)}
                value={scheduledFor.toISOString().slice(0, 16)}
                selected={scheduledFor}
                onChange={(event) => {
                  const localDateString = event.target.value;
                  const localDate = new Date(localDateString);
                  const utcDate = new Date(
                    Date.UTC(
                      localDate.getFullYear(),
                      localDate.getMonth(),
                      localDate.getDate(),
                      localDate.getHours(),
                      localDate.getMinutes(),
                      localDate.getSeconds()
                    )
                  );
                  setScheduledFor(utcDate);
                }}
              />
            </Form.Group>
            <Button
              type="submit"
              style={{
                display: "block",
                backgroundColor: "#151533",
                margin: "10px auto 10px auto",
                width: "45%",
              }}
            >
              Submit
            </Button>
            <Button
              type="button"
              style={{
                display: "block",
                backgroundColor: "#151533",
                margin: "10px auto 10px auto",
                width: "45%",
              }}
              onClick={() => {
                handleCloseBlogSchedulerModal();
              }}
            >
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ScheduledBlogs;
