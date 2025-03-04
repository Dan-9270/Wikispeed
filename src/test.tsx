import { useState } from "react";
import socket from "./utils/websocket";

function Test() {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    socket.send(message);
    setMessage("");
  };

  return (
    <div>
      <h1>WebSocket Chat</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Envoyer</button>
    </div>
  );
}

export default Test;
