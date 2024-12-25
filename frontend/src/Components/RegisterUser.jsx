import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import toast from "react-hot-toast";
import { BlogContext } from "./ContextProvider.jsx";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function RegisterUser() {
  const { BACKEND_API, userAuthentication } = useContext(BlogContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const navigate = useNavigate();

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
        setTimeout(() => {
          navigate("/");
        }, 500);
        console.log("User registration", response);
      } else if (response.success === false) {
        toast.success(response.message);
        console.log("User registration", response);
      }
    } catch (error) {
      console.log("Error while registering user", error);
    }
  };

  return (
    <>
      <Form
        onSubmit={handleCreateUser}
        style={{
          maxWidth: "500px",
          margin: "70px auto",
          width: "90%",
          border: "1px solid rgb(255,255,255,0.2)",
          padding: "15px",
          borderRadius: "6px",
        }}
      >
        <h3 style={{ textAlign: "center" }}>Registration Form</h3>
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
        <Button
          style={{
            margin: "auto",
            display: "block",
            padding: "5px 40px",
            textAlign: "center",
          }}
          type="submit"
          onClick={() => {
            setIsAdmin(true);
          }}
        >
          Submit
        </Button>
        <p style={{ textAlign: "center", margin: "15px" }}>
          Have You registered before? Please click Login below
        </p>
        <Link
          style={{
            textDecoration: "none",
            color: "white",
            textAlign: "center",
            display: "block",
            border: "1px solid rgb(255,255,255,0.2)",
            width: "30%",
            margin: "5px auto",
            padding: "5px 10px",
            borderRadius: "6px",
          }}
          to="/login"
        >
          Login
        </Link>
      </Form>
    </>
  );
}

export default RegisterUser;
