import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import toast from "react-hot-toast";
import { BlogContext } from "./ContextProvider.jsx";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

function UpdateUserProfile() {
  const { BACKEND_API, userAuthentication, fetchallblogs, fetchTopBlogs } =
    useContext(BlogContext);
  const [username, setUsername] = useState("");
  const [updateUsername, setUpdateUsername] = useState(false);
  const [email, setEmail] = useState("");
  const [profile_image, setProfile_image] = useState("");
  const [updateProfileImage, setUpdateProfileImage] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [showprofile_image, setShowprofile_image] = useState(false);
  const [base64Image, setBase64Image] = useState("");
  const [biography, setBiography] = useState("");
  const [profession, setProfession] = useState("");
  const [location, setLocation] = useState("");
  const [education, setEducation] = useState("");
  const [hobby, setHobby] = useState("");
  const [personal_website_link, setPersonal_website_link] = useState("");
  const [is_available_for_work, setis_available_for_work] = useState(false);
  const [workPreference, setWorkPreference] = useState("");
  const [is_email_public, setis_email_public] = useState(false);
  const [emailPreference, setEmailPreference] = useState("");
  const [is_blogger, setis_blogger] = useState(false);
  const [bloggerPreference, setBloggerPreference] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const workPreferenceList = [
    "Yes, I am available for work",
    "No, I am not available for work",
  ];
  const emailPreferenceList = [
    "Yes, show my email on profile",
    "No, don't show my email on profile",
  ];
  const bloggerPreferenceList = [
    "Yes, I want to be a blogger",
    "No, I just want to read blogs",
  ];
  const navigate = useNavigate();

  useEffect(() => {
    if (workPreference === "Yes, I am available for work") {
      setis_available_for_work(true);
    } else if (workPreference === "No, I am not available for work") {
      setis_available_for_work(false);
    }
  }, [workPreference, is_available_for_work]);

  useEffect(() => {
    if (emailPreference === "Yes, show my email on profile") {
      setis_email_public(true);
    } else if (emailPreference === "No, don't show my email on profile") {
      setis_email_public(false);
    }
  }, [emailPreference, is_email_public]);

  useEffect(() => {
    if (bloggerPreference === "Yes, I want to be a blogger") {
      setis_blogger(true);
    } else if (bloggerPreference === "No, I just want to read blogs") {
      setis_blogger(false);
    }
  }, [bloggerPreference, is_blogger]);

  useEffect(() => {
    fetchUserByPk();
  }, []);

  const fetchUserByPk = async () => {
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(`${BACKEND_API}/api/user/fetchoneuser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await data.json();
      if (response.success === true) {
        setUsername(response.user.username);
        setUpdateUsername(false);
        setUpdateProfileImage(false);
        setEmail(response.user.email);

        setProfile_image(response.user.profile_image);
        {
          response.user.profile_image === null
            ? setShowprofile_image(false)
            : setShowprofile_image(true);
        }

        setBiography(response.user.biography);
        setProfession(response.user.profession);
        setLocation(response.user.location);
        setEducation(response.user.education);
        setHobby(response.user.hobby);
        setPersonal_website_link(response.user.personal_website_link);
        {
          response.user.is_available_for_work === true
            ? setWorkPreference("Yes, I am available for work")
            : setWorkPreference("No, I am not available for work");
        }
        {
          response.user.is_email_public === true
            ? setEmailPreference("Yes, show my email on profile")
            : setEmailPreference("No, don't show my email on profile");
        }

        {
          response.user.is_blogger === true
            ? setBloggerPreference("Yes, I want to be a blogger")
            : setBloggerPreference("No, I don't want to be a blogger");
        }
        console.log("image", response.user.profile_image);
      } else if (response.success === false) {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error while fetching post", error);
    }
  };
  const handleCreateProfileImageURL = async () => {
    const token = localStorage.getItem("token");
    try {
      setImageUploading(true);
      const data = await fetch(
        `${BACKEND_API}/api/image/createprofileimageurl`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            profile_image: base64Image,
          }),
        }
      );
      const response = await data.json();
      if (response.success === true) {
        setProfile_image(response.image.imageURL);
        console.log("Image URL", response.image.imageURL);
        setShowprofile_image(true);
        setUpdateProfileImage(true);
        toast.success("Image uploaded successfully");
        setImageUploading(false);
      } else if (response.success === false) {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error while creating new Image", error);
    }
  };
  const handleCloudinaryFileUpload = async (e) => {
    setShowprofile_image(false);
    const upload = await e.target.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      setBase64Image(reader.result);
    };
    reader.readAsDataURL(upload);
  };
  const handleUpdateUserProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      setIsLoading(true);
      const data = await fetch(`${BACKEND_API}/api/user/updateuserprofile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username,
          updateUsername: updateUsername,
          email: email,
          profile_image: profile_image,
          updateProfileImage: updateProfileImage,
          biography: biography,
          profession: profession,
          location: location,
          education: education,
          hobby: hobby,
          personal_website_link: personal_website_link,
          is_available_for_work: is_available_for_work,
          is_email_public: is_email_public,
          is_blogger: is_blogger,
        }),
      });
      const response = await data.json();
      if (response.success === true) {
        toast.success(response.message);
        userAuthentication();
        fetchallblogs();
        fetchTopBlogs();
        setIsLoading(false);
        navigate("/");
      } else if (response.success === false) {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error while updating user profile", error);
    }
  };
  const getFirstLetterOfName = (username) => username.charAt(0).toUpperCase();

  return (
    <>
      <Form
        onSubmit={handleUpdateUserProfile}
        style={{
          maxWidth: "700px",
          margin: "70px auto",
          width: "90%",
          border: "1px solid rgb(255,255,255,0.2)",
          padding: "15px",
          borderRadius: "6px",
        }}
      >
        <h4
          className="text-center text-light my-4"
          style={{ textAlign: "center" }}
        >
          Update your Profile
        </h4>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label style={{ fontWeight: "bold", fontSize: "20px" }}>
            Username
          </Form.Label>
          <Form.Control
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setUpdateUsername(true);
            }}
            type="text"
            placeholder="Write your username here..."
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label style={{ fontWeight: "bold", fontSize: "20px" }}>
            Email address
          </Form.Label>
          <Form.Control
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            placeholder="Write your email here..."
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupPassword">
          <Form.Label style={{ fontWeight: "bold", fontSize: "20px" }}>
            Profile Image
          </Form.Label>
          <Container
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {profile_image !== "" && showprofile_image === true && (
              <div
                style={{
                  maxWidth: "78px",
                  minHeight: "65px",
                  borderRadius: "50%",
                  color: "white",
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  fontSize: "22px",
                  fontWeight: "bold",
                  backgroundColor: "#151533",
                  border: "1px solid rgb(255,255,255,0.2)",
                }}
              >
                <img
                  src={profile_image}
                  alt="Profile"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
            {profile_image === "" && showprofile_image === false && (
              <div
                style={{
                  minWidth: "70px",
                  minHeight: "65px",
                  borderRadius: "50%",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "22px",
                  fontWeight: "bold",
                  backgroundColor: "#151533",
                  border: "1px solid rgb(255,255,255,0.2)",
                }}
              >
                {getFirstLetterOfName(username)}
              </div>
            )}

            {profile_image !== "" && showprofile_image === true ? (
              <Button
                style={{ width: "85%", backgroundColor: "#0D6EFD" }}
                onClick={() => {
                  setShowprofile_image(false);
                  setProfile_image("");
                }}
              >
                Change Profile Picture
              </Button>
            ) : (
              <>
                <Form.Control
                  onChange={handleCloudinaryFileUpload}
                  name="profile_image"
                  type="file"
                />
                <Button
                  style={{ textWrap: "nowrap" }}
                  onClick={() => {
                    handleCreateProfileImageURL();
                  }}
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
                      <span style={{ marginLeft: "3px" }}>
                        Uploading Picture
                      </span>
                    </>
                  ) : (
                    "Submit Picture"
                  )}
                </Button>
              </>
            )}
          </Container>

          <Form.Group className="mb-3" controlId="Biography.ControlTextarea1">
            <Form.Label style={{ fontWeight: "bold", fontSize: "20px" }}>
              Short Biography
            </Form.Label>
            <Form.Control
              value={biography}
              onChange={(e) => {
                setBiography(e.target.value);
              }}
              as="textarea"
              rows={3}
              placeholder="Write your biography here..."
            />
          </Form.Group>
        </Form.Group>
        <Form.Group className="mb-3" controlId="Profession">
          <Form.Label style={{ fontWeight: "bold", fontSize: "20px" }}>
            Profession
          </Form.Label>
          <Form.Control
            value={profession}
            onChange={(e) => {
              setProfession(e.target.value);
            }}
            type="text"
            placeholder="Write your profession here..."
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="Education">
          <Form.Label style={{ fontWeight: "bold", fontSize: "20px" }}>
            Education
          </Form.Label>
          <Form.Control
            value={education}
            onChange={(e) => {
              setEducation(e.target.value);
            }}
            type="text"
            placeholder="Write your education here..."
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="Location">
          <Form.Label style={{ fontWeight: "bold", fontSize: "20px" }}>
            Location
          </Form.Label>
          <Form.Control
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
            }}
            type="text"
            placeholder="Write your location here..."
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="Hobby">
          <Form.Label style={{ fontWeight: "bold", fontSize: "20px" }}>
            Hobby
          </Form.Label>
          <Form.Control
            value={hobby}
            onChange={(e) => {
              setHobby(e.target.value);
            }}
            type="text"
            placeholder="Write your hobby here..."
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="Personal Website Link">
          <Form.Label style={{ fontWeight: "bold", fontSize: "20px" }}>
            Personal Website Link
          </Form.Label>
          <Form.Control
            value={personal_website_link}
            onChange={(e) => {
              setPersonal_website_link(e.target.value);
            }}
            type="url"
            name="url"
            id="url"
            pattern="https://.*"
            size="30"
            placeholder="https://personalwebsite.com"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="available for work">
          <Form.Label style={{ fontWeight: "bold", fontSize: "20px" }}>
            Are you available for work?
          </Form.Label>
          <Form.Select
            value={workPreference}
            onChange={(e) => {
              setWorkPreference(e.target.value);
            }}
            aria-label="is_available_for_work"
          >
            <option value="">Select your preference</option>
            {workPreferenceList &&
              workPreferenceList.map(
                (preference, index) =>
                  preference && (
                    <option key={index} value={preference}>
                      {preference}
                    </option>
                  )
              )}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="is_email_public">
          <Form.Label style={{ fontWeight: "bold", fontSize: "20px" }}>
            Do you want to show your email on profile?
          </Form.Label>
          <Form.Select
            value={emailPreference}
            onChange={(e) => {
              setEmailPreference(e.target.value);
            }}
            aria-label="is_email_public"
          >
            <option value="">Select your preference</option>
            {emailPreferenceList &&
              emailPreferenceList.map(
                (preference, index) =>
                  preference && (
                    <option key={index} value={preference}>
                      {preference}
                    </option>
                  )
              )}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="is_blogger">
          <Form.Label style={{ fontWeight: "bold", fontSize: "20px" }}>
            Do you want to write blogs?
          </Form.Label>
          <Form.Select
            value={bloggerPreference}
            onChange={(e) => {
              setBloggerPreference(e.target.value);
            }}
            aria-label="bloggerPreference"
          >
            <option value="">Select your preference</option>
            {bloggerPreferenceList &&
              bloggerPreferenceList.map(
                (preference, index) =>
                  preference && (
                    <option key={index} value={preference}>
                      {preference}
                    </option>
                  )
              )}
          </Form.Select>
        </Form.Group>
        <Button
          style={{
            margin: "auto",
            display: "block",
            padding: "5px 40px",
            textAlign: "center",
          }}
          type="submit"
        >
          Submit
        </Button>
      </Form>
      {isLoading && (
        <Spinner
          style={{
            position: "fixed",
            zIndex: "999",
            top: "50%",
            left: "50%",
          }}
          animation="border"
          variant="primary"
          role="status"
          size="lg"
        ></Spinner>
      )}
    </>
  );
}

export default UpdateUserProfile;
