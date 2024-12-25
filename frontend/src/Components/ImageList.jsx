import { BlogContext } from "./ContextProvider.jsx";
import { useContext, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import toast from "react-hot-toast";
import Table from "react-bootstrap/Table";
function ImageList() {
  const { fetchallimages, imagelist, BACKEND_API } = useContext(BlogContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [uploading, setUploading] = useState(false);
  const handleCloudinaryFileUpload = (e) => {
    const upload = e.target.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      setImageURL(reader.result);
    };
    reader.readAsDataURL(upload);
  };
  useEffect(() => {
    fetchallimages();
  }, []);

  const handleCreateImageURL = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      setUploading(true);
      const data = await fetch(`${BACKEND_API}/api/image/createimageurl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          imageURL,
        }),
      });
      const response = await data.json();
      if (response.success === true) {
        fetchallimages();
        setName("");
        setImageURL("");
        handleClose();
        toast.success("Image uploaded");
        setUploading(false);
      } else if (response.success === false) {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error while creating new Image", error);
    }
  };

  const deleteBlogImage = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        const token = localStorage.getItem("token");
        const data = await fetch(`${BACKEND_API}/api/image/deleteimage/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const response = await data.json();

        if (response.success === true) {
          toast.success("Image Deleted");
          fetchallimages();
          fetch;
        } else if (response === false) {
          toast.error(response.message);
        }
      } catch (error) {
        console.log("Error while creating new Image", error);
      }
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
        You can upload and store images for your blogs here
      </p>
      <Container style={{ margin: "10px auto 20px auto", width: "40%" }}>
        <Button onClick={handleShow} style={{ width: "100%" }}>
          Upload Image
        </Button>
      </Container>
      {imagelist && imagelist.length > 0 ? (
        <Table
          style={{
            margin: "10px auto 10px auto",
            width: "90%",
          }}
          responsive="lg"
        >
          <thead>
            <tr style={{ textWrap: "wrap", textAlign: "start" }}>
              <th>Image ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {imagelist.map(
              (image) =>
                image && (
                  <tr style={{ textWrap: "wrap" }} key={image.id}>
                    <td>{image.id}</td>
                    <td>
                      <img
                        style={{ maxWidth: "50px", maxHeight: "100px" }}
                        src={image.imageURL}
                      />
                    </td>
                    <td>{image.name}</td>

                    <td>
                      {new Date(image.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td>
                      <Button
                        onClick={() => {
                          deleteBlogImage(image.id);
                        }}
                        style={{ backgroundColor: "red" }}
                      >
                        Delete
                      </Button>
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
          No Images Found
        </div>
      )}

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body style={{ backgroundColor: "#151533" }}>
          <Form onSubmit={handleCreateImageURL}>
            <Form.Group className="mb-3" controlId="Create Image URL">
              <Form.Label
                style={{
                  fontSize: "20px",
                  margin: "15px auto",
                  textAlign: "center",
                }}
              >
                Upload your image
              </Form.Label>
              <Form.Control
                style={{ margin: "10px auto" }}
                type="file"
                name="image"
                onChange={handleCloudinaryFileUpload}
                placeholder="Upload Image"
                required
              />
              <Form.Control
                type="text"
                placeholder="Name  of Image"
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                required
              />
            </Form.Group>

            <Container
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              {uploading === false && (
                <Button
                  style={{
                    width: "35%",
                    border: "1px solid rgb(255,255,255,0.2)",
                  }}
                  type="submit"
                  variant="primary"
                >
                  Submit
                </Button>
              )}
              {uploading === true && (
                <Button
                  style={{
                    width: "35%",
                    border: "1px solid rgb(255,255,255,0.2)",
                    backgroundColor: "green",
                  }}
                  disabled={uploading}
                >
                  Uploading..
                </Button>
              )}
              <Button
                style={{
                  backgroundColor: "red",

                  width: "35%",
                  border: "1px solid rgb(255,255,255,0.2)",
                }}
                onClick={() => {
                  handleClose();
                }}
              >
                Cancel
              </Button>
            </Container>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ImageList;
