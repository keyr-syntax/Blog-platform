import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { BlogContext } from "./ContextProvider.jsx";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "react-bootstrap/Spinner";
function AIGeneratedContent() {
  const { BACKEND_API } = useContext(BlogContext);
  const [question, setQuestion] = useState("");
  const [responseFromAI, setResponseFromAI] = useState("");
  const [generatingContent, setGeneratingContent] = useState(false);

  const handleGenerateAIContent = async (e) => {
    e.preventDefault();
    if (question === "") {
      toast.error("Write your question to generate content");
      return;
    }
    const token = localStorage.getItem("token");

    try {
      setGeneratingContent(true);
      const data = await fetch(`${BACKEND_API}/api/ai/generateaicontent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: question,
        }),
      });
      const response = await data.json();

      if (response.success === true) {
        setGeneratingContent(false);
        setResponseFromAI(response.content);
      } else if (response.success === false) {
        setGeneratingContent(false);
        setResponseFromAI("");
      }
    } catch (error) {
      console.log("Error while sending question to AI", error);
    }
  };

  return (
    <>
      <Form
        style={{
          margin: "80px auto 10px auto",
          width: "90%",
          maxWidth: "700px",
        }}
        onSubmit={handleGenerateAIContent}
      >
        <h5 style={{ textAlign: "center" }}>
          Generate blog content by using AI
        </h5>
        <Form.Group
          className="mb-3"
          controlId="generateAIcontent.ControlTextarea1"
        >
          <Form.Label
            style={{
              margin: "10px auto",
              color: "green",
              fontWeight: "bold",
              textAlign: "center",
              display: "block",
            }}
          >
            ( Blog editorial encourages you to write your own original content){" "}
          </Form.Label>
          <Form.Control
            as="textarea"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
            rows={3}
            placeholder="Enter your question here"
          />
        </Form.Group>
        <Button style={{ width: "100%" }} type="submit" variant="primary">
          {generatingContent === true ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span style={{ marginLeft: "3px" }}>Processing...</span>
            </>
          ) : (
            "Send"
          )}
        </Button>
      </Form>
      {responseFromAI !== "" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "20px auto",
            whiteSpace: "pre-wrap",
            width: "90%",
            maxWidth: "700px",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "6px",
          }}
        >
          <p>Response from Chatgpt</p>
          <p>{responseFromAI}</p>
        </div>
      )}
    </>
  );
}

export default AIGeneratedContent;
