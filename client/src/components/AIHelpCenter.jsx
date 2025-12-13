import { useState } from "react";
import axios from "axios";

export default function AIHelpCenter({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages([...messages, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/ai/chat", {
        message: input,
      });

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: res.data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "AI is unavailable right now." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white shadow-lg rounded-lg border z-50">
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-semibold">AI Help Center</h3>
        <button onClick={onClose}>✖</button>
      </div>

      <div className="p-3 h-64 overflow-y-auto text-sm space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              m.role === "user"
                ? "bg-blue-100 text-right"
                : "bg-gray-100"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && <p>Typing...</p>}
      </div>

      <div className="flex border-t">
        <input
          className="flex-1 p-2 text-sm outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about booking..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="px-3 text-blue-600"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
