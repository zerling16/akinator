import React from "react";
import { useNavigate } from "react-router-dom";
import johan1 from "../images/johan.png";
import { FaCog } from "react-icons/fa";
import "./button.css"; // Import the CSS file

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={pageStyle}>
      <h1 style={{ fontSize: "55px" }}>Welcome to Johanator!</h1>
      <img src={johan1} alt="johan1" style={imageStyle} />
      <h2 style={responseStyle}>What category are you thinking of?</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
        <button onClick={() => navigate("/chat")} className="button">
          Characters
        </button>
        <button onClick={() => navigate("/chat2")} className="button">
          Objects
        </button>
        <button onClick={() => navigate("/chat3")} className="button">
          Animals
        </button>
      </div>
      {/* Settings Icon in the top-right */}
      <FaCog
        size={50}
        onClick={() => navigate("/settings")} // Navigate to the SettingsPage
        style={settingsIconStyle}
      />
    </div>
  );
};

const buttonStyle = {
  padding: "15px 30px",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "8px",
  border: "none",
  background: "#007bff",
  color: "white",
};

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
  width: "250px",
  height: "auto",
};

const settingsIconStyle = {
  position: "absolute",
  top: 20,
  right: 20,
  cursor: "pointer",
  color: "white",
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

export default HomePage;
