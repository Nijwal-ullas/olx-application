import { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/Api";
import "../styles/AIChatbot.css";

function AIChatbot({ onClose }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/ai/chat", {
        message: userMessage,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.answer,
        },
      ]);
    } catch (error) {
      console.log("CHAT ERROR:", error);

      toast.error("AI assistant is unavailable");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  return (
    <div className="ai-chatbot">
      <div className="chat-header">
        <h3> OLX Assistant</h3>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="chat-welcome">Hi! How can I help you?</p>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            {msg.content}
          </div>
        ))}

        {loading && <div className="chat-message assistant">Thinking...</div>}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={sendMessage} disabled={loading}>
          {loading ? "..." : "➤"}
        </button>
      </div>
    </div>
  );
}

export default AIChatbot;
