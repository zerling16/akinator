import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();
  // State for selected GPT model
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo");

  // State for temperature (0 to 1)
  const [temperature, setTemperature] = useState(0.7);

  // State for frequency penalty (true/false)
  const [frequencyPenalty, setFrequencyPenalty] = useState(false);

  // State for max tokens (100 to 200)
  const [maxTokens, setMaxTokens] = useState(150);

  // Function to handle model selection
  const handleModelSelection = (model) => {
    setSelectedModel(model);
  };

  // Function to handle temperature slider
  const handleTemperatureChange = (event) => {
    setTemperature(parseFloat(event.target.value));
  };

  // Function to handle frequency penalty toggle
  const handleFrequencyPenaltyToggle = () => {
    setFrequencyPenalty(!frequencyPenalty);
  };

  // Function to handle max tokens slider
  const handleMaxTokensChange = (event) => {
    setMaxTokens(parseInt(event.target.value, 10)); // Convert to integer
  };

  // Function to save settings and send to the backend using Axios
  const saveSettings = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/update-settings",
        {
          model: selectedModel,
          temperature: temperature,
          frequencyPenalty: frequencyPenalty,
          maxTokens: maxTokens,
        }
      );

      // Handle the response from the backend
      console.log(response.data.message); // Optionally handle success message
      navigate("/");
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  return (
    <div style={settingsPageStyle}>
      <h1>Settings</h1>

      {/* GPT Model Selection */}
      <div style={sectionStyle}>
        <h3>Select GPT Model</h3>
        <div style={buttonContainerStyle}>
          {["gpt-3.5-turbo", "gpt-4o", "gpt-4-turbo", "gpt-4.1-mini"].map(
            (model) => (
              <button
                key={model}
                onClick={() => handleModelSelection(model)}
                style={{
                  ...buttonStyle,
                  backgroundColor: selectedModel === model ? "#007bff" : "#ccc",
                }}
              >
                {model}
              </button>
            )
          )}
        </div>
      </div>

      {/* Temperature Slider */}
      <div style={sectionStyle}>
        <h3>Temperature</h3>
        <input
          type="range"
          min="0"
          max="2"
          step="0.01"
          value={temperature}
          onChange={handleTemperatureChange}
          style={sliderStyle}
        />
        <p>Temperature: {temperature}</p>
      </div>

      {/* Frequency Penalty Toggle */}
      <div style={sectionStyle}>
        <h3>Frequency Penalty</h3>
        <button
          onClick={handleFrequencyPenaltyToggle}
          style={{
            ...buttonStyle,
            backgroundColor: frequencyPenalty ? "#007bff" : "#ccc",
          }}
        >
          {frequencyPenalty ? "True" : "False"}
        </button>
      </div>

      {/* Max Tokens Slider */}
      <div style={sectionStyle}>
        <h3>Max Tokens</h3>
        <input
          type="range"
          min="100"
          max="200"
          value={maxTokens}
          onChange={handleMaxTokensChange}
          style={sliderStyle}
        />
        <p>Max Tokens: {maxTokens}</p>
      </div>

      {/* Save Settings Button */}
      <div style={sectionStyle}>
        <button onClick={saveSettings} style={saveButtonStyle}>
          Save Settings
        </button>
      </div>
    </div>
  );
};

// Styling
const settingsPageStyle = {
  textAlign: "center",
  padding: "20px",
  background: "linear-gradient(to right, #4a90e2, #6fc3df)",
  height: "100vh",
};

const sectionStyle = {
  margin: "20px 0",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "15px",
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "8px",
  border: "none",
  color: "white",
};

const sliderStyle = {
  width: "80%",
  margin: "10px 0",
};

const saveButtonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "8px",
  border: "none",
  background: "#28a745",
  color: "white",
};

export default SettingsPage;
