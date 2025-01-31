const searchBlogs = async (keyword) => {
  try {
    setTag_keyword("");
    setDisplaySearchResult(false);
    setDisplaySearchResultByTag(false);
    const data = await fetch(
      `${BACKEND_API}/api/blog/searchblogs?keyword=${encodeURIComponent(
        keyword
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = await data.json();
    if (response.success === true) {
      setSearchResult(response.post);
      setDisplaySearchResult(true);
      navigate("/searchresult");
    } else if (response.success === false) {
      toast.error(response.message);
    }
  } catch (error) {
    console.log("Error while fetching search result", error);
  }
};
const searchBlogsByTag = async (tag_keyword) => {
  try {
    setKeyword("");
    setDisplaySearchResultByTag(false);
    setDisplaySearchResult(false);
    const data = await fetch(
      `${BACKEND_API}/api/blog/searchblogsbytagname?tag_keyword=${encodeURIComponent(
        tag_keyword
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = await data.json();
    if (response.success === true) {
      setSearchResult(response.blogsByTagName);
      setDisplaySearchResultByTag(true);
    } else if (response.success === false) {
      setSearchResult([]);
      setDisplaySearchResultByTag(true);
    }
  } catch (error) {
    console.log("Error while fetching search result", error);
  }
};
