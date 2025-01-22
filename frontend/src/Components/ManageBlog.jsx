import { BlogContext } from "./ContextProvider.jsx";
import { useContext, useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Table from "react-bootstrap/Table";
import "./ManageBlog.css";

function ManageBlog() {
  const { fetchallblogs, BACKEND_API, fetchTopBlogs } = useContext(BlogContext);
  const [publishedBlogList, setPublishedBlogList] = useState([]);

  useEffect(() => {
    fetchAllBlogsByAuthorName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllBlogsByAuthorName = async () => {
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(
        `${BACKEND_API}/api/blogviews/fetchblogsbyauthorname`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await data.json();
      if (response.success === true) {
        setPublishedBlogList(response.post);
        console.log("Manage Blogs", response.post);
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
        const post = response.post;
        setPublishedBlogList(post);
        fetchallblogs();
        fetchAllBlogsByAuthorName();
        fetchTopBlogs();
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
          fetchAllBlogsByAuthorName();
          fetchTopBlogs();
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
      {publishedBlogList && publishedBlogList.length > 0 && (
        <>
          <p
            style={{
              margin: "80px auto 20px auto",
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            All of your published blogs appear here
          </p>
          <Table
            style={{
              margin: "10px auto 250px auto",
              width: "90%",
            }}
            responsive="lg"
          >
            <thead>
              <tr
                style={{
                  textWrap: "nowrap",
                  textAlign: "start",
                  fontSize: "18px",
                }}
              >
                <th>Blog ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Published on</th>
                <th>Manage blog</th>
              </tr>
            </thead>
            <tbody>
              {publishedBlogList.map(
                (blog) =>
                  blog && (
                    <tr
                      style={{ textWrap: "wrap", color: "black" }}
                      key={blog.id}
                    >
                      <td>{blog.id}</td>
                      <td>{blog.title}</td>
                      {blog.isPublished &&
                        blog.isDraft === false &&
                        blog.isScheduled === false && <td>Published</td>}
                      <td>
                        {new Date(blog.createdAt).toLocaleString("en-US", {
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
      )}
      {publishedBlogList && publishedBlogList.length === 0 && (
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
          No published blogs
        </div>
      )}
    </>
  );
}

export default ManageBlog;
