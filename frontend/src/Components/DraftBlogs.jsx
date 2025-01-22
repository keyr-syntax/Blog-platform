import { BlogContext } from "./ContextProvider.jsx";
import { useContext, useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Table from "react-bootstrap/Table";

function DraftBlogs() {
  const { fetchallblogs, BACKEND_API, fetchTopBlogs } = useContext(BlogContext);
  const [draftBlogList, setDraftBlogList] = useState([]);

  useEffect(() => {
    fetchBlogsSavedAsDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBlogsSavedAsDraft = async () => {
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(`${BACKEND_API}/api/blog/fetchdraftblogs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await data.json();
      if (response.success === true) {
        setDraftBlogList(response.post);
        fetchTopBlogs();
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
        setDraftBlogList(post);
        fetchBlogsSavedAsDraft();
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
          fetchBlogsSavedAsDraft();
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
      {draftBlogList && draftBlogList.length > 0 ? (
        <>
          <p
            style={{
              margin: "80px auto 20px auto",
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            All of your draft blogs appear here
          </p>
          <Table
            style={{
              margin: "10px auto 250px auto",
              width: "90%",
            }}
            responsive="lg"
          >
            <thead>
              <tr style={{ textWrap: "nowrap", textAlign: "center" }}>
                <th>Blog ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Created on</th>
                <th>Manage blog</th>
              </tr>
            </thead>
            <tbody>
              {draftBlogList.map(
                (blog) =>
                  blog && (
                    <tr style={{ textWrap: "wrap" }} key={blog.id}>
                      <td>{blog.id}</td>
                      <td>{blog.title}</td>
                      <td>{blog.isDraft ? "Draft" : "Published"}</td>
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
                                Save as draft
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
          You have no blogs saved as draft
        </div>
      )}
    </>
  );
}

export default DraftBlogs;
