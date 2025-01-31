import { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link, Outlet } from "react-router-dom";
import "./NavigationBar.css";
import { BlogContext } from "./ContextProvider.jsx";
import { useContext } from "react";
import toast from "react-hot-toast";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Dropdown from "react-bootstrap/Dropdown";
import { CircleUserRound } from "lucide-react";
import { LogOut } from "lucide-react";
import { Settings } from "lucide-react";
import { Bell } from "lucide-react";
function NavigationBar() {
  const {
    keyword,
    setKeyword,
    searchBlogs,
    userProfilePicture,
    loggedInUserName,
    isLoggedIn,
    isUserAdmin,
    userAuthentication,
    BACKEND_API,
    handleUserLogout,
    handleShowModalForSignUp,
    handleCloseModalForSignUp,
    handleCloseModalForLogin,
    handleShowModalForLogin,
    showModalForSignUp,
    showModalForLogin,
    countNotificationNotSeen,
  } = useContext(BlogContext);
  const [username, setUsername] = useState("Admin");
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);
  const [showModalForUserProfile, setShowModalForUserProfile] = useState(false);
  const handleCloseModalForUserProfile = () =>
    setShowModalForUserProfile(false);
  const handleShowModalForUserProfile = () => setShowModalForUserProfile(true);
  const getFirstLetterOfName = (username) => username.charAt(0).toUpperCase();

  const handleLoginUser = async (e) => {
    e.preventDefault();

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
        handleCloseModalForLogin();
      } else if (response.success === false) {
        toast.success(response.message);
        console.log("User Login", response);
      }
    } catch (error) {
      console.log("Error during login", error);
    }
  };
  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const data = await fetch(`${BACKEND_API}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          isAdmin,
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
        handleCloseModalForSignUp();
      } else if (response.success === false) {
        toast.success(response.message);
      }
    } catch (error) {
      console.log("Error while registering user", error);
    }
  };

  return (
    <>
      <Navbar
        fixed="top"
        expand="md"
        style={{
          backgroundColor: "#151533",
          border: "1px solid rgb(255,255,255,0.2)",
          display: "flex",
          flexWrap: "nowrap",
          padding: "0.5rem 0",
          height: "auto",
        }}
      >
        <Container fluid className="d-flex align-items-center px-2">
          <Navbar.Brand
            style={{ color: "white", textWrap: "nowrap" }}
            as={Link}
            to="/"
          >
            Syntax Blog
          </Navbar.Brand>

          <Container className="d-none d-md-block">
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
                // to="/searchresult"
                onClick={() => {
                  searchBlogs(keyword);
                }}
              >
                Search
              </Link>
            </Form>
          </Container>

          <Navbar.Offcanvas
            style={{
              backgroundColor: "#151533",
              color: "white",
              width: "300px",
              overflowY: "visible",
            }}
            id={`offcanvasNavbar-expand-md`}
            aria-labelledby={`offcanvasNavbarLabel-expand-md`}
            show={showOffcanvas}
            onHide={handleClose}
            placement="start"
          >
            <Offcanvas.Header closeButton className="offCanvas-close-button">
              <Offcanvas.Title
                style={{ color: "white", textWrap: "nowrap" }}
                id={`offcanvasNavbarLabel-expand-md`}
              >
                Syntax Blog
              </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
              {isLoggedIn && (
                <Dropdown
                  className="navbar-dropdown"
                  style={{
                    margin: "5px auto",
                  }}
                >
                  <Dropdown.Toggle
                    style={{
                      backgroundColor: "#151533",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "18px",
                    }}
                    id="dropdown-basic"
                  >
                    Dashboard
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    style={{
                      width: "95%",
                      backgroundColor: "#151533",
                      color: "white",
                    }}
                  >
                    {isUserAdmin === true && (
                      <Dropdown.Item
                        style={{
                          color: "white",
                          border: "1px solid rgb(255,255,255,0.2)",
                          marginBottom: "3px",
                        }}
                        as={Link}
                        to={`/users`}
                      >
                        Manage users
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item
                      style={{
                        color: "white",
                        border: "1px solid rgb(255,255,255,0.2)",
                        marginBottom: "3px",
                      }}
                      as={Link}
                      to={`/createblog`}
                    >
                      Write blog
                    </Dropdown.Item>
                    <Dropdown.Item
                      style={{
                        color: "white",
                        border: "1px solid rgb(255,255,255,0.2)",
                        marginBottom: "3px",
                      }}
                      as={Link}
                      to={`/manageblogs`}
                    >
                      Published blogs
                    </Dropdown.Item>

                    <Dropdown.Item
                      style={{
                        color: "white",
                        border: "1px solid rgb(255,255,255,0.2)",
                        marginBottom: "3px",
                      }}
                      as={Link}
                      to={`/scheduled`}
                    >
                      Scheduled blogs
                    </Dropdown.Item>
                    <Dropdown.Item
                      style={{
                        color: "white",
                        border: "1px solid rgb(255,255,255,0.2)",
                        marginBottom: "3px",
                      }}
                      as={Link}
                      to={`/draftblogs`}
                    >
                      Drafts
                    </Dropdown.Item>
                    <Dropdown.Item
                      style={{
                        color: "white",
                        border: "1px solid rgb(255,255,255,0.2)",
                        marginBottom: "3px",
                      }}
                      as={Link}
                      to={`/generateaicontent`}
                    >
                      Talk to Chatgpt
                    </Dropdown.Item>
                    <Dropdown.Item
                      style={{
                        color: "white",
                        border: "1px solid rgb(255,255,255,0.2)",
                        marginBottom: "3px",
                      }}
                      as={Link}
                      to={`/savedforlater`}
                    >
                      Reading list
                    </Dropdown.Item>
                    <Dropdown.Item
                      style={{
                        color: "white",
                        border: "1px solid rgb(255,255,255,0.2)",
                        marginBottom: "3px",
                      }}
                      as={Link}
                      to={`/analytics`}
                    >
                      Analytics
                    </Dropdown.Item>
                    <Dropdown.Item
                      style={{
                        color: "white",
                        border: "1px solid rgb(255,255,255,0.2)",
                        marginBottom: "3px",
                      }}
                      as={Link}
                      to={`/gallery`}
                    >
                      Image Gallery
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
              <Container
                className="navbar-mobile-links"
                fluid
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: "2px",
                }}
              >
                <Link
                  onClick={handleClose}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    border: "1px solid rgb(255,255,255,0.2)",
                    width: "90%",
                    padding: "5px 10px",
                    borderRadius: "6px",
                  }}
                  as={Link}
                  to={`/users`}
                >
                  Manage users
                </Link>
                <Link
                  onClick={handleClose}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    border: "1px solid rgb(255,255,255,0.2)",
                    width: "90%",
                    padding: "5px 10px",
                    borderRadius: "6px",
                  }}
                  as={Link}
                  to={`/createblog`}
                >
                  Write blog
                </Link>
                <Link
                  onClick={handleClose}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    border: "1px solid rgb(255,255,255,0.2)",
                    width: "90%",
                    padding: "5px 10px",
                    borderRadius: "6px",
                  }}
                  as={Link}
                  to={`/manageblogs`}
                >
                  Published blogs
                </Link>

                <Link
                  onClick={handleClose}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    border: "1px solid rgb(255,255,255,0.2)",
                    width: "90%",
                    padding: "5px 10px",
                    borderRadius: "6px",
                  }}
                  as={Link}
                  to={`/scheduled`}
                >
                  Scheduled blogs
                </Link>
                <Link
                  onClick={handleClose}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    border: "1px solid rgb(255,255,255,0.2)",
                    width: "90%",
                    padding: "5px 10px",
                    borderRadius: "6px",
                  }}
                  as={Link}
                  to={`/draftblogs`}
                >
                  Drafts
                </Link>
                <Link
                  onClick={handleClose}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    border: "1px solid rgb(255,255,255,0.2)",
                    width: "90%",
                    padding: "5px 10px",
                    borderRadius: "6px",
                  }}
                  as={Link}
                  to={`/generateaicontent`}
                >
                  Talk to Chatgpt
                </Link>
                <Link
                  onClick={handleClose}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    border: "1px solid rgb(255,255,255,0.2)",
                    width: "90%",
                    padding: "5px 10px",
                    borderRadius: "6px",
                  }}
                  as={Link}
                  to={`/savedforlater`}
                >
                  Reading list
                </Link>
                <Link
                  onClick={handleClose}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    border: "1px solid rgb(255,255,255,0.2)",
                    width: "90%",
                    padding: "5px 10px",
                    borderRadius: "6px",
                  }}
                  as={Link}
                  to={`/analytics`}
                >
                  Analytics
                </Link>
                <Link
                  onClick={handleClose}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    border: "1px solid rgb(255,255,255,0.2)",
                    width: "90%",
                    padding: "5px 10px",
                    borderRadius: "6px",
                  }}
                  as={Link}
                  to={`/gallery`}
                >
                  Image Gallery
                </Link>
              </Container>
            </Offcanvas.Body>
          </Navbar.Offcanvas>

          <div className="d-flex align-items-center">
            {isLoggedIn && (
              <Link
                to="/notifications"
                style={{
                  marginRight: "25px",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                <Bell size={30} />
                {countNotificationNotSeen > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "8%",
                      color: "red",
                      fontWeight: "bolder",
                    }}
                  >
                    {countNotificationNotSeen}
                  </span>
                )}
              </Link>
            )}
            {!isLoggedIn && (
              <Nav.Link
                style={{
                  marginRight: "15px",
                  textWrap: "nowrap",
                  fontSize: "18px",
                }}
                as={Link}
                onClick={handleShowModalForLogin}
              >
                Sign Up/Login
              </Nav.Link>
            )}

            {isLoggedIn && (
              <Dropdown align="end" className="me-1">
                <Dropdown.Toggle
                  variant="link"
                  id="profile-dropdown"
                  className="p-0 border-0"
                  bsPrefix="dropdown-toggle-no-caret"
                  style={{
                    "::after": {
                      display: "none",
                    },
                  }}
                >
                  {userProfilePicture ? (
                    <img
                      src={userProfilePicture}
                      alt="Profile"
                      className="circleForProfileName rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        marginRight: "15px",
                      }}
                    />
                  ) : (
                    <div
                      className="circleForProfileName rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#007bff",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                      }}
                    >
                      {getFirstLetterOfName(loggedInUserName)}
                    </div>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item>
                    <CircleUserRound style={{ marginRight: "10px" }} />
                    {loggedInUserName}
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/updateprofile">
                    <Settings size={25} style={{ marginRight: "10px" }} />
                    Edit Profile
                  </Dropdown.Item>

                  <Dropdown.Item onClick={handleUserLogout}>
                    <LogOut style={{ marginRight: "10px" }} />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
            <Navbar.Toggle
              className="toggler"
              onClick={handleShow}
              aria-controls={`offcanvasNavbar-expand-md`}
            />
          </div>
        </Container>
      </Navbar>

      <Modal
        centered
        show={showModalForSignUp}
        onHide={handleCloseModalForSignUp}
      >
        <Modal.Body style={{ borderRadius: "6px", backgroundColor: "#151533" }}>
          <h5
            style={{
              textAlign: "center",
              margin: "25px auto 5px auto",
              fontSize: "22px",
            }}
          >
            Sign Up Form
          </h5>
          <Form
            onSubmit={handleCreateUser}
            style={{
              maxWidth: "500px",
              margin: "20px auto",
              width: "90%",
              border: "1px solid rgb(255,255,255,0.2)",
              padding: "15px",
              borderRadius: "6px",
            }}
          >
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                type="text"
                placeholder="Username"
                required
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
                placeholder="Enter email"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                placeholder="Password"
                required
              />
            </Form.Group>
            <Container
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                style={{ marginBottom: "5px" }}
                type="submit"
                variant="primary"
              >
                Submit
              </Button>
              <Button
                style={{ backgroundColor: "red" }}
                type="button"
                onClick={handleCloseModalForSignUp}
              >
                Cancel
              </Button>
            </Container>
          </Form>
          <Container
            fluid
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Link
              style={{
                color: "white",
                fontSize: "16px",
                textDecoration: "none",
              }}
            >
              Do you have an account?
            </Link>
            <Link
              type="button"
              style={{ color: "white", fontSize: "18px" }}
              onClick={() => {
                handleCloseModalForSignUp();
                handleShowModalForLogin();
              }}
            >
              Login
            </Link>
          </Container>
        </Modal.Body>
      </Modal>

      <Modal
        centered
        show={showModalForLogin}
        onHide={handleCloseModalForLogin}
      >
        <Modal.Body style={{ borderRadius: "6px", backgroundColor: "#151533" }}>
          <h5
            style={{
              textAlign: "center",
              margin: "25px auto 5px auto",
              fontSize: "22px",
            }}
          >
            Login Form
          </h5>
          <Form
            onSubmit={handleLoginUser}
            style={{
              maxWidth: "500px",
              margin: "20px auto",
              width: "90%",
              border: "1px solid rgb(255,255,255,0.2)",
              padding: "15px",
              borderRadius: "6px",
            }}
          >
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                type="text"
                placeholder="Username"
                required
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
                placeholder="Enter email"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                placeholder="Password"
                required
              />
            </Form.Group>
            <Container
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                style={{ marginBottom: "5px" }}
                type="submit"
                variant="primary"
              >
                Submit
              </Button>
              <Button
                style={{ backgroundColor: "red" }}
                type="button"
                onClick={handleCloseModalForLogin}
              >
                Cancel
              </Button>
            </Container>
          </Form>
          <Container
            fluid
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Link
              style={{
                color: "white",
                fontSize: "16px",
                textDecoration: "none",
              }}
            >
              No Account?
            </Link>
            <Link
              type="button"
              style={{ color: "white", fontSize: "18px" }}
              onClick={() => {
                +handleShowModalForSignUp();
                handleCloseModalForLogin();
              }}
            >
              Register
            </Link>
          </Container>
        </Modal.Body>
      </Modal>

      <Modal
        centered
        show={showModalForUserProfile}
        onHide={handleCloseModalForUserProfile}
      >
        <Card
          style={{
            backgroundColor: "#151533",
            color: "white",
            border: "1px solid rgb(255,255,255,0.2)",
          }}
        >
          {isLoggedIn && userProfilePicture === null && (
            <Container
              style={{
                height: "40px",
                width: "40px",
                objectFit: "cover",
                borderRadius: "50%",
                margin: "5px",
                backgroundColor: "#151533",
                border: "1px solid rgb(255,255,255,0.2)",
                background: "green",
                fontSize: "18px",
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
              onClick={handleShowModalForUserProfile}
            >
              {getFirstLetterOfName(loggedInUserName)}
            </Container>
          )}
          {isLoggedIn && userProfilePicture !== null && (
            <Card.Img
              variant="top"
              src={userProfilePicture}
              alt="Profile picture"
              className="rounded-circle"
              style={{
                width: "100px",
                height: "100px",
                margin: "30px auto 10px auto",
                objectFit: "cover",
                cursor: "pointer",
              }}
            />
          )}

          <Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroup.Item
                style={{ backgroundColor: "#151533", color: "white" }}
              >
                {loggedInUserName}
              </ListGroup.Item>
              <ListGroup.Item
                as={Link}
                style={{ backgroundColor: "#151533", color: "white" }}
                to="/updateprofile"
                onClick={() => {
                  handleCloseModalForUserProfile();
                }}
              >
                Edit Profile
              </ListGroup.Item>
              <ListGroup.Item
                style={{ backgroundColor: "#151533", color: "white" }}
                onClick={() => {
                  handleUserLogout();
                  handleCloseModalForUserProfile();
                }}
              >
                Logout
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Modal>

      <Outlet />
    </>
  );
}

export default NavigationBar;
