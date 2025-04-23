import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Store conversation history per session
let conversations = {};

// Store settings in memory (can be replaced with a database)
let settings = {
  model: "gpt-3.5-turbo",
  temperature: 0.7,
  frequencyPenalty: false,
  maxTokens: 200,
};

const generateSessionId = () => {
  return Math.random().toString(36).substr(2, 9); // Simple session ID generator
};

app.post("/api/start-new-session", (req, res) => {
  const sessionId = generateSessionId(); // Generate a unique session ID
  console.log("Generated Session ID:", sessionId); // Log the generated sessionId
  res.json({ sessionId }); // Send the new session ID back to the frontend
});

// Endpoint to update settings
app.post("/api/update-settings", (req, res) => {
  const { model, temperature, frequencyPenalty, maxTokens } = req.body;

  // Update settings
  settings = {
    model,
    temperature,
    frequencyPenalty,
    maxTokens,
  };

  console.log("Updated settings:", settings);
  res.json({ message: "Settings updated successfully!" });
});

app.post("/api/photo", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url; // Get the image URL
    res.json({ imageUrl }); // Return the URL of the generated image
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

// API endpoint to get settings
app.get("/api/get-settings", (req, res) => {
  res.json(settings);
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    console.log("Hello, sessionId");

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required." });
    }

    // Initialize conversation history for a new session
    if (!conversations[sessionId]) {
      conversations[sessionId] = [];
    }

    // Add user message to the conversation history
    conversations[sessionId].push({ role: "user", content: message });

    // Send the full conversation history to OpenAI
    const response = await openai.chat.completions.create({
      model: settings.model, // Use the updated model
      messages: conversations[sessionId],
      temperature: settings.temperature, // Use the updated temperature
      max_tokens: settings.maxTokens, // Use the updated max_tokens
    });

    const botMessage = response.choices[0].message.content;
    // Add AI response to the conversation history
    conversations[sessionId].push({ role: "assistant", content: botMessage });
    res.json({ response: botMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
