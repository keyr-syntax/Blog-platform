import { BlogContext } from "./ContextProvider.jsx";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
function BlogsSavedForLater() {
  const {
    deleteBlogSavedForLater,
    listOfBlogsSavedForLater,
    fetchBlogsSavedForLater,
  } = useContext(BlogContext);

  useEffect(() => {
    fetchBlogsSavedForLater();
  }, []);
  const getFirstLetterOfName = (username) => username.charAt(0).toUpperCase();
  return (
    <>
      {listOfBlogsSavedForLater && listOfBlogsSavedForLater.length > 0 ? (
        <>
          <p
            style={{
              margin: "80px auto 20px auto",
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            Your saved blogs appear here
          </p>
          <Row
            style={{ margin: "10px auto 10px auto" }}
            xs={1}
            sm={2}
            md={3}
            className="blog-grid g-3"
          >
            {listOfBlogsSavedForLater.map((blog) => (
              <Col key={blog.id}>
                <Card
                  style={{
                    backgroundColor: "#151533",
                    color: "white",
                    border: "1px solid rgb(255,255,255,0.2)",
                    borderRadius: "6px",
                    gap: "5px",
                  }}
                >
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
                          {new Date(blog.publishedAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
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
                    <Link
                      to={`/readblog/${blog.id}`}
                      style={{
                        backgroundColor: "green",
                        textDecoration: "none",
                        color: "white",
                        padding: "3px 20px",
                        borderRadius: "6px",
                      }}
                    >
                      Read
                    </Link>
                    <Button
                      style={{ backgroundColor: "red" }}
                      onClick={() => {
                        deleteBlogSavedForLater(blog.id);
                      }}
                    >
                      Remove
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
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
          Your reading list is empty
        </div>
      )}
    </>
  );
}

export default BlogsSavedForLater;
