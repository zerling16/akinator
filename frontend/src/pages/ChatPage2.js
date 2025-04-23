import React, { useState, useEffect } from "react";
import axios from "axios";
import johanMog from "../images/johan2.jpeg";
import { v4 as uuidv4 } from "uuid"; // Import UUID for session tracking
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./button.css"; // Import the CSS file

const ChatPage2 = () => {
  const navigate = useNavigate();
  const [response, setResponse] = useState("");
  const [sessionId, setSessionId] = useState(
    localStorage.getItem("sessionId") || uuidv4()
  );
  const [imageUrl, setImageUrl] = useState("");

  const sendMessage = async (message) => {
    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message,
        sessionId,
      });
      console.log(res.data.response);
      if (res.data.response[0] == "F") {
        const prompt =
          "Generate an image of the subject of: " + res.data.response;
        getPhoto(prompt);
        setResponse(res.data.response);
      } else {
        setResponse(res.data.response);
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error connecting to the server.");
    }
  };

  const getPhoto = async (message) => {
    try {
      const res = await axios.post("http://localhost:5000/api/photo", {
        prompt: message,
      });
      setImageUrl(res.data.imageUrl); // Set the image URL in the state
    } catch (error) {
      console.error("Error", error);
      setImageUrl("");
    }
  };

  useEffect(() => {
    // const initializeSession = async () => {
    //   try {
    //     const res = await axios.post(
    //       "http://localhost:5000/api/start-new-session"
    //     );
    //     const storedSessionId = res.data.sessionId; // Get the new session ID from the response
    //     localStorage.setItem("sessionId", storedSessionId); // Store it in localStorage
    //     setSessionId(storedSessionId);
    //   } catch (error) {
    //     console.error("Hello, Error starting a new session:", error);
    //     return;
    //   }

    // Send the initial message to OpenAI (start the conversation)
    sendMessage(
      "Lets start a new game. You are Akinator and are trying to guess my object. Begin by asking a yes or no question and continue asking questions based on my responses until you are confident you know the answer. Once you are 99% confident, tell me 'FINAL ANSWER: Is your object ____' with your guess and include a ! at the end. When you respond to me, only ask questions and write nothing else."
    );
    // };

    // initializeSession(); // Run the function when the component is mounted
  }, []);

  return (
    <div style={pageStyle}>
      {/* Akinator Image */}
      {(imageUrl && (
        <img src={imageUrl} alt="Generated" style={imageStyle} />
      )) || <img src={johanMog} alt="johanMog" style={imageStyle} />}

      {/* Response Box */}
      {response && (
        <div style={responseStyle}>
          <p>{response}</p>
        </div>
      )}

      {/* Button Container */}
      <div style={buttonContainerStyle}>
        {["Yes", "No", "I dont know", "Probably", "Probably Not"].map(
          (msg, index) => (
            <button
              className="button"
              key={index}
              onClick={() => {
                sendMessage(msg);
                console.log(msg);
              }}
            >
              {msg}
            </button>
          )
        )}
      </div>
      <FaHome
        size={50}
        onClick={() => navigate("/settings")} // Navigate to the SettingsPage
        style={settingsIconStyle}
      />
    </div>
  );
};

/* Styles */
const pageStyle = {
  textAlign: "center",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(to right, #4a90e2, #6fc3df)",
  position: "relative",
};

const imageStyle = {
  width: "220px",
  height: "auto",
  marginTop: "20px", // Space from the top
  marginBottom: "20px", // Space between the image and the buttons
};

// const questionStyle = {
//   background: "white",
//   padding: "15px 25px",
//   borderRadius: "20px",
//   fontSize: "18px",
//   fontWeight: "bold",
//   boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
// };

const buttonContainerStyle = {
  marginTop: "20px",
  display: "flex",
  flexWrap: "wrap",
  gap: "15px",
  justifyContent: "center",
  background: "rgba(255, 255, 255, 0.2)",
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
};

const buttonStyle = {
  padding: "12px 20px",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "10px",
  border: "none",
  background: "white",
  color: "#333",
  fontWeight: "bold",
  transition: "0.3s",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const responseStyle = {
  marginTop: "25px",
  padding: "20px",
  background: "rgba(255, 255, 255, 0.8)",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  fontSize: "20px",
  fontWeight: "bold",
};

const settingsIconStyle = {
  position: "absolute",
  top: 20,
  right: 20,
  cursor: "pointer",
  color: "white",
};

export default ChatPage2;
