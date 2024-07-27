// src/components/DynamicChat.tsx
import { useSocket } from "@/app/hooks/useSocket";
import { useState, useEffect, useRef } from "react";

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

interface DynamicChatProps {
  rideId: string;
  userId: string;
}

const DynamicChat: React.FC<DynamicChatProps> = ({ rideId, userId }) => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Socket:", socket);
    console.log("Is connected:", isConnected);

    if (socket && isConnected) {
      console.log("Joining ride:", rideId);
      socket.emit("join-ride", rideId);

      socket.on("new-message", (message: Message) => {
        console.log("New message received:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        console.log("Cleaning up socket listeners");
        socket.off("new-message");
      };
    }
  }, [socket, isConnected, rideId]);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() && socket && isConnected) {
      const messageData = {
        sender: userId,
        content: inputMessage,
        timestamp: new Date(),
      };
      socket.emit("send-message", { rideId, message: messageData });
      setInputMessage("");
    }
  };

  if (!socket || !isConnected) {
    return <div>Connecting to chat...</div>;
  }

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

export default DynamicChat;
