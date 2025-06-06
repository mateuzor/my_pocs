import { useEffect, useState } from "react";

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");
    setSocket(ws);

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (socket && input.trim()) {
      socket.send(input);
      setMessages((prev) => [...prev, `You: ${input}`]);
      setInput("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>WebSocket Chat</h2>
      <div style={{ marginBottom: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
