import { Route, Routes } from "react-router-dom";
import NavigationBar from "./Components/NavigationBar";
import CreateBlog from "./Components/CreateBlog";
import EditBlog from "./Components/EditBlog";
import ManageBlog from "./Components/ManageBlog";
import ImageList from "./Components/ImageList";
import DraftBlogs from "./Components/DraftBlogs";
import RegisterUser from "./Components/RegisterUser";
import Login from "./Components/Login";
import { BlogContext } from "./Components/ContextProvider.jsx";
import { useContext } from "react";
import UsersList from "./Components/UsersList.jsx";
import UpdateUserProfile from "./Components/UpdateUserProfile.jsx";
import Analytics from "./Components/Analytics.jsx";
import AIGeneratedContent from "./Components/AIGeneratedContent.jsx";
import HomePageListOfBlogs from "./Components/HomePageListOfBlogs.jsx";
import ReadBlogs from "./Components/ReadBlogs.jsx";
import DisplaySearchResult from "./Components/DisplaySearchResult.jsx";
import BlogsSavedForLater from "./Components/BlogsSavedForLater.jsx";
import ScheduledBlogs from "./Components/ScheduledBlogs.jsx";
import AccessDenied from "./Components/AccessDenied.jsx";
import Notifications from "./Components/Notifications.jsx";

function App() {
  const { isUserAdmin, isLoggedIn } = useContext(BlogContext);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<NavigationBar />}>
          <>
            <Route exact path="/" element={<HomePageListOfBlogs />} />

            <Route
              exact
              path="/searchresult"
              element={<DisplaySearchResult />}
            />

            <Route
              exact
              path="/readblog/:id/:commentIDForNotification"
              element={<ReadBlogs />}
            />
            <Route exact path="/readblog/:id" element={<ReadBlogs />} />
            {isLoggedIn && (
              <>
                <Route
                  exact
                  path="/updateprofile"
                  element={<UpdateUserProfile />}
                />
                <Route exact path="/analytics" element={<Analytics />} />
                <Route exact path="/createblog" element={<CreateBlog />} />
                <Route exact path="/editblog/:id" element={<EditBlog />} />
                <Route
                  exact
                  path="/generateaicontent"
                  element={<AIGeneratedContent />}
                />
                <Route exact path="/manageblogs" element={<ManageBlog />} />
                <Route exact path="/draftblogs" element={<DraftBlogs />} />
                <Route exact path="/gallery" element={<ImageList />} />
                <Route
                  exact
                  path="/savedforlater"
                  element={<BlogsSavedForLater />}
                />
                <Route
                  exact
                  path="/notifications"
                  element={<Notifications />}
                />
                <Route exact path="/scheduled" element={<ScheduledBlogs />} />
                {isUserAdmin ? (
                  <Route exact path="/users" element={<UsersList />} />
                ) : (
                  <Route exact path="/users" element={<AccessDenied />} />
                )}
              </>
            )}
          </>
        </Route>
        <Route exact path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterUser />} />
      </Routes>
    </>
  );
}

export default App;
