import { createContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const BlogContext = createContext();
// eslint-disable-next-line react/prop-types
function ContextProvider({ children }) {
  const BACKEND_API = "http://localhost:5000";
  const [username, setUsername] = useState("syntax blog");
  const [email, setEmail] = useState("syntax@gmail.com");
  const [password, setPassword] = useState("admin");
  const [blogcontent, setBlogcontent] = useState([]);
  const [imagelist, setImagelist] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loggedInUserName, setLoggedInUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(true);
  const [isBlogger, setIsBlogger] = useState(false);
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [blogdetails, setBlogdetails] = useState("");
  const [keyword, setKeyword] = useState("");
  const [tag_keyword, setTag_keyword] = useState("");
  const [isSavedForLater, setIsSavedForLater] = useState(false);
  const [listOfBlogsSavedForLater, setListOfBlogsSavedForLater] = useState([]);
  const [topBlogsList, setTopBlogsList] = useState([]);
  const [blogsByOtherAuthors, setBlogsByOtherAuthors] = useState([]);
  const [allBlogTags, setAllBlogTags] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [countNotificationNotSeen, setCountNotificationNotSeen] = useState("");
  const [showModalForSignUp, setShowModalForSignUp] = useState(false);
  const handleCloseModalForSignUp = () => setShowModalForSignUp(false);
  const handleShowModalForSignUp = () => setShowModalForSignUp(true);
  const [showModalForLogin, setShowModalForLogin] = useState(false);
  const handleCloseModalForLogin = () => setShowModalForLogin(false);
  const handleShowModalForLogin = () => setShowModalForLogin(true);
  const [displaySearchResult, setDisplaySearchResult] = useState(false);
  const [displaySearchResultByTag, setDisplaySearchResultByTag] =
    useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    handleLoginUser();
    userAuthentication();
    fetchAllBlogTags();
    fetchallblogs();
    fetchTopBlogs();
  }, []);
  const userAuthentication = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const data = await fetch(`${BACKEND_API}/api/user/authenticate`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const response = await data.json();
        if (response.success === true) {
          setLoggedInUserName(response.user.username);
          setIsLoggedIn(true);
          setIsUserAdmin(response.user.isAdmin);
          setUserProfilePicture(response.user.profile_image);
          setIsBlogger(response.user.is_blogger);
          fetchNotificationsForLoggedInUser();
        }
      } catch (error) {
        console.log("Error while authenticating", error.message);
      }
    }
  };
  const handleUserLogout = () => {
    localStorage.removeItem("token");
    setLoggedInUserName("");
    setIsLoggedIn(false);
    setIsUserAdmin(false);
    setUserProfilePicture(null);
    setIsBlogger(false);
    toast.success("Logged-out");
  };
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

  const fetchallblogs = async () => {
    try {
      const data = await fetch(`${BACKEND_API}/api/blog/fetchallblogs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await data.json();
      if (response.success === true) {
        setBlogcontent(response.post);
      } else if (response.success === false) {
        setBlogcontent([]);
      }
    } catch (error) {
      console.log("Error while fetching all blogs", error);
    }
  };
  const fetchblogsByOtherAuthors = async (authorID) => {
    try {
      const data = await fetch(
        `${BACKEND_API}/api/blog/blogsbyotherauthors/${authorID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const response = await data.json();
      if (response.success === true) {
        setBlogsByOtherAuthors(response.post);
      } else if (response.success === false) {
        setBlogsByOtherAuthors([]);
      }
    } catch (error) {
      console.log("Error while fetching", error);
    }
  };
  const fetchallimages = async () => {
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(`${BACKEND_API}/api/image/fetchallimages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await data.json();

      if (response.success === true) {
        setImagelist(response.image);
      } else if (response.success === false) {
        setImagelist([]);
      }
    } catch (error) {
      console.log("Error while fetching all images", error);
    }
  };
  const handleLoginUser = async () => {
    try {
      const data = await fetch(`${BACKEND_API}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const response = await data.json();

      if (response.success === true) {
        toast.success(response.message);
        localStorage.setItem("token", response.token);
        setEmail("");
        setUsername("");
        setPassword("");
        userAuthentication();
      } else if (response.success === false) {
        toast.success(response.message);
      }
    } catch (error) {
      console.log("Error during login", error);
    }
  };
  const saveBlogForLater = async (blogID) => {
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(
        `${BACKEND_API}/api/saveblogforlater/saveblogforlater/${blogID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await data.json();
      if (response.success === true) {
        setIsSavedForLater(response.isSavedForLater);
        toast.success("Saved for later");
      } else if (response.success === false) {
        setIsSavedForLater(false);
      }
    } catch (error) {
      console.log("Error while saving blog for later", error);
    }
  };
  const deleteBlogSavedForLater = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(
        `${BACKEND_API}/api/saveblogforlater/deleteblogsavedforlater/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await data.json();
      if (response.success === true) {
        toast.success("Deleted");
        setIsSavedForLater(false);
        fetchBlogsSavedForLater();
      }
    } catch (error) {
      console.log("Error while deleting blogs saved for later", error);
    }
  };
  const fetchBlogsSavedForLater = async () => {
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(
        `${BACKEND_API}/api/saveblogforlater/fetchallblogsavedforlater`,
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
        setListOfBlogsSavedForLater(response.blogSavedForLater);
      } else if (response.success === false) {
        setListOfBlogsSavedForLater([]);
      }
    } catch (error) {
      console.log("Error while fetching blog views count", error);
    }
  };
  const fetchTopBlogs = async () => {
    try {
      const data = await fetch(`${BACKEND_API}/api/blog/fetchtopblogs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await data.json();
      if (response.success === true) {
        setTopBlogsList(response.post);
      }
    } catch (error) {
      console.log("Error while fetching all blogs", error);
    }
  };
  const fetchAllBlogTags = async () => {
    try {
      const data = await fetch(`${BACKEND_API}/api/tags/fetchalltags`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await data.json();
      if (response.success === true) {
        setAllBlogTags(response.blog_tag);
      }
    } catch (error) {
      console.log("Error while fetching tags", error);
    }
  };
  const fetchNotificationsForLoggedInUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(
        `${BACKEND_API}/api/notification/allnotifications`,
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
        setAllNotifications(response.notification);
        setCountNotificationNotSeen(response.countNotificationNotSeen);
        console.log("response.notification", response.notification);
        console.log("response.notification", response.countNotificationNotSeen);
      } else if (response.success === false) {
        setAllNotifications([]);
      }
    } catch (error) {
      console.log("Error while fetching notification", error);
    }
  };
  const markNotificationAsSeen = async () => {
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(
        `${BACKEND_API}/api/notification/marknotificationasseen`,
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
        fetchNotificationsForLoggedInUser();
      }
    } catch (error) {
      console.log("Error while fetching notification", error);
    }
  };

  return (
    <>
      <BlogContext.Provider
        value={{
          BACKEND_API,
          fetchallblogs,
          blogcontent,
          fetchallimages,
          imagelist,
          searchResult,
          setSearchResult,
          setBlogcontent,
          loggedInUserName,
          setLoggedInUserName,
          isUserAdmin,
          isLoggedIn,
          userAuthentication,
          setIsLoggedIn,
          setIsUserAdmin,
          blogdetails,
          setBlogdetails,
          fetchblogsByOtherAuthors,
          searchBlogs,
          keyword,
          setKeyword,
          userProfilePicture,
          isBlogger,
          handleUserLogout,
          handleShowModalForSignUp,
          handleCloseModalForSignUp,
          handleCloseModalForLogin,
          handleShowModalForLogin,
          showModalForSignUp,
          showModalForLogin,
          saveBlogForLater,
          deleteBlogSavedForLater,
          isSavedForLater,
          setIsSavedForLater,
          listOfBlogsSavedForLater,
          setListOfBlogsSavedForLater,
          fetchBlogsSavedForLater,
          topBlogsList,
          blogsByOtherAuthors,
          allBlogTags,
          searchBlogsByTag,
          tag_keyword,
          setTag_keyword,
          fetchTopBlogs,
          allNotifications,
          countNotificationNotSeen,
          fetchNotificationsForLoggedInUser,
          markNotificationAsSeen,
          displaySearchResult,
          displaySearchResultByTag,
          setDisplaySearchResult,
          setDisplaySearchResultByTag,
        }}
      >
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            success: {
              style: {
                background: "white",
                position: "top-right",
                color: "green",
                iconTheme: {
                  primary: "white",
                  secondary: "green",
                },
              },
            },
            error: {
              style: {
                duration: 4000,
                background: "white",
                position: "top-right",
                color: "red",
                iconTheme: {
                  primary: "white",
                  secondary: "red",
                },
              },
            },
          }}
        />
      </BlogContext.Provider>
    </>
  );
}

export default ContextProvider;
