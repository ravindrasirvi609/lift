// src/components/DynamicChat.tsx
import { useSocket } from "@/app/hooks/useSocket";
import axios from "axios";
import { useState, useEffect, useRef, use } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";

interface Message {
  message: {
    sender: string;
    content: string;
    timestamp: Date;
  };
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
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (socket && isConnected) {
      socket.emit("join-ride", rideId);

      socket.on("new-message", (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off("new-message");
      };
    }
  }, [socket, isConnected, rideId]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.post(`/api/ride/messages`, { rideId });
      console.log("response", response);
    };

    fetchMessages();
  }, [rideId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (inputMessage.trim() && socket && isConnected) {
      setIsSending(true);
      const messageData = {
        sender: userId,
        content: inputMessage,
        timestamp: new Date(),
      };
      await socket.emit("send-message", { rideId, message: messageData });
      setInputMessage("");
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!socket || !isConnected) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <FaSpinner className="animate-spin text-4xl text-gray-500" />
        <span className="ml-3 text-gray-600">Connecting to chat...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-800 text-white p-4">
        <h2 className="text-xl font-semibold">Ride Chat</h2>
      </div>
      <div
        ref={chatContainerRef}
        className="h-96 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.message.sender === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.message.sender === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="break-words">{msg.message.content}</p>
              <p className="text-xs mt-1 opacity-75">
                {new Date(msg.message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            disabled={isSending || !inputMessage.trim()}
            className={`bg-blue-500 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isSending || !inputMessage.trim()
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
          >
            {isSending ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicChat;
