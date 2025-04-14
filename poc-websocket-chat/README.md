# 🧠 WebSocket Chat POC

This project is a **Proof of Concept (POC)** of a real-time chat using **WebSockets**, with **React (frontend)** and **Node.js (backend)**. The goal is to demonstrate how bidirectional communication works between client and server using WebSockets, simulating a conversation between two users.

---

## 📦 Technologies Used

- **Frontend**: React + Vite
- **Backend**: Node.js with `ws` (WebSocket server)
- **Communication Protocol**: WebSocket (`ws://localhost:4000`)

---

## 💬 What Are WebSockets?

WebSockets are a communication protocol that enables a **persistent and bidirectional connection** between the client and the server — different from the traditional request/response model in HTTP.

While HTTP opens and closes a connection for each request, a WebSocket **keeps the connection open**, allowing continuous real-time data exchange.

---

## 🚀 How to Run the Project

### 1. Backend

```bash
cd backend
npm install
npm start
```

> WebSocket server running at `ws://localhost:4000`

---

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

> Access the app at: [http://localhost:5173](http://localhost:5173)

---

## 👀 How to Test

1. Open **two different browser tabs or windows**
2. Go to: [http://localhost:5173](http://localhost:5173) in both
3. Type a message in one tab and watch it appear in the other — in real time

Each tab is treated as a different user:

- `You`: indicates your own message
- `User X`: indicates messages from other users

---

## ✅ Advantages of WebSockets

- **Real-time communication** without polling
- **Less overhead** than HTTP (only one open connection)
- Ideal for apps that require **constant interaction** between client and server
- **Bidirectional**: the server can also send messages proactively

---

## ⚠️ Disadvantages

- Requires the server to **maintain connection state** (more memory usage)
- Might be blocked by **old proxies or firewalls**
- Needs reconnection and fallback logic for unstable networks
- Slightly **harder to scale horizontally** than stateless REST APIs

---

## 🛠️ Common Use Cases

- **Chat applications**
- **Real-time notifications**
- **Online multiplayer games**
- **Live dashboards**
- **Streaming (video/audio)**
- **Live collaboration tools** (like Google Docs, Figma, etc.)

---

## 📁 Project Structure

```
websocket-chat-poc/
├── backend/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       └── main.jsx
```

---

## 🤔 Want to Take It Further?

- Add **custom usernames**
- Create **chat rooms**
- Persist messages with a database
- Use **Socket.IO** for additional features (events, fallback, reconnection)
- Integrate with authentication/login

---
