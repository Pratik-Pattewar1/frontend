import React, { useState, useEffect } from 'react';
import './Chatbox.css';
import { FaRobot, FaQuestionCircle, FaPaperPlane, FaSun, FaMoon } from 'react-icons/fa';

const predefinedQuestions = [
  "What are your support hours?",
  "How can I reset my password?",
  "Where is my order?",
  "Can I speak to a human agent?"
];

export default function Chatbox() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const sendToBackend = async (question) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      return data.answer;
    } catch (error) {
      return "Sorry, I couldn't reach the server.";
    }
  };

  const handleButtonClick = async (question) => {
    setMessages(prev => [...prev, { sender: 'user', text: question }]);
    setIsTyping(true);
    const reply = await sendToBackend(question);
    setIsTyping(false);
    setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: userInput }]);
    setIsTyping(true);
    const reply = await sendToBackend(userInput);
    setIsTyping(false);
    setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    setUserInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const chatBody = document.querySelector(".chatbox-body");
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <div className="chatbox-wrapper">
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? <FaMoon /> : <FaSun />}
      </button>

      <div className="chatbox">
        <div className="chatbox-header">
          <FaRobot /> <span>Alpha Chatbox</span>
        </div>

        <div className="chatbox-body">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>

        <div className="chatbox-buttons">
          {predefinedQuestions.map((q, i) => (
            <button key={i} onClick={() => handleButtonClick(q)}>
              <FaQuestionCircle /> <span>{q}</span>
            </button>
          ))}
        </div>

        <div className="chatbox-input">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your question..."
          />
          <button onClick={handleSend}>
            <FaPaperPlane /> Send
          </button>
        </div>
      </div>

      <div className="chatbox-video">
        <video src="/robo.webm" autoPlay loop muted />
      </div>
    </div>
  );
}