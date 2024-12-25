require("dotenv").config();
const axios = require("axios");

const generateBlogContentByAI = async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: req.body.question }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    if (response) {
      return res.status(200).json({
        success: true,
        message: "Content generated successfully",
        content: response.data.choices[0].message.content,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "AI failed to generate response",
      });
    }
  } catch (error) {
    console.log("Internal server error while generating response by AI", error);
    res.status(500).json({
      success: false,
      message: "AI failed to generate response.Please try again.",
    });
  }
};

module.exports = generateBlogContentByAI;
