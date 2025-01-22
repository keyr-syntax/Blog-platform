import { Editor } from "@tinymce/tinymce-react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import { BlogContext } from "./ContextProvider.jsx";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateBlog.css";
import Spinner from "react-bootstrap/Spinner";
function EditBlog() {
  const { BACKEND_API, imagelist, fetchallimages, fetchallblogs } =
    useContext(BlogContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledFor, setScheduledFor] = useState(new Date());
  const [isPublished, setIsPublished] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [tags_list, setTag_list] = useState([]);
  const [newTags, setNewTags] = useState("");
  const [hideTagButton, setHideTagButton] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [blogSchedulerModal, setBlogSchedulerModal] = useState(false);
  const handleCloseBlogSchedulerModal = () => setBlogSchedulerModal(false);
  const handleShowBlogSchedulerModal = () => setBlogSchedulerModal(true);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchblogbypk();
    }
  }, [id]);

  useEffect(() => {
    fetchallimages();
  }, []);

  useEffect(() => {
    if (tags_list.length === 5) {
      setHideTagButton(true);
    } else if (tags_list.length < 5) {
      setHideTagButton(false);
    }
  }, [tags_list]);

  const destructureTags = (tags_array) => {
    const tag = tags_array.map((tag) => tag.tag_name);
    setTag_list([...tag]);
  };

  const fetchblogbypk = async () => {
    const token = localStorage.getItem("token");

    try {
      const data = await fetch(`${BACKEND_API}/api/blog/fetchoneblog/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await data.json();
      if (response.success === true) {
        const post = response.post;
        setTitle(post.title);
        setHideTagButton(false);
        destructureTags(post.blog_tags);
        setContent(post.content);
        setImage(post.image);
        toast.success("Blog is ready for editing");
      } else if (response.success === false) {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error while fetching post", error);
    }
  };

  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(`${BACKEND_API}/api/blog/updateblog/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          isScheduled,
          scheduledFor: scheduledFor.toISOString(),
          isPublished,
          isDraft,
          image,
          tags_list,
        }),
      });
      const response = await data.json();
      if (response.success === true) {
        const published = response.post.isPublished;
        handleCloseBlogSchedulerModal();
        setContent("");
        setTitle("");
        setNewTags("");
        fetchallblogs();

        {
          published === true
            ? toast.success("Blog published")
            : toast.success("Blog saved");
        }
        {
          isPublished === true && navigate(`/readblog/${id}`);
        }
        {
          isDraft === true && navigate(`/draftblogs`);
        }
        {
          isScheduled === true && navigate(`/scheduled`);
        }
      } else if (response.success === false) {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error while updating blog", error);
    }
  };

  const handleCloudinaryFileUpload = (e) => {
    const upload = e.target.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      setImageURL(reader.result);
    };
    reader.readAsDataURL(upload);
  };
  const handleCreateImageURL = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      setImageUploading(true);
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
        setImage(response.image.imageURL);
        handleClose();
        setImageURL("");
        setImageUploading(false);
        fetchallblogs();
        toast.success("Image uploaded");
      } else if (response.success === false) {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error while creating new Image", error);
    }
  };
  const addTags = () => {
    if (newTags === "") {
      toast.error("Please enter a tag");
      return;
    }
    if (tags_list.length < 5) {
      setHideTagButton(false);
      setTag_list([...tags_list, newTags.trim()]);
      setNewTags("");
    } else if (tags_list.length >= 5) {
      toast.error("You can add only five tags");
      setNewTags("");
      setHideTagButton(true);
    }
  };
  const deleteTag = (index) => {
    setTag_list(tags_list.filter((_, i) => i != index));
  };
  return (
    <>
      <Container style={{ maxWidth: "1000px", marginTop: "70px" }}>
        <Form
          style={{
            backgroundColor: "#151533",
            border: "1px solid rgb(255,255,255,0.2)",
            padding: "10px 20px",
          }}
          onSubmit={handleUpdateBlog}
          className="mb-5"
        >
          <h4 className="text-center text-light my-4">Edit Post</h4>
          <Form.Group className="mb-3" controlId="Change header image">
            <Form.Label
              style={{ fontWeight: "bold", fontSize: "20px" }}
              className="text-light"
            >
              Change header image
            </Form.Label>
            <Container className="image-upload-container">
              <Form.Select
                className="image-selector"
                style={{
                  width: "100%",
                  margin: "5px auto",
                }}
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                }}
                aria-label="Image"
              >
                <option value="">Select Image from Your Gallery</option>
                {imagelist.map(
                  (image) =>
                    image &&
                    image.imageURL && (
                      <option value={image.imageURL} key={image.id}>
                        {image.name}
                      </option>
                    )
                )}
              </Form.Select>
              <Button
                className="upload-image-button"
                onClick={handleShow}
                style={{ width: "100%", margin: "5px auto" }}
              >
                Upload Image from your device
              </Button>
            </Container>
            <Form.Select
              className="image-selector-mobile"
              style={{
                width: "100%",
                margin: "10px 0",
                textAlign: "center",
              }}
              value={image}
              onChange={(e) => {
                setImage(e.target.value);
              }}
              aria-label="Image"
            >
              <option value="">Select Image from Your Gallery</option>
              {imagelist.map(
                (image) =>
                  image &&
                  image.imageURL && (
                    <option value={image.imageURL} key={image.id}>
                      {image.name}
                    </option>
                  )
              )}
            </Form.Select>
            <Button
              className="upload-image-button-mobile"
              onClick={handleShow}
              style={{ width: "100%" }}
            >
              Upload Image from your device
            </Button>
          </Form.Group>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label
              style={{ fontWeight: "bold", fontSize: "20px" }}
              className="text-light"
            >
              Blog Title
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Title of Blog"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="tag">
            <Form.Label
              style={{ fontWeight: "bold", fontSize: "20px" }}
              className="text-light"
            >
              Edit Tags ( You can add five tags )
            </Form.Label>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "10px",
                margin: "5px auto 10px auto",
                flexWrap: "wrap",
              }}
            >
              {tags_list &&
                tags_list.length > 0 &&
                tags_list.map((tag, index) => (
                  <Button
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                      backgroundColor: "white",
                      border: "1px solid #151533",
                      color: "black",
                    }}
                    onClick={() => deleteTag(index)}
                  >
                    {tag} <X style={{ color: "red" }} />{" "}
                  </Button>
                ))}
            </div>
            {hideTagButton === false && (
              <>
                <Form.Control
                  type="text"
                  placeholder="Write tags here ..."
                  name="tag"
                  value={newTags}
                  onChange={(e) => {
                    setNewTags(e.target.value);
                  }}
                />
                <Button
                  onClick={() => {
                    addTags();
                  }}
                >
                  Add tag
                </Button>
              </>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label
              style={{ fontWeight: "bold", fontSize: "20px" }}
              className="text-light"
            >
              Blog Content
            </Form.Label>
            <Button
              onClick={() => {
                window.open("/generateaicontent", "_blank");
              }}
              style={{ width: "100%", margin: "10px auto" }}
            >
              Generate blog content using AI
            </Button>
            <Editor
              tinymceScriptSrc="/tinymce/tinymce.min.js"
              licenseKey="gpl"
              value={content}
              onEditorChange={(newContent) => {
                setContent(newContent);
              }}
              init={{
                skin: "oxide-dark",
                height: 500,
                plugins: [
                  "fullscreen",
                  "anchor",
                  "autolink",
                  "charmap",
                  "codesample",
                  "emoticons",
                  "image",
                  "link",
                  "lists",
                  "media",
                  "searchreplace",
                  "table",
                  "visualblocks",
                  "wordcount",
                  "autosave",
                  "code",
                  "codesample",
                  "directionality",
                  "importcss",
                  "insertdatetime",
                  "preview",
                  "quickbars",
                ],
                toolbar:
                  " undo redo restoredraft preview paste | blocks fontfamily fontsize | fullscreen | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat codesample code ltr rtl /my-styles.css insertdatetime ",
                fullscreen_native: true,
                paste_as_text: true,
                mobile: {
                  menubar: true,
                },
                toolbar_sticky: true,
                tinycomments_mode: "embedded",
                tinycomments_author: "Author name",
                mergetags_list: [
                  { value: "First.Name", title: "First Name" },
                  { value: "Email", title: "Email" },
                ],
              }}
            />
          </Form.Group>

          <Container className="blog-editor-buttons">
            <Button
              style={{
                backgroundColor: "green",
                border: "1px solid rgb(255,255,255,0.2)",
                margin: "10px auto",
                width: "80%",
              }}
              type="submit"
              onClick={() => {
                setIsPublished(true);
              }}
            >
              Publish now
            </Button>
            <Button
              style={{
                backgroundColor: "green",
                border: "1px solid rgb(255,255,255,0.2)",
                margin: "10px auto",
                width: "80%",
              }}
              type="submit"
              onClick={() => {
                setIsDraft(true);
              }}
            >
              Save as Draft
            </Button>
            <Button
              style={{
                backgroundColor: "green",
                border: "1px solid rgb(255,255,255,0.2)",
                margin: "10px auto",
                width: "80%",
              }}
              type="button"
              onClick={() => {
                handleShowBlogSchedulerModal();
              }}
            >
              Schedule blog
            </Button>
          </Container>
        </Form>
      </Container>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body style={{ backgroundColor: "#151533" }}>
          <Form onSubmit={handleCreateImageURL}>
            <Form.Group className="mb-3" controlId="Upload Image">
              <>
                <Form.Label
                  style={{
                    fontSize: "20px",
                    margin: "10px auto",
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  Upload Image
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
                  placeholder="Write Name of Image"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  required
                />
              </>
            </Form.Group>
            <Container
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Button
                style={{
                  backgroundColor: "#0D6EFD",
                  width: "35%",
                  border: "1px solid rgb(255,255,255,0.2)",
                }}
                type="submit"
                disabled={imageUploading}
              >
                {imageUploading === true ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span style={{ marginLeft: "3px" }}>Uploading Picture</span>
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
              <Button
                style={{
                  backgroundColor: "RED",
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
      <Modal
        show={blogSchedulerModal}
        onHide={handleCloseBlogSchedulerModal}
        centered
      >
        <Modal.Body style={{ backgroundColor: "#151533" }}>
          <Form onSubmit={handleUpdateBlog}>
            <Form.Group className="mb-3" controlId="blog scheduler">
              <Form.Label
                style={{
                  fontSize: "20px",
                  margin: "15px auto",
                  textAlign: "center",
                }}
              >
                Choose date and time to publish your blog
              </Form.Label>
              <Form.Control
                type="datetime-local"
                placeholder="schedule your blog to be published"
                name="datetime-local"
                min={new Date().toISOString().slice(0, 16)}
                value={
                  scheduledFor
                    ? new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }).format(scheduledFor)
                    : ""
                }
                selected={scheduledFor}
                onChange={(event) => {
                  const localDateString = event.target.value;
                  const localDate = new Date(localDateString);
                  const utcDate = new Date(
                    Date.UTC(
                      localDate.getFullYear(),
                      localDate.getMonth(),
                      localDate.getDate(),
                      localDate.getHours(),
                      localDate.getMinutes(),
                      localDate.getSeconds()
                    )
                  );
                  setScheduledFor(utcDate);
                  setIsScheduled(true);
                }}
              />
            </Form.Group>
            <Button
              type="submit"
              style={{
                display: "block",
                backgroundColor: "#151533",
                margin: "10px auto 10px auto",
                width: "45%",
              }}
            >
              Submit
            </Button>
            <Button
              type="button"
              style={{
                display: "block",
                backgroundColor: "red",
                margin: "10px auto 10px auto",
                width: "45%",
              }}
              onClick={() => {
                handleCloseBlogSchedulerModal();
                setIsScheduled(false);
              }}
            >
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditBlog;
