import Card from "react-bootstrap/Card";
import { BlogContext } from "./ContextProvider.jsx";
import { useContext } from "react";

function SearchResult() {
  const { searchResult } = useContext(BlogContext);

  return (
    <>
      {searchResult &&
        searchResult.length > 0 &&
        searchResult.map(
          (blog) =>
            blog &&
            blog.isPublished === true && (
              <>
                <Card key={blog.id} className="blog-card-search">
                  <>
                    <Card.Img
                      className="blog-card-img img-fluid"
                      variant="top"
                      src={blog.image}
                    />
                    <div className="blog-container-search">
                      <h3 className="blog-card-title-search">{blog.title}</h3>
                      <p className="blog-card-text-search">
                        Written by:{blog.author}
                      </p>
                      <div
                        className="blog-content-search"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                      ></div>
                    </div>
                  </>
                </Card>
              </>
            )
        )}
    </>
  );
}

export default SearchResult;
