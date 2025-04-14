
import { useEffect, useState } from 'react';

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000');
    setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const prefix = data.system ? '' : `${data.sender}: `;
      setMessages((prev) => [...prev, `${prefix}${data.message}`]);
    };

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (socket && input.trim()) {
      socket.send(input);
      setInput('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat com WebSocket</h2>
      <div style={{ marginBottom: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite uma mensagem"
        />
        <button onClick={sendMessage}>Enviar</button>
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
