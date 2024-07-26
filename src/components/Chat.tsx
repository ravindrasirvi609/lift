// app/components/Chat.tsx

import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

interface ChatProps {
  rideId: string;
  userId: string;
}

const Chat: React.FC<ChatProps> = ({ rideId, userId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      const newSocket = io();
      setSocket(newSocket);

      newSocket.emit("join-ride", rideId);

      newSocket.on("new-message", (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    };

    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [rideId, socket]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() && socket) {
      const messageData = {
        sender: userId,
        content: inputMessage,
        timestamp: new Date(),
      };
      socket.emit("send-message", { rideId, message: messageData });
      setInputMessage("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div ref={chatContainerRef} className="h-64 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${
              msg.sender === userId
                ? "bg-[var(--color-primary)] text-white self-end"
                : "bg-gray-200 self-start"
            }`}
          >
            <p>{msg.content}</p>
            <small className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-grow border rounded-l-lg p-2"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="btn-primary rounded-l-none">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
