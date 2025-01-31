import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import "./HomePageListOfBlogs.css";
import { BlogContext } from "./ContextProvider.jsx";
import { useContext, useEffect, useRef, useState } from "react";
import Footer from "./Footer.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Eye } from "lucide-react";
import { FaShare } from "react-icons/fa";
function HomePageListOfBlogs() {
  const {
    blogcontent,
    keyword,
    setKeyword,
    searchBlogs,
    setTag_keyword,
    searchBlogsByTag,
    topBlogsList,
    allBlogTags,
  } = useContext(BlogContext);
  const tagsContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const checkScrollButtons = () => {
      if (tagsContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          tagsContainerRef.current;
        const newCanScrollLeft = scrollLeft > 0;
        const newCanScrollRight = scrollLeft + clientWidth < scrollWidth;

        setCanScrollLeft(newCanScrollLeft);
        setCanScrollRight(newCanScrollRight);
      }
    };

    const currentRef = tagsContainerRef.current;
    if (currentRef) {
      checkScrollButtons();
      currentRef.addEventListener("scroll", checkScrollButtons);
      const resizeObserver = new ResizeObserver(checkScrollButtons);
      resizeObserver.observe(currentRef);
      return () => {
        currentRef.removeEventListener("scroll", checkScrollButtons);
        resizeObserver.unobserve(currentRef);
      };
    }
  }, [allBlogTags]);

  const scrollTags = (direction) => {
    if (tagsContainerRef.current) {
      const container = tagsContainerRef.current;
      const scrollAmount =
        direction === "left"
          ? container.scrollLeft - container.clientWidth
          : container.scrollLeft + container.clientWidth;

      container.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };
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
      {allBlogTags && allBlogTags.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "25px auto 10px auto",
            width: "95%",
            justifyContent: "start",
          }}
        >
          {(canScrollLeft || allBlogTags.length > 5) && (
            <button
              onClick={() => scrollTags("left")}
              className="horizontal-scroll-button"
            >
              <ChevronLeft color="white" size={30} />
            </button>
          )}

          <Container
            ref={tagsContainerRef}
            className="horizontal-scroll"
            style={{
              display: "flex",
              flexDirection: "row",
              overflowX: "auto",
              border: "1px solid rgb(255,255,255,0.2)",
              borderRadius: "6px",
              padding: "10px",
              width: "100%",
              scrollBehavior: "smooth",
            }}
          >
            {allBlogTags.map((tag) => (
              <Link
                key={tag.id}
                style={{
                  color: "white",
                  textDecoration: "none",
                  textWrap: "nowrap",
                  margin: "0 10px",
                  border: "1px solid rgb(255,255,255,0.2)",
                  padding: "2px 10px",
                  borderRadius: "6px",
                  flexShrink: 0,
                }}
                to="/searchresult"
                onClick={() => {
                  searchBlogsByTag(tag.tag_name);
                  setTag_keyword(tag.tag_name);
                }}
              >
                {tag.tag_name}
              </Link>
            ))}
          </Container>

          {(canScrollRight || allBlogTags.length > 5) && (
            <button
              onClick={() => scrollTags("right")}
              className="horizontal-scroll-button"
            >
              <ChevronRight color="white" size={30} />
            </button>
          )}
        </div>
      )}
      {blogcontent.length > 0 && blogcontent && (
        <>
          <Container
            fluid
            style={{
              width: "95%",
              textAlign: "center",
              borderRadius: "6px",
              margin: "40px auto 10px auto",
              fontSize: "35px",
            }}
          >
            Latest blogs
          </Container>
          <Row
            style={{ margin: "10px auto 10px auto" }}
            xs={1}
            sm={2}
            md={3}
            className="blog-grid g-3"
          >
            {blogcontent.map((blog) => (
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
                          // border: "1px solid rgb(255,255,255,0.2)",
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
      )}{" "}
      {topBlogsList.length > 0 && topBlogsList && (
        <>
          <Container
            fluid
            style={{
              width: "100%",
              textAlign: "center",
              borderRadius: "6px",
              margin: "40px auto 10px auto",
              fontSize: "35px",
            }}
          >
            Trending blogs
          </Container>
          <Row
            style={{ margin: "10px auto 10px auto" }}
            xs={1}
            sm={2}
            md={3}
            className="blog-grid g-3"
          >
            {topBlogsList.map((blog) => (
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
                        height: "180px",
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
                          // border: "1px solid rgb(255,255,255,0.2)",
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
      <Footer />
    </>
  );
}

export default HomePageListOfBlogs;
