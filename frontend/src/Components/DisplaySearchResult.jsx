import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import "./HomePageListOfBlogs.css";
import { BlogContext } from "./ContextProvider.jsx";
import { useContext } from "react";
import { Eye } from "lucide-react";
import { FaShare } from "react-icons/fa";

function DisplaySearchResult() {
  const {
    searchResult,
    keyword,
    tag_keyword,
    setKeyword,
    setTag_keyword,
    searchBlogs,
    displaySearchResult,
    displaySearchResultByTag,
    setDisplaySearchResult,
    setDisplaySearchResultByTag,
  } = useContext(BlogContext);

  const getFirstLetterOfName = (username) => username.charAt(0).toUpperCase();

  return (
    <>
      <Container
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
              setTag_keyword("");
              setDisplaySearchResult(false);
              setDisplaySearchResultByTag(false);
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
            onClick={() => {
              searchBlogs(keyword);
            }}
          >
            Search
          </Link>
        </Form>
      </Container>

      {searchResult && searchResult.length > 0 && (
        <>
          <Container style={{ margin: "70px auto 10px auto" }}>
            {displaySearchResult && (
              <h4 style={{ color: "white", textAlign: "center" }}>
                {searchResult.length} Search Results for &quot;{keyword}&quot;
              </h4>
            )}
            {displaySearchResultByTag && (
              <h4 style={{ color: "white", textAlign: "center" }}>
                {searchResult.length} Search Results for &quot;{tag_keyword}
                &quot;
              </h4>
            )}
          </Container>
          <Row
            style={{ margin: "1px auto 10px auto" }}
            xs={1}
            sm={2}
            md={3}
            className="blog-grid g-3"
          >
            {searchResult.map((blog) => (
              <Link
                to={`/readblog/${blog.id}`}
                style={{ textDecoration: "none" }}
                key={blog.id}
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
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "5px",
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
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "5px",
                        }}
                      >
                        {blog.views} <Eye />
                      </Button>
                      <Button
                        style={{
                          backgroundColor: "#151533",
                          margin: "-15px auto 0 auto",
                          border: "1px solid rgb(255,255,255,0.2)",
                          width: "120px",
                          textWrap: "nowrap",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "5px",
                        }}
                      >
                        {blog.shares} <FaShare />
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Link>
            ))}
          </Row>
        </>
      )}
      {searchResult && searchResult.length === 0 && (
        <Container style={{ margin: "70px auto 10px auto" }}>
          <h4 style={{ color: "white", textAlign: "center" }}>
            No Blogs Found
          </h4>
        </Container>
      )}
    </>
  );
}

export default DisplaySearchResult;
