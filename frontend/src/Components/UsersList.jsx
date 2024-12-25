import toast from "react-hot-toast";
import { BlogContext } from "./ContextProvider.jsx";
import { useContext, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";

function UsersList() {
  const { BACKEND_API } = useContext(BlogContext);
  const [usersList, setUsersList] = useState([]);
  useEffect(() => {
    fetchuserslist();
  }, []);

  const fetchuserslist = async () => {
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(`${BACKEND_API}/api/user/fetchallusers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await data.json();

      if (response.success === true) {
        setUsersList(response.user);
        console.log("User list", response.user);
      } else if (response.success === false) {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error while fetching users List", error);
    }
  };
  const handleUpdateUser = async (id, updateUser) => {
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(`${BACKEND_API}/api/user/updateuser/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isAdmin: updateUser.isAdmin,
          isBlocked: updateUser.isBlocked,
        }),
      });
      const response = await data.json();
      if (response.success === true) {
        fetchuserslist();
        toast.success("success");
      } else if (response.success === false) {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error while updating user", error);
    }
  };
  return (
    <>
      <p
        style={{
          margin: "80px auto 20px auto",
          textAlign: "center",
          fontSize: "20px",
        }}
      >
        All registered users appear here
      </p>
      {usersList && usersList.length > 0 ? (
        <Table
          style={{
            margin: "10px auto 250px auto",
            width: "90%",
          }}
          responsive="lg"
        >
          <thead>
            <tr style={{ textWrap: "nowrap" }}>
              <th>User ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Manage user</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map(
              (user) =>
                user &&
                user.id &&
                user.username &&
                user.email && (
                  <tr style={{ textWrap: "nowrap" }} key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    {user.isAdmin === true && (
                      <td style={{ color: "blue", fontWeight: "bold" }}>
                        Admin
                      </td>
                    )}
                    {user.isAdmin === false && user.is_blogger === true && (
                      <td style={{ color: "purple", fontWeight: "bold" }}>
                        Blogger
                      </td>
                    )}
                    {user.isAdmin === false && user.is_blogger === false && (
                      <td style={{ color: "black", fontWeight: "bold" }}>
                        User
                      </td>
                    )}
                    {user.isBlocked === true ? (
                      <td style={{ color: "red", fontWeight: "bold" }}>
                        Blocked
                      </td>
                    ) : (
                      <td style={{ color: "green", fontWeight: "bold" }}>
                        Not Blocked
                      </td>
                    )}
                    <td>
                      {new Date(user.createdAt).toLocaleString("en-US", {
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
                          width: "100%",
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
                            width: "100%",
                            color: "white",
                            backgroundColor: "#151533",
                          }}
                        >
                          {user.isAdmin === false && (
                            <Dropdown.Item
                              style={{
                                color: "white",
                                border: "1px solid rgb(255,255,255,0.2)",
                                marginBottom: "3px",
                                textWrap: "wrap",
                                width: "100%",
                              }}
                              onClick={() => {
                                const updateUser = {
                                  isAdmin: true,
                                  isBlocked: user.isBlocked,
                                };
                                handleUpdateUser(user.id, updateUser);
                              }}
                            >
                              Promote to Admin
                            </Dropdown.Item>
                          )}
                          {user.isAdmin === true && (
                            <Dropdown.Item
                              style={{
                                color: "white",
                                border: "1px solid rgb(255,255,255,0.2)",
                                marginBottom: "3px",
                                width: "100%",
                                textWrap: "wrap",
                              }}
                              onClick={() => {
                                const updateUser = {
                                  username: user.username,
                                  email: user.email,
                                  isAdmin: false,
                                  isBlocked: user.isBlocked,
                                };
                                handleUpdateUser(user.id, updateUser);
                              }}
                            >
                              Revoke Admin Privilege
                            </Dropdown.Item>
                          )}
                          {user.isBlocked === false && (
                            <Dropdown.Item
                              style={{
                                color: "white",
                                border: "1px solid rgb(255,255,255,0.2)",
                                marginBottom: "3px",
                              }}
                              onClick={() => {
                                const updateUser = {
                                  username: user.username,
                                  email: user.email,
                                  isAdmin: user.isAdmin,
                                  isBlocked: true,
                                };
                                handleUpdateUser(user.id, updateUser);
                              }}
                            >
                              Block user
                            </Dropdown.Item>
                          )}
                          {user.isBlocked === true && (
                            <Dropdown.Item
                              style={{
                                color: "white",
                                border: "1px solid rgb(255,255,255,0.2)",
                                marginBottom: "3px",
                              }}
                              onClick={() => {
                                const updateUser = {
                                  username: user.username,
                                  email: user.email,
                                  isAdmin: user.isAdmin,
                                  isBlocked: false,
                                };
                                handleUpdateUser(user.id, updateUser);
                              }}
                            >
                              Unblock user
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </Table>
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
          No users found
        </div>
      )}
    </>
  );
}

export default UsersList;
